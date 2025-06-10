# Usa uma imagem Node.js como base
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json para o cache de dependências
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o resto dos arquivos do projeto
COPY . .

# Expõe a porta 3000 para o React
EXPOSE 3000

# Comando padrão para iniciar a aplicação
CMD ["npm", "start"]