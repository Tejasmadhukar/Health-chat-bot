from flask import Flask, request
from flask_cors import CORS
import os
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app)

os.environ['OPENAI_API_KEY'] = os.getenv('OPENAI_API_KEY')
embeddings = OpenAIEmbeddings()
vectordb = Chroma(persist_directory="chroma/", embedding_function=embeddings)
qa = RetrievalQA.from_chain_type(
    llm=OpenAI(), chain_type="stuff", retriever=vectordb.as_retriever())


@app.route("/")
def index():
    return "Health route"


@app.route("/response", methods=["POST"])
def get_bot_response():
    userText = request.json.get('message')
    result = qa.run(userText)
    return {'text': result}


if __name__ == '__main__':
    app.run(port=80)
