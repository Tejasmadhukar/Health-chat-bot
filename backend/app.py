from flask import Flask, request
from flask_cors import CORS
import os
from langchain_openai.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAI
from langchain.chains import RetrievalQA
from dotenv import load_dotenv
import json
import os

load_dotenv()
app = Flask(__name__)
CORS(app)

os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")
embeddings = OpenAIEmbeddings()
vectordb = Chroma(persist_directory="chroma/", embedding_function=embeddings)
qa = RetrievalQA.from_chain_type(
    llm=OpenAI(), chain_type="stuff", retriever=vectordb.as_retriever()
)


@app.route("/")
def index():
    return "Health route"


@app.route("/response", methods=["POST"])
def get_bot_response():
    try:
        userText = request.json.get("message")
        print(userText)
        result = qa.invoke(userText)
        with open("temp.json", "a") as w:
            json.dump({"text": result}, w)
        return {"text": result}
    except Exception as e:
        error_message = str(e)
        print(f"Error: {error_message}")
        return {"error": error_message}, 500


if __name__ == "__main__":
    p = int(os.getenv("PORT", 80))
    app.run(host="0.0.0.0", port=p)
