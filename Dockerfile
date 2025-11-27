FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN pnpm ci --ignore-scripts

COPY . .

ENV NODE_ENV=production

RUN pnpm run build

EXPOSE 3000

CMD ["sh", "-c", "npm run schema:update && npm run migrate:up && npm run start:prod"]