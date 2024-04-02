FROM rawbotsteam/builder:nextjs AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production

COPY . .

RUN npm run build
RUN npm prune --production
RUN node-prune /app/node_modules

FROM node:21-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/main"]
