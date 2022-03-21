FROM node:16

COPY package*.json ./

RUN npm i

COPY . .

ADD . . 

RUN npm run build

EXPOSE 6753

CMD npm run start