FROM node:16-alpine
RUN apk update && apk upgrade && apk add bash
RUN rm -rf /app
RUN mkdir /app
WORKDIR /app

ARG node_env

COPY package.json /app
COPY yarn.lock /app
RUN yarn install --silent
COPY . .

EXPOSE 3000
CMD [ "yarn", "start" ]