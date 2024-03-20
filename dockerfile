FROM node:21 as builder

WORKDIR /app

RUN npm add -g @nestjs/cli
RUN curl -sf https://gobinaries.com/tj/node-prune | sh

COPY . /app

RUN npm install --production
RUN npm run build
RUN npm prune --production

RUN node-prune /app/node_modules

FROM node:21-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/main"]
