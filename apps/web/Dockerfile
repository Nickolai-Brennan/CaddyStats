# =============================================================================
# CaddyStats Web — Dockerfile (React/Vite)
# =============================================================================

ARG PNPM_VERSION=9.15.9

# -----------------------------------------------------------------------------
# Base
# -----------------------------------------------------------------------------
FROM node:20-alpine AS base
ARG PNPM_VERSION
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate

# -----------------------------------------------------------------------------
# Development dependencies
# -----------------------------------------------------------------------------
FROM base AS development

COPY package.json ./
RUN pnpm install --no-frozen-lockfile
COPY . .

EXPOSE 3000

CMD ["pnpm", "dev", "--host", "0.0.0.0"]

# -----------------------------------------------------------------------------
# Builder
# -----------------------------------------------------------------------------
FROM base AS builder

COPY package.json ./
RUN pnpm install --no-frozen-lockfile
COPY . .
RUN pnpm build

# -----------------------------------------------------------------------------
# Production
# -----------------------------------------------------------------------------
FROM nginx:1.27-alpine AS production

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
