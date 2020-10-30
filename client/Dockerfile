FROM node:12-alpine
RUN apk update && apk upgrade
WORKDIR /app

ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV}

COPY package.json /app
RUN yarn install --silent
COPY . .

EXPOSE 3000
CMD [ "yarn", "start" ]