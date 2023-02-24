FROM node:14

RUN apt-get update && apt-get install -y git 

EXPOSE 8080

WORKDIR /node

COPY node /node

WORKDIR /node
RUN npm i --production && rm -rf /root/.npm /usr/local/share/.cache /root/.cache

CMD npm start