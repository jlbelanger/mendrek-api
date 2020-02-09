FROM node:10.15.1
RUN npm install knex nodemon -g
WORKDIR /usr/src/app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY knexfile.js .
COPY .env .
CMD ["nodemon", "start.js"]
EXPOSE 5309
