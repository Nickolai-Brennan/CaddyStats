# CaddyStats Development Environment Configuration

Complete guide for setting up and configuring the local development environment.

## Environment Configurations

Three pre-built environment configurations are available in `config/environments/`:

### Local Development (Default)
- **File**: `config/environments/local.env`
- **Purpose**: Local development with all services
- **Ports**: 3000 (frontend), 8000 (backend), 5432 (db), 6379 (redis)
- **Features**: Hot module reloading, debug logging, CORS enabled

### Docker Compose
- **File**: `config/environments/docker.env`
- **Purpose**: Running all services in Docker containers
- **Features**: Service-to-service networking, health checks, auto-restart

### Production
- **File**: `config/environments/production.env`
- **Purpose**: Production deployment configuration
- **Features**: Optimized performance, security hardening, external monitoring

## Quick Setup

### Step 1: Clone Repository
```bash
git clone https://github.com/Nickolai-Brennan/CaddyStats.git
cd CaddyStats
```

### Step 2: Create Environment File
```bash
# Copy default environment
cp .env.example .env

# Or customize for specific setup
cp config/environments/local.env .env
```

### Step 3: Start Services

**Option A: Docker Compose (Recommended)**
```bash
# macOS/Linux
./dev.sh up

# Windows
dev.cmd up
```

**Option B: Manual Setup**
```bash
# Terminal 1: Database
cd database
# Follow LOCAL_DEVELOPMENT.md PostgreSQL section

# Terminal 2: Backend
cd backend
source venv/bin/activate
python -m uvicorn app.main:app --reload

# Terminal 3: Frontend
cd apps/web
npm run dev
```

### Step 4: Verify Services

```bash
# Check all services
docker-compose ps

# Or test individual URLs
curl http://localhost:8000/health          # Backend
open http://localhost:3000                 # Frontend
open http://localhost:8000/docs            # API Docs
```

## Environment Variables Reference

### App Configuration
```bash
APP_ENV=local|staging|production
NODE_ENV=development|production
LOG_LEVEL=debug|info|warning|error
DEBUG=true|false
```

### Database Configuration
```bash
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/dbname
POSTGRES_DB=caddystats
POSTGRES_USER=caddystats
POSTGRES_PASSWORD=caddystats_dev
DB_POOL_SIZE=5
DB_ECHO=false|true (log SQL queries)
```

### Redis Configuration
```bash
REDIS_URL=redis://:password@host:6379/0
REDIS_PASSWORD=caddystats_dev
REDIS_PORT=6379
REDIS_DB=0
```

### Backend/FastAPI Configuration
```bash
API_HOST=0.0.0.0
API_PORT=8000
API_RELOAD=true|false
API_WORKERS=1
FASTAPI_ENV=development|production
GRAPHQL_PLAYGROUND_ENABLED=true|false
```

### Frontend Configuration
```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_API_GRAPHQL_URL=http://localhost:8000/graphql
VITE_DEBUG=true|false
```

### Security Configuration
```bash
APP_SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-min-32-chars
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30
JWT_REFRESH_TOKEN_EXPIRE_DAYS=30
```

### CORS Configuration
```bash
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
CORS_ALLOW_CREDENTIALS=true
CORS_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=*
```

### Rate Limiting
```bash
RATE_LIMIT_ENABLED=true|false
RATE_LIMIT_DEFAULT_PER_MINUTE=60
RATE_LIMIT_AUTH_PER_MINUTE=10
RATE_LIMIT_API_PER_MINUTE=30
```

### Logging & Monitoring
```bash
SENTRY_DSN=                    # Optional error tracking
LOG_LEVEL=info
LOG_FORMAT=json|text
```

## Environment Presets

### Development (Local)
Best for active development with HMR and debugging.

```bash
APP_ENV=local
NODE_ENV=development
DEBUG=true
API_RELOAD=true
GRAPHQL_PLAYGROUND_ENABLED=true
LOG_LEVEL=debug
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Development (Docker)
Recommended for testing with isolated containers.

```bash
APP_ENV=docker
DATABASE_URL=postgresql+asyncpg://caddystats:caddystats_dev@postgres:5432/caddystats
REDIS_URL=redis://:caddystats_dev@redis:6379/0
API_HOST=0.0.0.0
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### Staging
Pre-production testing environment.

```bash
APP_ENV=staging
NODE_ENV=production
DEBUG=false
API_WORKERS=4
LOG_LEVEL=info
RATE_LIMIT_ENABLED=true
```

### Production
Production deployment configuration.

```bash
APP_ENV=production
NODE_ENV=production
DEBUG=false
API_WORKERS=8
LOG_LEVEL=warning
GRAPHQL_PLAYGROUND_ENABLED=false
RATE_LIMIT_ENABLED=true
```

## Service Configuration Files

### PostgreSQL (`database/`)
- Connection: PostgreSQL 16 (Alpine)
- Port: 5432
- Default user: caddystats
- Default password: caddystats_dev
- Initial schemas: Loaded from `database/schemas/`

### Redis (`redis/`)
- Connection: Redis 7 (Alpine)
- Port: 6379
- Default password: caddystats_dev
- Memory limit: 256MB
- Eviction policy: allkeys-lru

### Backend (`backend/` or `services/api/`)
- Framework: FastAPI
- Port: 8000
- Reload: Enabled in development
- Workers: 1 (development), configurable (production)
- Entry point: `app/main.py`

### Frontend (`apps/web/`)
- Framework: React 19 + Vite
- Dev port: 5173 (dev server) / 3000 (Docker)
- Build command: `npm run build`
- Package manager: npm/pnpm

### Proxy (`infrastructure/nginx/`)
- Server: Nginx 1.27 (Alpine)
- Port: 80
- Routes:
  - `/` → Frontend (React)
  - `/api/` → Backend (FastAPI)
  - `/graphql` → GraphQL endpoint

## Docker Compose Service Names

When running in Docker, use these service names for internal communication:

```yaml
Services:
  postgres:8432    # PostgreSQL
  redis:6379       # Redis
  api:8000         # FastAPI Backend
  web:3000         # React Frontend
  nginx:80         # Reverse Proxy
```

Example: Backend connection string in Docker:
```
DATABASE_URL=postgresql+asyncpg://caddystats:caddystats_dev@postgres:5432/caddystats
```

## Network Configuration

### Docker Bridge Network
All services communicate via the `caddystats` bridge network.

```
┌─────────────────────────────────────────┐
│ Docker Network: caddystats (bridge)     │
├─────────────────────────────────────────┤
│                                         │
│  ┌────────────┐  ┌──────────┐          │
│  │  Frontend  │  │  Backend │          │
│  │ (port 3000)│  │(port 8000)          │
│  └────────────┘  └──────────┘          │
│        │               │                │
│  ┌─────┴───────┬──────┴──────┐         │
│  │             │             │         │
│  ▼             ▼             ▼         │
│ ┌─────────┐ ┌────────┐ ┌──────────┐   │
│ │ Nginx   │ │Database│ │  Redis   │   │
│ │(port 80)│ │(5432)  │ │ (6379)   │   │
│ └─────────┘ └────────┘ └──────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Port Mappings

| Service | Container Port | Host Port | URL |
|---------|---|---|---|
| Frontend | 3000 | 3000 | http://localhost:3000 |
| Frontend Dev | 5173 | 5173 | http://localhost:5173 |
| Backend | 8000 | 8000 | http://localhost:8000 |
| Nginx | 80 | 80 | http://localhost |
| PostgreSQL | 5432 | 5432 | localhost:5432 |
| Redis | 6379 | 6379 | localhost:6379 |

## Modifying Configuration

### Add Environment Variable
1. Add to `.env.example`
2. Add to `config/environments/*.env`
3. Add to `docker-compose.yml` under environment section
4. Document in this file

### Change Database Credentials
```bash
# Edit .env
POSTGRES_USER=myuser
POSTGRES_PASSWORD=mypassword

# Restart database
docker-compose restart postgres
```

### Change API Port
```bash
# Edit .env and docker-compose.yml
API_PORT=9000

# Rebuild
docker-compose up -d --build api
```

### Enable/Disable Features
```bash
# Enable GraphQL Playground
GRAPHQL_PLAYGROUND_ENABLED=true

# Enable Debug Mode
DEBUG=true

# Enable Rate Limiting
RATE_LIMIT_ENABLED=true
```

## Troubleshooting Configuration

### "Cannot connect to database"
1. Check `DATABASE_URL` is correct
2. Verify PostgreSQL is running: `docker-compose logs postgres`
3. Check password matches: `POSTGRES_PASSWORD` in `.env`
4. Ensure port 5432 is not in use: `netstat -an | grep 5432`

### "Frontend cannot reach API"
1. Check `VITE_API_BASE_URL` points to correct backend
2. Verify backend is running: `docker-compose logs api`
3. Check CORS configuration: `CORS_ALLOWED_ORIGINS`
4. Test API directly: `curl http://localhost:8000/health`

### "Redis connection failed"
1. Verify Redis is running: `docker-compose logs redis`
2. Check `REDIS_URL` format
3. Verify password: `REDIS_PASSWORD`
4. Test connection: `redis-cli -a <password> ping`

### "Hot Module Reload not working"
1. Ensure `API_RELOAD=true`
2. Check file watcher limits: `ulimit -n` (should be > 1000)
3. Rebuild with `docker-compose up -d --build web`

## Security Notes

⚠️ **Development Credentials** - The default credentials in `.env.example` are for local development only.

For production:
1. Generate strong secrets: `openssl rand -hex 32`
2. Use environment variables from secrets manager
3. Never commit `.env` file to git
4. Use `.env.local` and add to `.gitignore`

```bash
# Generate secure credentials
JWT_SECRET=$(openssl rand -hex 32)
APP_SECRET=$(openssl rand -hex 32)
DB_PASSWORD=$(openssl rand -hex 16)
REDIS_PASSWORD=$(openssl rand -hex 16)
```

## Performance Tuning

### Backend Optimization
```bash
# Increase workers for concurrent requests
API_WORKERS=4

# Enable query logging for optimization
DB_ECHO=true

# Connection pooling
DB_POOL_SIZE=20
DB_POOL_OVERFLOW=10
```

### Frontend Optimization
```bash
# Disable debug toolbar in production
VITE_DEBUG=false

# Enable production build
NODE_ENV=production
```

### Database Optimization
```bash
# PostgreSQL auto-vacuum settings
# Edit docker-compose.yml postgres command
```

## Next Steps

1. ✅ Create `.env` file
2. ✅ Start services: `./dev.sh up` or `dev.cmd up`
3. ✅ Verify all services: `docker-compose ps`
4. ✅ Access frontend: http://localhost:3000
5. ✅ Start developing!

See `LOCAL_DEVELOPMENT.md` for detailed command reference.
