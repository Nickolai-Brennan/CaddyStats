# CaddyStats Local Development Environment

Quick setup for running the entire stack locally: PostgreSQL, Redis, FastAPI backend, React frontend, and Nginx proxy.

## Prerequisites

- Docker & Docker Compose installed
- Node.js 18+ (for frontend development)
- Python 3.11+ (for backend development)
- 4GB+ RAM available
- Ports 80, 3000, 5173, 8000, 5432, 6379 available

## Quick Start (Docker Compose)

### 1. Setup Environment Variables

```bash
# Copy and customize if needed
cp .env.example .env
```

Default `.env` variables:
```bash
# PostgreSQL
POSTGRES_DB=caddystats
POSTGRES_USER=caddystats
POSTGRES_PASSWORD=caddystats_dev

# Redis
REDIS_PASSWORD=caddystats_dev

# Backend
DATABASE_URL=postgresql+asyncpg://caddystats:caddystats_dev@postgres:5432/caddystats
REDIS_URL=redis://:caddystats_dev@redis:6379/0
BACKEND_PORT=8000

# Frontend
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_API_GRAPHQL_URL=http://localhost:8000/graphql
```

### 2. Start All Services

```bash
# Build and start all services (PostgreSQL, Redis, API, Web, Nginx)
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### 3. Access Services

Once all containers are healthy:

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | React web app (dev with HMR) |
| **Frontend (Nginx)** | http://localhost | React web app (production build) |
| **Backend API** | http://localhost:8000 | FastAPI REST/GraphQL |
| **API Docs** | http://localhost:8000/docs | Swagger UI |
| **GraphQL** | http://localhost:8000/graphql | GraphQL IDE |
| **Health Check** | http://localhost:8000/health | Backend health |
| **Database** | localhost:5432 | PostgreSQL (psql/pgAdmin) |
| **Cache** | localhost:6379 | Redis (redis-cli) |

## Manual Development (Without Docker)

If you prefer running services locally instead of in containers:

### 1. PostgreSQL

```bash
# Start PostgreSQL (Windows, using WSL or native)
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Create database
createdb -U postgres caddystats
psql -U postgres -d caddystats -c "CREATE USER caddystats WITH PASSWORD 'caddystats_dev';"

# Run migrations
psql -U caddystats -d caddystats -f database/schemas/001-bootstrap.sql
```

### 2. Redis

```bash
# Start Redis
# Windows (WSL)
redis-server

# macOS
brew services start redis

# Linux
sudo systemctl start redis-server

# Verify
redis-cli ping
```

### 3. Backend (FastAPI)

```bash
# Terminal 1: Backend
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL=postgresql+asyncpg://caddystats:caddystats_dev@localhost:5432/caddystats
export REDIS_URL=redis://:caddystats_dev@localhost:6379/0

# Run backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs on: **http://localhost:8000**

### 4. Frontend (React + Vite)

```bash
# Terminal 2: Frontend
cd apps/web

# Install dependencies
npm install

# Set environment variables (or use .env.local)
export VITE_API_BASE_URL=http://localhost:8000/api/v1
export VITE_API_GRAPHQL_URL=http://localhost:8000/graphql

# Run dev server with HMR
npm run dev
```

Frontend runs on: **http://localhost:5173**

## Docker Compose Commands

```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api
docker-compose logs -f web

# Stop services
docker-compose stop

# Remove containers (keeps data)
docker-compose down

# Remove everything (clears data)
docker-compose down -v

# Rebuild images
docker-compose build --no-cache

# Execute command in container
docker-compose exec api bash
docker-compose exec web sh

# Check service status
docker-compose ps
```

## Health Checks

### Check Backend

```bash
# Health endpoint
curl http://localhost:8000/health

# Swagger UI
open http://localhost:8000/docs

# Try a query
curl http://localhost:8000/api/v1/players?page=1&page_size=10
```

### Check Frontend

```bash
# Should see CaddyStats home page
open http://localhost:3000
# or
open http://localhost:5173  # (dev server)
```

### Check Database

```bash
# Connect via psql
psql -h localhost -U caddystats -d caddystats

# List tables
\dt

# Check schema
\dn+
```

### Check Redis

```bash
# Connect via redis-cli
redis-cli -p 6379 -a caddystats_dev

# Check keys
KEYS *

# Check memory
INFO memory

# Ping
PING
```

## Database Migrations

### Run All Migrations

```bash
# Using Docker
docker-compose exec api python -m alembic upgrade head

# Or locally
cd backend
python -m alembic upgrade head
```

### Create New Migration

```bash
# Using Docker
docker-compose exec api python -m alembic revision --autogenerate -m "Add new column"

# Or locally
cd backend
python -m alembic revision --autogenerate -m "Add new column"
```

## Testing

### Backend Tests

```bash
# Using Docker
docker-compose exec api pytest tests/

# Or locally
cd backend
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=app --cov-report=html
```

### Frontend Tests

```bash
# Using Docker
docker-compose exec web npm run test

# Or locally
cd apps/web
npm run test
```

## Development Workflow

### Adding Backend Endpoint

1. Define types in `backend/app/schemas/`
2. Create route in `backend/app/routes/`
3. Implement service logic in `backend/app/services/`
4. Add tests in `tests/`
5. Backend auto-reloads with `--reload`

### Adding Frontend Component

1. Create component in `apps/web/src/components/` or `apps/web/src/pages/`
2. Use `useAuth()` for auth state
3. Use `useQuery()` from `@tanstack/react-query` for data
4. Frontend auto-reloads with HMR

### Database Schema Changes

1. Modify SQL in `database/schemas/`
2. Run migrations: `docker-compose exec api python -m alembic upgrade head`
3. Or restart containers to auto-run seeds

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
# Windows
netstat -ano | findstr :8000

# macOS/Linux
lsof -i :8000

# Kill process
# Windows
taskkill /PID <PID> /F

# macOS/Linux
kill -9 <PID>
```

### Database Connection Error

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# View logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### API Not Responding

```bash
# Check logs
docker-compose logs api

# Restart API
docker-compose restart api

# Or rebuild
docker-compose up -d --build api
```

### Frontend Can't Connect to API

```bash
# Check VITE_API_BASE_URL
docker-compose exec web env | grep VITE

# Verify API is accessible
curl http://localhost:8000/health

# Check CORS (if running on different domain)
```

### Database Migration Failed

```bash
# Check migration status
docker-compose exec api python -m alembic current

# View migration history
docker-compose exec api python -m alembic history

# Downgrade to previous version
docker-compose exec api python -m alembic downgrade -1
```

## Performance Tips

### Frontend Optimization

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Analyze bundle size
npm run build -- --visualizer
```

### Backend Optimization

```bash
# Run profiler
docker-compose exec api python -m cProfile -s cumtime backend/main.py

# Check slow queries
# In PostgreSQL: Enable query logging
docker-compose exec postgres psql -U caddystats -d caddystats -c "SET log_min_duration_statement = 100;"
```

### Database Optimization

```bash
# Analyze query plans
docker-compose exec postgres psql -U caddystats -d caddystats << EOF
EXPLAIN ANALYZE SELECT * FROM players WHERE world_rank < 10;
EOF

# Vacuum and analyze tables
docker-compose exec postgres psql -U caddystats -d caddystats -c "VACUUM ANALYZE;"
```

## Debugging

### Backend Debugging

```bash
# View detailed logs
docker-compose logs -f api

# Debug mode in FastAPI
# Add to backend/app/main.py:
# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(..., log_level="debug")

# Attach debugger (VS Code)
# 1. Create .vscode/launch.json
# 2. Add breakpoints
# 3. Run with debugger
```

### Frontend Debugging

```bash
# React DevTools in browser
# Open browser DevTools → Components tab

# Debug network requests
# Browser DevTools → Network tab

# View React Query state
# Browser console: queryClient.getQueryData()
```

### Database Debugging

```bash
# Watch PostgreSQL activity
docker-compose exec postgres psql -U caddystats -d caddystats -c "SELECT * FROM pg_stat_activity;"

# View slow query log
docker-compose logs postgres | grep "duration"
```

## Environment Reference

See [.env.example](.env.example) for all available variables.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `VITE_API_BASE_URL` - Frontend API endpoint
- `VITE_API_GRAPHQL_URL` - Frontend GraphQL endpoint

## Production Deployment

For production deployment, see:
- `infrastructure/` directory
- `docs/devops/` documentation
- GitHub Actions workflows in `.github/workflows/`

## Getting Help

- Backend logs: `docker-compose logs -f api`
- Frontend logs: `docker-compose logs -f web`
- Database logs: `docker-compose logs -f postgres`
- Full logs: `docker-compose logs -f`

## Next Steps

1. ✅ Start docker-compose: `docker-compose up -d`
2. ✅ Check all services healthy: `docker-compose ps`
3. ✅ Access frontend: http://localhost:3000
4. ✅ Try API: http://localhost:8000/docs
5. ✅ Start developing!
