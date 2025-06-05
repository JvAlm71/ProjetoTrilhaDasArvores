import os
from flask import Flask, request, jsonify
from dotenv import load_dotenv
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
import src.chat.tools # importa o agent já configurado em chat1.py
import src.chat.chat1

load_dotenv()
app = Flask(__name__)

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json or {}
    msg = data.get("message", "").strip()
    if not msg:
        return jsonify({"error": "No message"}), 400

    # executa o agent de forma síncrona e coleta a resposta completa
    # assume que agent.run() existe; se não, agregue chunks de agent.stream()
    try:
        response = agent.run(msg)
    except AttributeError:
        # fallback: stream e junte os chunks em uma string
        resp_chunks = []
        for chunk in agent.stream({"messages":[{"role":"user","content":msg}]}, stream_mode="updates"):
            resp_chunks.append(str(chunk))
        response = "".join(resp_chunks)

    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(port=5000)