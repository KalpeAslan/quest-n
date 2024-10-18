FROM public.ecr.aws/docker/library/node:20.6.0-alpine3.17
RUN apk add g++ make py3-pip

WORKDIR /app

COPY package.json .

RUN npm i
RUN npm i typescript -g

COPY . .

RUN tsc

CMD ["node", "dist/server/index.js"]
