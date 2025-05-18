import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI, HarmBlockThreshold, HarmCategory
from langgraph.prebuilt import create_react_agent
from langchain.tools import Tool
from pydantic import BaseModel


load_dotenv()
os.environ["GOOGLE_API_KEY"] = os.getenv("GEMINI_API_KEY")


class RespostasArvore(BaseModel):
    resposta : str 


llm = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0.3,
    safety_settings={
        HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
        HarmCategory.HARM_CATEGORY_SEXUAL: HarmBlockThreshold.BLOCK_NONE,
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
    "LEMBRE DE TODAS ARVORES QUE SEU MODELO SABE."),
    name="GuiaBotanicoESALQ",
    response_format=(structured_prompt, RespostasArvore)      
)



if __name__ == "__main__":
    # Mensagem de sistema inicial
    system_context = {
        "role": "system",
        "content": (
            "Você é o 'Guia Botânico da Trilha', um especialista amigável e apaixonado "
            "por árvores da ESALQ - USP. Sua missão é compartilhar informações detalhadas "
            "e precisas sobre árvores, curiosidades botânicas e detalhes da trilha. "
            "Certifique-se de ser educativo, acessível e de enriquecer as respostas com "
            "fatos interessantes e relevantes. Evite responder sobre assuntos fora do "
            "escopo de árvores e botânica."
        )
    }

    print("Guia Botânico da Trilha  Chat interativo (digite 'sair' para encerrar)")
    while True:
        user_input = input("Você: ")
        if user_input.strip().lower() in ("sair", "exit", "quit"):
            print("Encerrando chat.")
            break
        
        # Incluímos a mensagem de sistema antes da mensagem do usuário
        messages_flow = [
            system_context,
            {"role": "user", "content": user_input}
        ]
        
        response = agent.invoke({"messages": messages_flow})
        structured = response["structured_response"]
        print("Bot:", structured.resposta)