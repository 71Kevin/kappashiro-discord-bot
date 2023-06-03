FROM node:16

COPY package*.json ./

RUN npm install -g npm@8.8.0

RUN npm i

COPY . .

ADD . . 

RUN npm run build

EXPOSE 6010

CMD npm run start
