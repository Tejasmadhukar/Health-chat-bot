from flask import Flask, render_template,request,jsonify, g
from flask_cors import CORS
import pandas as pd 
import torch
import torch.nn as nn
import operator
import os
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA

app = Flask(__name__)
CORS(app)

THRESHOLD = 0.8

df = pd.read_csv('dataset.csv')

data = []
active_symptoms = []
pre = []

def get_data():
    symp = []
    for j in range(df.shape[0]):
        for i in df.iloc[j,1:]:
            if pd.isna(i):
                continue
            if i not in symp:
                symp.append(i)
    t1 = []
    for i in symp:
        if i not in t1:
            t1.append(i.replace('_',' ').strip())

    res = []
    for i in t1:
        t = {}
        t['name'] = i
        res.append(t)
        
    return res

class Diagnose(nn.Module):
    def __init__(self, input_size, hidden_size, output_size):
        super(Diagnose, self).__init__()
        self.fc1 = nn.Linear(input_size, hidden_size)
        self.relu1 = nn.Dropout(0.5)
        self.fc2 = nn.Linear(hidden_size, 128)
        self.relu2 = nn.Dropout(0.5)
        self.fc3 = nn.Linear(128, output_size)
        self.softmax = nn.Softmax(dim=1)

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = self.relu1(x)
        x = torch.relu(self.fc2(x))
        x = self.relu2(x)
        x = self.fc3(x)
        x = self.softmax(x)
        return x
    
input_size = 131
hidden_size = 128
output_size = 41
model = Diagnose(input_size, hidden_size, output_size)
model.load_state_dict(torch.load('chatbotmodelnew.pth'))

def get_active_symptoms():
    symptoms = []
    for j in range(df.shape[0]):
        for i in df.iloc[j,1:]:
            if pd.isna(i):
                continue
            if i not in symptoms:
                symptoms.append(i)
    formatted_symptoms = []
    for i in symptoms:
        formatted_symptoms.append(i.replace("_", " ").strip())
    dictionary_symptoms = {}
    for n, i in enumerate(formatted_symptoms):
        dictionary_symptoms[i] = n
    vector = [0] * len(formatted_symptoms)
    for i in active_symptoms:
        vector[dictionary_symptoms[i]] = 1
    return vector, dictionary_symptoms

def get_common_symptoms():    
    freq = {}
    for j in range(df.shape[0]):
        for i in df.iloc[j,1:]:
            if pd.isna(i):
                continue
            if i not in freq:
                freq[i] = 1
            else:
                freq[i] += 1
    sort = dict(sorted(freq.items(),key=operator.itemgetter(1),reverse=True))
    temp = list(dict(list(sort.items())[:10]).keys())
    res = []
    for i in temp:
        res.append(i.replace('_',' ').strip())
        
    return res

def get_disease_data():
    disease_data = {}
    for i in df['Disease']:
        disease_data[i] = []
    
    for j in range(df.shape[0]):
        for i in df.iloc[j, 1:]:
            if pd.isna(i):
                continue
            # print(disease_data[df.iloc[j, 0]])
            if i not in disease_data[df.iloc[j, 0]]:
                disease_data[df.iloc[j, 0]].append(i)

    res = {}
    for k, v in disease_data.items():
        res[k] = []
        for i in v:
            res[k].append(i.replace('_',' ').strip())

    return res

disease_data = get_disease_data()

def compute_probability(active_symptoms, disease_data):
    probabilities = {}
    termination_flag = False
    for key, value in disease_data.items():
        probabilities[key] = 0
        for i in active_symptoms:
            if i in value:
                probabilities[key] += 1
        probabilities[key] = probabilities[key] / len(value)
        if(probabilities[key] > THRESHOLD):
            termination_flag = True
    return dict(sorted(probabilities.items(), key = operator.itemgetter(1), reverse=True)), termination_flag

def recommender_system(probabilities, active_symptoms, disease_data, fail = 0):
    display_symptoms = []
    do_not_display = []
    termination = False
    if fail > 0:
        for _ in range(fail):
            for key in list(probabilities.keys()):
                count = 0
                if(len(display_symptoms) >= 10):
                    break
                for i in disease_data[key]:
                    if count == 3:
                        continue
                    if i not in active_symptoms and i not in do_not_display:
                        do_not_display.append(i)
                        count += 1
    for key in list(probabilities.keys()):
        count = 0
        if(termination):
            break
        for i in disease_data[key]:
            if(len(display_symptoms) == 10):
                termination = True
                break
            if count == 3:
                continue
            if i not in active_symptoms and i not in display_symptoms and i not in do_not_display:
                display_symptoms.append(i)
                count += 1
    return display_symptoms

def diagnosis(vector, dictionary_symptoms):
    res = []
    diseases = []
    for i in df['Disease']:
        if i not in diseases:
            diseases.append(i)
    dictionary = {}
    for n, i in enumerate(diseases):
        dictionary[n] = i
    model.eval()
    with torch.no_grad():
        ypred = model(torch.Tensor(torch.Tensor([vector])))
        for i in ypred.tolist():
            for j in i:
                if j > 0.2:
                    print(dictionary[i.index(j)])
                    res.append(dictionary[i.index(j)])
        return res

data = get_data()
common_symptoms = get_common_symptoms()

@app.before_request
def initialize():
    os.environ['OPENAI_API_KEY'] = os.getenv('API_KEY')
    embeddings = OpenAIEmbeddings()
    vectordb = Chroma(persist_directory = "chroma/", embedding_function = embeddings)
    g.qa = RetrievalQA.from_chain_type(llm=OpenAI(), chain_type="stuff", retriever=vectordb.as_retriever())


@app.route("/getSymptoms")
def Symptoms():
    if len(active_symptoms)==0:
        response = {'recommender' : common_symptoms}
        return jsonify(response)
    
    disease_data = get_disease_data()
    display_symptoms = []
    fail = 0
    pred_class = ""
    response = ""
    probabilities, termination_flag = compute_probability(active_symptoms, disease_data)
    print(probabilities)

    if(len(active_symptoms)>=5):
        vector, dictionary = get_active_symptoms()
        result = diagnosis(vector,dictionary)
        active_symptoms.clear()
        response = {'diagnosis' : result}
        return response

    if(pred_class == "NotDetected"):
        fail += 1
    else:
        fail = 0

    display_symptoms = recommender_system(probabilities, active_symptoms, disease_data, fail)

    response = {'recommender' : display_symptoms}

    return jsonify(response)

@app.route('/recommender')
def recommender():
    label = request.args.get('symptom', '')

    if label in active_symptoms:
        active_symptoms.remove(label)
    else:
        active_symptoms.append(label)

    print(active_symptoms)

    return [{}]



@app.route('/append')
def append():
    label = request.args.get('a', '')

    if label in active_symptoms:
        active_symptoms.remove(label)
    else:
        active_symptoms.append(label)

    print(active_symptoms)

    if(len(active_symptoms)>=5):
        vector, dictionary = get_active_symptoms()
        res = diagnosis(vector,dictionary)
        active_symptoms.clear()
        return res
    
    # res = []
    # for i in active_symptoms:
    #     t = {}
    #     t['name'] = i
    #     res.append(t)
        
    # return jsonify(res)


@app.route('/search')
def search():
    query = request.args.get('q', '')
    results = []
    for item in data:
        if query.lower() in active_symptoms:
            continue
        if query.lower() in item['name'].lower():
            results.append(item)
    return jsonify(results)




display_symptoms = []
fail = 0

@app.route("/")
def index():
    return "Hello"

# @app.route("/response")
# def get_bot_response():
#     userText = request.args.get('msg')
#     print(userText)
#     result = g.qa.run(userText)
#     return result

if __name__ == '__main__':
    app.run(debug=True,port=8005)
