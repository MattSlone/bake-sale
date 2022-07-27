FROM node:16-alpine
RUN apk update && apk upgrade && apk add bash
RUN rm -rf /app
RUN mkdir /app
WORKDIR /app

ARG node_env
RUN echo "ENV is ${node_env}"

COPY package.json /app
COPY yarn.lock /app
RUN yarn install --silent
COPY . .

COPY build.sh build.sh
RUN chmod u+x build.sh && ./build.sh "${node_env}"

EXPOSE 3000
CMD [ "yarn", "start" ]