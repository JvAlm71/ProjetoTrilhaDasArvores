import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI, HarmBlockThreshold, HarmCategory
from langgraph.prebuilt import create_react_agent
from langchain.tools import Tool
from pydantic import BaseModel, Field


load_dotenv()
os.environ["GOOGLE_API_KEY"] = os.getenv("GEMINI_API_KEY")

class RespostasArvore(BaseModel):
    resposta : str


llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0.5,
    safety_settings={
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
    }
    
)



structured_prompt = """ 
Instruções:
1. Seja detalhado e sucinto. 
2. Retorne somente JSON no formato:
{"resposta": "texto final"}
"""

agent = create_react_agent(
    model=llm,
    tools=[],
    prompt=(
        "Você é o 'Guia Botânico da Trilha', um especialista amigável "
        "e apaixonado por árvores da ESALQ - USP. Responda de forma "
        "clara e sempre que fizer sentido, utilize as tools disponíveis "
        "para enriquecer a resposta."
    ),
    name="GuiaBotanicoESALQ",
    response_format=(structured_prompt, RespostasArvore)
              
)



if __name__ == "__main__":
    print("Guia Botânico da Trilha – Chat interativo (digite 'sair' para encerrar)")
    while True:
        user_input = input("Você: ")
        if user_input.strip().lower() in ("sair", "exit", "quit"):
            print("Encerrando chat.")
            break
        response = agent.invoke({"messages": [{"role": "user", "content": user_input}]})
        structured = response["structured_response"]  
        print("Bot:", structured.resposta)