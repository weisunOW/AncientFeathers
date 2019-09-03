# Node v12
FROM node:12
# Working Directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000
CMD ["npm", "start"]
