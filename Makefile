.PHONY: help setup bootstrap hooks verify verify-env verify-architecture docs-check build docker-validate dev dev-bg stop stop-all restart test test-api test-web lint format typecheck db-migrate db-rollback db-seed db-shell db-reset shell-api shell-web logs logs-api logs-web clean

API_DIR ?= services/api
WEB_DIR ?= apps/web
PYTHON ?= python3

help: ## Show this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n\nTargets:\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

setup: ## Bootstrap local development environment
	@bash scripts/setup/bootstrap.sh

bootstrap: setup ## Alias for setup

hooks: ## Install repository git hooks
	@git config core.hooksPath .githooks
	@echo "Git hooks path set to .githooks"

verify: verify-env verify-architecture docs-check ## Run baseline repository verification

verify-env: ## Validate environment templates and local env files
	@bash scripts/verify/validate-env.sh .env.example
	@if [ -f .env ]; then bash scripts/verify/validate-env.sh .env; fi

verify-architecture: ## Validate required repo boundaries and ownership stubs
	@bash scripts/verify/architecture-drift.sh

docs-check: ## Validate documentation and repository governance entrypoints
	@bash scripts/verify/docs-check.sh

build: ## Build workspace artifacts
	pnpm build

docker-validate: ## Validate Docker Compose files and container builds
	@bash scripts/verify/docker-validate.sh --build

dev: ## Start all services in development mode
	docker compose up --build

dev-bg: ## Start all services in background
	docker compose up --build -d

stop: ## Stop all running services
	docker compose down

stop-all: ## Stop all services and remove volumes
	docker compose down -v

restart: ## Restart a specific service (e.g. make restart service=api)
	docker compose restart $(service)

lint: ## Run all linters
	cd $(API_DIR) && $(PYTHON) -m ruff check .
	pnpm lint

format: ## Auto-format all code
	cd $(API_DIR) && $(PYTHON) -m ruff format .
	pnpm format

typecheck: ## Run type checkers
	cd $(API_DIR) && $(PYTHON) -m mypy app/
	pnpm typecheck

test: ## Run repository tests
	@set -e; \
	cleanup() { docker compose -f docker-compose.test.yml down >/dev/null 2>&1 || true; }; \
	trap cleanup EXIT; \
	docker compose -f docker-compose.test.yml up -d --wait; \
	cd $(API_DIR) && $(PYTHON) -m pytest; \
	pnpm --filter web test

test-api: ## Run API tests only
	@set -e; \
	cleanup() { docker compose -f docker-compose.test.yml down >/dev/null 2>&1 || true; }; \
	trap cleanup EXIT; \
	docker compose -f docker-compose.test.yml up -d --wait; \
	cd $(API_DIR) && $(PYTHON) -m pytest

test-web: ## Run web tests only
	pnpm --filter web test

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

shell-api: ## Open a shell in the API container
	docker compose exec api bash

shell-web: ## Open a shell in the web container
	docker compose exec web sh

logs: ## Tail all service logs
	docker compose logs -f

logs-api: ## Tail API logs
	docker compose logs -f api

logs-web: ## Tail web logs
	docker compose logs -f web

clean: ## Remove build artifacts and caches
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".ruff_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -name "*.pyc" -delete 2>/dev/null || true
	pnpm clean 2>/dev/null || true
