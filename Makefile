.PHONY: help setup dev stop build test lint format clean db-migrate db-seed logs shell-api shell-db

# Default target
help: ## Show this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n\nTargets:\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

# ---------------------------------------------------------------------------
# Setup
# ---------------------------------------------------------------------------
setup: ## Bootstrap local development environment
	@echo "Setting up CaddyStats local environment..."
	@cp -n .env.example .env || true
	@bash scripts/setup/bootstrap.sh

# ---------------------------------------------------------------------------
# Docker
# ---------------------------------------------------------------------------
dev: ## Start all services in development mode
	docker compose up --build

dev-bg: ## Start all services in background
	docker compose up --build -d

stop: ## Stop all running services
	docker compose down

stop-all: ## Stop all services and remove volumes
	docker compose down -v

build: ## Build all Docker images
	docker compose build

restart: ## Restart a specific service (e.g. make restart service=api)
	docker compose restart $(service)

# ---------------------------------------------------------------------------
# Testing
# ---------------------------------------------------------------------------
test: ## Run all tests
	docker compose -f docker-compose.test.yml up -d
	cd backend && pytest
	docker compose -f docker-compose.test.yml down

test-api: ## Run API tests only
	cd backend && pytest

test-watch: ## Run API tests in watch mode
	cd backend && pytest --watch

# ---------------------------------------------------------------------------
# Linting & Formatting
# ---------------------------------------------------------------------------
lint: ## Run all linters
	cd backend && ruff check .
	pnpm lint

format: ## Auto-format all code
	cd backend && ruff format .
	pnpm format

typecheck: ## Run type checkers
	cd backend && mypy app/
	pnpm typecheck

# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------
db-migrate: ## Run database migrations
	docker compose exec api alembic upgrade head

db-rollback: ## Roll back last migration
	docker compose exec api alembic downgrade -1

db-seed: ## Seed development database
	docker compose exec api python -m scripts.database.seed

db-shell: ## Open psql shell
	docker compose exec postgres psql -U $${POSTGRES_USER:-caddystats} -d $${POSTGRES_DB:-caddystats}

db-reset: ## Drop and recreate dev database (DESTRUCTIVE)
	docker compose exec postgres psql -U $${POSTGRES_USER:-caddystats} -c "DROP DATABASE IF EXISTS caddystats; CREATE DATABASE caddystats;"
	$(MAKE) db-migrate

# ---------------------------------------------------------------------------
# Shells
# ---------------------------------------------------------------------------
shell-api: ## Open a shell in the API container
	docker compose exec api bash

shell-web: ## Open a shell in the web container
	docker compose exec web sh

# ---------------------------------------------------------------------------
# Logs
# ---------------------------------------------------------------------------
logs: ## Tail all service logs
	docker compose logs -f

logs-api: ## Tail API logs
	docker compose logs -f api

logs-web: ## Tail web logs
	docker compose logs -f web

# ---------------------------------------------------------------------------
# Cleanup
# ---------------------------------------------------------------------------
clean: ## Remove build artifacts and caches
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".ruff_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -name "*.pyc" -delete 2>/dev/null || true
	pnpm clean 2>/dev/null || true
