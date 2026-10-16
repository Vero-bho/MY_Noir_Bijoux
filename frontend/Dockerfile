FROM node:24-alpine AS development-dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:24-alpine AS production-dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:24-alpine AS build
WORKDIR /app
ARG VITE_API_URL=/api
ENV VITE_API_URL=${VITE_API_URL}
COPY package.json package-lock.json ./
COPY . .
COPY --from=development-dependencies /app/node_modules ./node_modules
RUN npm run build

FROM node:24-alpine AS production
WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000
COPY package.json package-lock.json ./
COPY --from=production-dependencies /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY --from=build /app/public ./public
EXPOSE 3000
CMD ["npm", "run", "start"]
