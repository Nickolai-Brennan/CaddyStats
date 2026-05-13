# =============================================================================
# CaddyStats Web — Dockerfile (React/Vite)
# =============================================================================

# -----------------------------------------------------------------------------
# Base
# -----------------------------------------------------------------------------
FROM node:20-alpine AS base

ENV PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# -----------------------------------------------------------------------------
# Development
# -----------------------------------------------------------------------------
FROM base AS development

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["pnpm", "dev", "--host", "0.0.0.0"]

# -----------------------------------------------------------------------------
# Builder
# -----------------------------------------------------------------------------
FROM base AS builder

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

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
