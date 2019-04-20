FROM node:10.15.1
COPY package.json /tmp/package.json
COPY package-lock.json /tmp/package-lock.json
WORKDIR /tmp
RUN npm install
RUN npm install knex nodemon -g
WORKDIR /usr/src/app
CMD ["nodemon", "start.js"]
EXPOSE 5309
