FROM node:22-bookworm-slim AS build
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN DATABASE_URL='postgresql://ci:ci@127.0.0.1:5432/noir_bijoux_ci?schema=public' \
    DIRECT_URL='postgresql://ci:ci@127.0.0.1:5432/noir_bijoux_ci?schema=public' \
    npx prisma generate \
    && npm run build

FROM node:22-bookworm-slim AS production
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production \
    PORT=4000

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build --chown=node:node /app/dist ./dist
USER node
EXPOSE 4000
CMD ["npm", "start"]
