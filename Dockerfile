FROM node:8
RUN mkdir -p /app

WORKDIR /app

EXPOSE 3000

ADD dist /app 
ADD package.json /app
RUN npm -f install

CMD ["node", "index.js"]