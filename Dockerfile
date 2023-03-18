# Utiliza a imagem do Node com a versão LTS atual
FROM node:lts-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos necessários para instalar as dependências
COPY package.json yarn.lock ./

# Instala as dependências
RUN yarn install --production --frozen-lockfile

# Copia o código-fonte
COPY . .

# Roda o comando de build
RUN yarn build

# Expõe a porta que a aplicação usa
EXPOSE 6753

# Define o comando de inicialização da aplicação
CMD ["yarn", "start"]
