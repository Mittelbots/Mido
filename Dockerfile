FROM node:18.8

WORKDIR /app

COPY package.json ./

RUN npm install
RUN npm install -g nodemon

COPY . .

EXPOSE 5050

CMD [ "nodemon", "index.js" ]