import pandas as pd 
import torch
import torch.nn as nn
import operator

THRESHOLD = 0.8

df = pd.read_csv('dataset.csv')

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

    return t1

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

def get_active_symptoms(active_symptoms):
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
