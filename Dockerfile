FROM node:10.12.0
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY app.js .
EXPOSE ${PORT}
CMD ["npm", "start"]
