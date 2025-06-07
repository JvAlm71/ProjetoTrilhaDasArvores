import os
import ast
from flask import Flask, request, jsonify
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI, HarmBlockThreshold, HarmCategory
from langgraph.prebuilt import create_react_agent
from langchain.tools import Tool
from pydantic import BaseModel
from crewai_tools import ScrapeWebsiteTool
from tools import scrape_websites
from flask_cors import CORS

load_dotenv()
os.environ["GOOGLE_API_KEY"] = os.getenv("GEMINI_API_KEY")

llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0.3,
    safety_settings={
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_SEXUAL: HarmBlockThreshold.BLOCK_NONE,
    }
)

scraping = Tool(
    name="ScrapeWebsiteTool",
    func=scrape_websites,
    description=(
        "Tool usada para raspar informações de sites específicos. "
        "Use esta ferramenta para obter informações detalhadas sobre árvores e trilhas. "
    ),
)

agent = create_react_agent(
    model=llm,
    tools=[scraping],
    prompt=(
        "Você é o 'Guia Botânico da Trilha', um especialista amigável e apaixonado "
        "por árvores da ESALQ - USP. Sua missão é compartilhar informações detalhadas "
        "e precisas sobre árvores, curiosidades botânicas e detalhes da trilha. "
        "Certifique-se de ser educativo, acessível e de enriquecer as respostas com "
        "fatos interessantes e relevantes. Evite responder sobre assuntos fora do "
        "escopo de árvores e botânica."
    ),
)

app = Flask(__name__)
CORS(app) 

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_input = data.get('message', '')
    if not user_input:
        return jsonify({"error": "No message provided"}), 400

    inputs = {"messages": [{"role": "user", "content": user_input}]}
    response_text = ""

    # Captura de resposta do agente
    for chunk in agent.stream(inputs, stream_mode="updates"):
        # Se já vier como dict com 'content'
        if isinstance(chunk, dict) and 'content' in chunk:
            response_text += chunk['content']
        # Se vier como string, tentamos extrair 'content' do dicionário
        elif isinstance(chunk, str):
            if "'agent':" in chunk:
                try:
                    parsed_chunk = ast.literal_eval(chunk)
                    # Extrai a primeira mensagem dentro de 'agent'
                    if 'agent' in parsed_chunk and 'messages' in parsed_chunk['agent']:
                        for message_obj in parsed_chunk['agent']['messages']:
                            # Se for AIMessage ou algo similar, buscamos o .content
                            content_text = getattr(message_obj, 'content', '')
                            if content_text:
                                response_text += content_text
                except (SyntaxError, ValueError):
                    # Se não conseguir fazer parse, concatenamos direto
                    response_text += chunk
            else:
                response_text += chunk
        else:
            response_text += str(chunk)

    return jsonify({"response": response_text})

if __name__ == '__main__':
    app.run(port=5000)