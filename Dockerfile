FROM node:lts-alpine

RUN npm install -g http-server

WORKDIR /app

COPY package*.json ./

RUN npm install --production
RUN npm i -S @vue/cli-service

COPY . .

RUN npm run build

EXPOSE 8080
RUN chmod u+x /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]