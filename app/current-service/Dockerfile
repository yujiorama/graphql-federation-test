FROM node:20-slim

COPY . /app
WORKDIR /app

RUN npm install -g corepack@latest
RUN corepack enable
RUN pnpm install
RUN pnpm codegen:generate && pnpm build

EXPOSE 4001
CMD ["node", "dist/index.js"]

