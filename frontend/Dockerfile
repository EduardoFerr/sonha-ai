# Imagem base com Node.js
FROM node:20-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos do projeto para o container
COPY . .

# Instala dependências do projeto
RUN npm install

# Instala servidor estático
RUN npm install -g serve

# Compila o projeto com Vite
RUN npm run build

# Expõe a porta
EXPOSE 3000

# Serve o conteúdo da pasta 'dist' (padrão do Vite)
CMD ["serve", "-s", "dist", "-l", "3000"]


