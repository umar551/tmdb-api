# Build stage
FROM node:18-alpine AS builder

RUN npm install -g pnpm

WORKDIR /tmdb-api

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

# Production stage
FROM node:18-alpine

RUN npm install -g pnpm

WORKDIR /tmdb-api

COPY --from=builder /tmdb-api/dist ./dist
COPY --from=builder /tmdb-api/package.json ./
COPY --from=builder /tmdb-api/pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost:8080/api/health || exit 1

USER node

EXPOSE 8080

CMD ["node", "dist/main"] 