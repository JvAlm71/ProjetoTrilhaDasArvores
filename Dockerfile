# 1. Imagem base Python
FROM python:3.10-slim

WORKDIR /app

# 2. Copia e instala dependências
COPY trilha-app-mobile/src/chat/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 3. Exponha a porta do Flask
EXPOSE 5000

# 4. Comando de início
CMD ["python3", "chat1_server.py"]