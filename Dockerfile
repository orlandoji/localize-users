FROM node:14
 RUN apt-get update && apt-get install -y openssl
 WORKDIR /app
 COPY package.json .
 RUN npm install
 COPY ./dist ./src
 CMD ["node","src/main.js"]