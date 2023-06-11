from flask import Flask, render_template,request,jsonify, g
from flask_cors import CORS
import os
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA
from utils import get_disease_data, get_data, get_active_symptoms, get_common_symptoms
from utils import diagnosis, compute_probability, recommender_system

app = Flask(__name__)
CORS(app)

data = []
active_symptoms = []
pre = []

disease_data = get_disease_data()
data = get_data()
common_symptoms = get_common_symptoms()

@app.before_request
def initialize():
    os.environ['OPENAI_API_KEY'] = os.getenv('API_KEY')
    embeddings = OpenAIEmbeddings()
    vectordb = Chroma(persist_directory = "chroma/", embedding_function = embeddings)
    g.qa = RetrievalQA.from_chain_type(llm=OpenAI(), chain_type="stuff", retriever=vectordb.as_retriever())

@app.route("/")
def index():
    return "Welcome to Health Chat Bot!!"

@app.route("/getSymptoms")
def Symptoms():
    if len(active_symptoms)==0:
        response = {'recommender' : common_symptoms}
        return jsonify(response)
    
    disease_data = get_disease_data()
    fail = 0
    pred_class = ""
    response = ""
    probabilities, termination_flag = compute_probability(active_symptoms, disease_data)
    print(probabilities)

    if(len(active_symptoms)>=5):
        vector, dictionary = get_active_symptoms(active_symptoms)
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
    label = request.args.get('symptom')

    if label in active_symptoms:
        active_symptoms.remove(label)
    else:
        active_symptoms.append(label)

    print(active_symptoms)

    return [{}]

@app.route('/append')
def append():
    label = request.args.get('symptom')
    response = {}
    if label in active_symptoms:
        active_symptoms.remove(label)
        response['removed'] = label
    else:
        active_symptoms.append(label)
        response['added'] = label

    print(active_symptoms)

    if(len(active_symptoms)>=3):
        vector, dictionary = get_active_symptoms(active_symptoms)
        res = diagnosis(vector,dictionary)
        active_symptoms.clear()
        response['diagnosis'] = res
        return response
    
    return response
    
    
@app.route('/search')
def search():
    query = request.args.get('search_symptom')
    results = []
    for symptom in data:
        if query.lower() in active_symptoms:
            continue
        if query.lower() in symptom.lower():
            results.append(symptom)
    response = {'search_results': results}
    return jsonify(response)

@app.route("/response", methods=["POST"])
def get_bot_response():
    userText = request.json.get('message')
    print(userText)
    result = g.qa.run(userText)
    return {'text':result}

if __name__ == '__main__':
    app.run(debug=True,port=8005)
