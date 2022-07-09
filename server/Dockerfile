FROM node:16-alpine
RUN apk update && apk upgrade
RUN rm -rf /app
RUN mkdir /app
WORKDIR /app

ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV}

RUN apk --no-cache add --virtual build-deps build-base python3

COPY package.json /app
COPY /uploads/3a5517608fcb9971aef031549e32ae8b /uploads
RUN yarn install --silent
RUN yarn global add nodemon
COPY . .

EXPOSE 8080
EXPOSE 4242
CMD [ "yarn", "start" ]