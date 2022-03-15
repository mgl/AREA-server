FROM node:lts-alpine

ENV NODE_ENV=docker

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

RUN npm install -g @nestjs/cli

COPY . .

RUN nest build

CMD [ "npm", "run", "nest:start:prod" ]
