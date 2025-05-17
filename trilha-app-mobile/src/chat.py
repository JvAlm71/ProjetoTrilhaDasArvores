import io
import sys
import os

from dotenv import load_dotenv
from crewai_tools import ScrapeWebsiteTool
from langchain.agents import create_react_agent
from google import genai
from google.genai import types

load_dotenv()

def chat_tool(prompt: str) -> str:
    """
    Wrapper que invoca o Gemini via genai.Client e retorna a resposta.
    """
    buffer = io.StringIO()
    old = sys.stdout
    sys.stdout = buffer
    try:
        client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        contents = [
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=prompt)],
            )
        ]
        cfg = types.GenerateContentConfig(
            temperature=0.3,
            safety_settings=[
                types.SafetySetting("HARM_CATEGORY_HARASSMENT", "BLOCK_MEDIUM_AND_ABOVE"),
                types.SafetySetting("HARM_CATEGORY_HATE_SPEECH", "BLOCK_MEDIUM_AND_ABOVE"),
                types.SafetySetting("HARM_CATEGORY_SEXUALLY_EXPLICIT", "BLOCK_MEDIUM_AND_ABOVE"),
                types.SafetySetting("HARM_CATEGORY_DANGEROUS_CONTENT", "BLOCK_MEDIUM_AND_ABOVE"),
            ],
            response_mime_type="text/plain",
            system_instruction=[types.Part.from_text(text="Você é o 'Guia Botânico da Trilha'…")],
        )
        for chunk in client.models.generate_content_stream(
            model="gemini-2.0-flash", contents=contents, config=cfg
        ):
            print(chunk.text, end="")
    finally:
        sys.stdout = old
    return buffer.getvalue()

# --- instância da ferramenta de scraping ---
scrape_tool = ScrapeWebsiteTool(
    website_url="https://www.esalq.usp.br/trilhas/trilhas.htm"
)

# --- criação do agente usando LangChain por trás dos panos ---
agent = create_react_agent(
    model= "gemini-2.0-flash",
    tools= [scrape_tool, chat_tool],
    name="GuiaBotanicoAgent",
    debug=True
)

def run_agent(prompt: str) -> str:
    return agent.run(prompt)

if __name__ == "__main__":
    print("Guia Botânico da Trilha – Chat interativo")
    while True:
        pergunta = input("Você: ").strip()
        if pergunta.lower() in ("sair", "exit"):
            print("Encerrando o chat.")
            break
        print(run_agent(pergunta))