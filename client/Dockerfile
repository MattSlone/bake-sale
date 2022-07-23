FROM node:16-alpine
RUN apk update && apk upgrade && apk add bash
RUN rm -rf /app
RUN mkdir /app
WORKDIR /app

ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV}

COPY package.json /app
RUN yarn install --silent
COPY . .
RUN yarn build

EXPOSE 3000
CMD [ "yarn", "start" ]