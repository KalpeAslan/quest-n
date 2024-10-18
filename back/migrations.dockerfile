FROM node:alpine
RUN apk add g++ make py3-pip

WORKDIR /app

COPY package.json .

RUN npm i
RUN npm i typescript -g

COPY . .

RUN tsc

CMD ["npm", "run", "typeorm", "--", "migration:run"]