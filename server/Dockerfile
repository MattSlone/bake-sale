FROM node:16-alpine
RUN apk update && apk upgrade && apk add bash
RUN mkdir /app
WORKDIR /app

RUN apk --no-cache add --virtual build-deps build-base python3

COPY package.json /app
COPY yarn.lock /app
RUN yarn install --silent
RUN yarn global add nodemon
COPY . .

EXPOSE 8080
CMD [ "yarn", "start" ]