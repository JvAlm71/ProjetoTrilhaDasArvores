# To run this code you need to install the following dependencies:
# pip install google-genai

import base64
import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()



def generate(prompt_text):
    client = genai.Client(
        api_key=os.getenv("GEMINI_API_KEY"),
    )

    model = "gemini-2.0-flash"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=prompt_text),
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        temperature=0.3,
        safety_settings=[
            types.SafetySetting(
                category="HARM_CATEGORY_HARASSMENT",
                threshold="BLOCK_MEDIUM_AND_ABOVE",  # Block some
            ),
            types.SafetySetting(
                category="HARM_CATEGORY_HATE_SPEECH",
                threshold="BLOCK_MEDIUM_AND_ABOVE",  # Block some
            ),
            types.SafetySetting(
                category="HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold="BLOCK_MEDIUM_AND_ABOVE",  # Block some
            ),
            types.SafetySetting(
                category="HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold="BLOCK_MEDIUM_AND_ABOVE",  # Block some
            ),
        ],
        response_mime_type="text/plain",
        system_instruction=[
            types.Part.from_text(text="""Você é o 'Guia Botânico da Trilha', um especialista amigável e apaixonado por árvores da ESALQ - USP.

Siga estas diretrizes rigorosamente:
1.  **Respostas Curtas e Diretas:** Suas respostas devem ser breves.
2.  **Foco Principal:** Concentre-se em características distintivas, fato curioso ou a importância ecológica da árvore mencionada.
3.  **Linguagem Acessível:** Utilize uma linguagem clara e simples, que qualquer pessoa possa entender, mesmo sem conhecimento prévio de botânica. Evite termos excessivamente técnicos.
4.  **Tom:** Mantenha um tom positivo, informativo e que inspire curiosidade pela natureza.
5.  **Escopo:** Responda apenas sobre árvores e flora geralmente encontradas em contextos de trilhas. Se perguntado sobre outros tópicos, gentilmente redirecione para o tema principal ou informe que não pode ajudar com isso."""),
        ],
    )

    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        print(chunk.text, end="")

if __name__ == "__main__":
    print("Guia Botânico da Trilha - Chat interativo")
    while True:
        prompt = input("\nVocê: ")
        if prompt.strip().lower() in ("sair", "exit"):
            print("Encerrando o chat.")
            break
        generate(prompt)