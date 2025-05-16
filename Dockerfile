FROM node:20-alpine

# Instala o SQLite e cria diretório para o banco
RUN apk add --no-cache sqlite && mkdir -p /app/prisma

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# Define a variável de ambiente durante o build
ENV DATABASE_URL="file:/app/prisma/dev.db"

# Instala dependências
RUN npm install -g prisma
RUN npm install

# Gera client e aplica migrations
RUN npx prisma generate
RUN npx prisma migrate dev --name init

COPY . .

CMD ["npm", "run", "dev"]