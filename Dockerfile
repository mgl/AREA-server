FROM node:lts as builder

ENV NODE_ENV build

WORKDIR /app

COPY . /app

RUN npm ci \
    && npm run build \
    && npm prune --production

# ---

FROM node:lts-alpine

ENV NODE_ENV production

WORKDIR /app

COPY --from=builder /app/package*.json /app/
COPY --from=builder /app/node_modules/ /app/node_modules/
COPY --from=builder /app/dist/ /app/dist/

EXPOSE 3000

CMD ["node", "dist/main.js"]