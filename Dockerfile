FROM node:lts-alpine

ENV DISCORD_BOT_TOKEN="OTUwODAwMDc0MzI4MzkxNzEx.YieLkg.vnXWzS7TSzFHEOozgtt6WFTdu7I"
ENV GOOGLE_APPLICATION_CREDENTIALS=serviceAccount.json
ENV NODE_ENV=docker

WORKDIR /app

COPY . .

RUN npm install -g @nestjs/cli

RUN npm install --production

RUN nest build

CMD [ "node", "dist/main.js" ]
