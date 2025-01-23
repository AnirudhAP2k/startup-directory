ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine as base

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json  /app/package-lock.json

RUN npm ci

COPY . /app

RUN npm run build
EXPOSE 8000

CMD ["npm", "run", "start"]