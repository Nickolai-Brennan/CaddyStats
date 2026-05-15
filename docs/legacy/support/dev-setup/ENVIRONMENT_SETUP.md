# Complete CaddyStats Development Environment Setup

Welcome! This guide will help you set up and run the entire CaddyStats platform locally with all services (Frontend, Backend, Database, API) running together.

## 📋 What You'll Get

After setup, you'll have running:

✅ **PostgreSQL Database** (localhost:5432)

- All golf data schemas
- Auto-seed with sample data
- Live SQL query interface

✅ **Redis Cache** (localhost:6379)

- Performance optimization
- Session management
- Real-time data caching

✅ **FastAPI Backend** (localhost:8000)

- Complete REST API
- GraphQL endpoint
- Swagger interactive docs
- All authentication/authorization
- 330+ passing tests

✅ **React Frontend** (localhost:3000)

- Web app with full routing
- Auth context & session management
- TanStack Query integration
- Premium UI patterns
- Hot module reloading

✅ **Nginx Reverse Proxy** (localhost:80)

- Unified entry point
- Request routing
- Load balancing ready

## 🎯 Choose Your Setup Method

### Option 1: Docker Compose (Recommended) ⭐

**Best for**: Quick setup, isolated environment, testing with live containers

```bash
# macOS/Linux
./dev.sh up

# Windows
dev.cmd up

# Done! All services running, auto-restart on changes
```

**Time**: 2-3 minutes  
**Pros**: Isolated, repeatable, matches production  
**Cons**: Requires Docker & Docker Desktop

---

### Option 2: Manual Local Setup

**Best for**: Development with direct IDE debugging, custom configurations

See `LOCAL_DEVELOPMENT.md` for step-by-step instructions for running:

- PostgreSQL locally
- Redis locally
- Backend with Python venv
- Frontend with Node.js

**Time**: 10-15 minutes  
**Pros**: Direct debugging, more control  
**Cons**: More setup, manage multiple processes

---

### Option 3: Hybrid (Docker + Local Frontend)

**Best for**: Faster frontend reloading, backend in Docker

```bash
# Docker: PostgreSQL, Redis, Backend
docker-compose up -d postgres redis api

# Local: Frontend in terminal
cd apps/web
npm run dev
```

---

## 🚀 Getting Started (5 minutes)

### Prerequisites

- **Windows**: Command Prompt, PowerShell, or Windows Terminal
  - **PowerShell note**: Use `.\ ` prefix: `.\dev.cmd up` (not `dev.cmd up`)
  - **Command Prompt**: Use normally: `dev.cmd up`
- Docker & Docker Desktop installed
  - [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
- 4GB RAM available
- Ports 80, 3000, 5173, 8000, 5432, 6379 available

### Step 1: Clone & Navigate

```bash
git clone https://github.com/Nickolai-Brennan/CaddyStats.git
cd CaddyStats
```

### Step 2: Create Environment File

```bash
cp .env.example .env
```

### Step 3: Start Services

**macOS/Linux:**

```bash
chmod +x dev.sh
./dev.sh up
```

**Windows (PowerShell):**

```powershell
.\dev.cmd up
```

**Windows (Command Prompt):**

```cmd
dev.cmd up
```

### Step 4: Wait for Health Check

```
✅ All services healthy!
```

### Step 5: Access Services

```
Frontend:   http://localhost:3000
API Docs:   http://localhost:8000/docs
GraphQL:    http://localhost:8000/graphql
Database:   localhost:5432 (caddystats / caddystats_dev)
```

## 📚 Documentation Files

| File                     | Purpose                           | Time   | Audience         |
| ------------------------ | --------------------------------- | ------ | ---------------- |
| **QUICKREF.md**          | One-page cheat sheet              | 2 min  | Everyone         |
| **LOCAL_DEVELOPMENT.md** | Complete command reference        | 10 min | Developers       |
| **DEVELOPMENT_SETUP.md** | Environment & configuration guide | 15 min | DevOps/Setup     |
| **API_TESTING.md**       | API testing & integration         | 20 min | Backend devs     |
| **This file**            | Complete setup overview           | 15 min | First-time users |

### Reading Recommendation

1. **Start here**: QUICKREF.md (2 min)
2. **Setup**: LOCAL_DEVELOPMENT.md (Docker section)
3. **Reference**: Use as needed

## 🔧 Essential Commands

### Starting & Stopping

```bash
# Start all services (stay in foreground, see logs)
./dev.sh up

# Start in background
docker-compose up -d --build

# Stop all services
./dev.sh stop
docker-compose stop

# Restart services
./dev.sh restart
docker-compose restart

# Remove containers (keeps data)
./dev.sh remove
docker-compose down

# Remove everything (clears all data)
./dev.sh clean
docker-compose down -v
```

### Monitoring & Debugging

```bash
# View live logs (all services)
docker-compose logs -f

# View specific service logs
docker-compose logs -f api          # Backend
docker-compose logs -f web          # Frontend
docker-compose logs -f postgres     # Database

# Check service health
docker-compose ps

# Execute command in container
docker-compose exec api bash        # Backend shell
docker-compose exec postgres psql -U caddystats -d caddystats  # Database
docker-compose exec web sh          # Frontend
```

### Development

```bash
# Run backend tests
docker-compose exec api pytest tests/ -v

# Run frontend tests
docker-compose exec web npm run test

# Run with coverage
docker-compose exec api pytest --cov=app tests/

# Lint check
docker-compose exec api python -m flake8 app/
docker-compose exec web npm run lint
```

## 📍 Service Architecture

```
┌─────────────────────────────────────────────────────┐
│         Your Browser (localhost)                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Frontend (http://localhost:3000)                  │
│  ├─ React 19.1 + Vite                             │
│  ├─ TanStack Router & Query                       │
│  └─ Auth Context + Session Mgmt                   │
│                                                     │
│                     │                              │
│                     ▼                              │
│                                                     │
│  Backend API (http://localhost:8000)              │
│  ├─ FastAPI REST & GraphQL                        │
│  ├─ JWT Auth & RBAC                               │
│  └─ 330+ integration tests passing                │
│                                                     │
│    ├──────────────────────┬──────────────────┐    │
│    ▼                      ▼                 ▼    │
│                                                     │
│  PostgreSQL          Redis               Nginx   │
│  (localhost:5432)    (localhost:6379)   (port 80) │
│  - 8 schemas         - Session cache     - Proxy  │
│  - 50+ tables        - Rate limit        - Route  │
│  - Live golf data    - Live counters     - Load   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## 💾 Data & State

### Database

- **Type**: PostgreSQL 16
- **Data**: Persisted in Docker volume (`postgres_data`)
- **Schemas**: auth, content, stats, analytics, ai, system, ingestion, billing
- **Seed**: Auto-runs on first start

### Cache

- **Type**: Redis 7
- **Data**: In-memory, persists to Docker volume (`redis_data`)
- **Usage**: Session storage, rate limiting, query results

### Frontend State

- **Auth**: React Context + localStorage
- **Server Data**: TanStack Query (with caching)
- **Local UI**: React hooks

## 🔐 Credentials

### Default Development Credentials

```
Database User:     caddystats
Database Password: caddystats_dev
Redis Password:    caddystats_dev
Test User Email:   test@example.com
Test User Pass:    test123
```

⚠️ These are for development only. Never use in production.

## 🌍 Environment Variables

### Key Variables

```bash
# Database
DATABASE_URL=postgresql+asyncpg://caddystats:caddystats_dev@postgres:5432/caddystats

# Redis
REDIS_URL=redis://:caddystats_dev@redis:6379/0

# Frontend API
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_API_GRAPHQL_URL=http://localhost:8000/graphql

# Features
DEBUG=true
GRAPHQL_PLAYGROUND_ENABLED=true
LOG_LEVEL=info
```

See `.env.example` for all available variables.

## 🧪 Testing

### Backend Tests

```bash
# All tests
docker-compose exec api pytest tests/ -v

# Specific test file
docker-compose exec api pytest tests/unit/test_auth.py -v

# With coverage report
docker-compose exec api pytest --cov=app --cov-report=html tests/
# View: htmlcov/index.html
```

### Frontend Tests

```bash
# Run tests
docker-compose exec web npm run test

# With coverage
docker-compose exec web npm run test -- --coverage
```

### Integration Tests

```bash
# Test full flow: login → fetch data → navigate
docker-compose exec web npm run test:e2e
```

## 🐛 Troubleshooting

### Services Won't Start

**Problem**: `docker-compose: command not found` or `docker: command not found`

**Solution**:

- Install Docker Desktop: https://www.docker.com/products/docker-desktop
- Restart terminal after installation

---

### Port Already in Use

**Problem**: `Error: Port 8000 is already in use`

**Solution**:

```bash
# Find what's using port 8000
# macOS/Linux
lsof -i :8000

# Windows
netstat -ano | findstr :8000

# Kill the process or use different port
export API_PORT=9000
docker-compose up -d
```

---

### Database Connection Failed

**Problem**: `SQLALCHEMY_DATABASE_URL connection refused`

**Solution**:

```bash
# Check PostgreSQL is running
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres

# Wait for healthy state
docker-compose ps  # Look for (healthy)
```

---

### Frontend Can't Reach API

**Problem**: Network error when frontend tries to call API

**Solution**:

```bash
# 1. Check VITE_API_BASE_URL in .env
grep VITE_API_BASE_URL .env

# 2. Check API is responding
curl http://localhost:8000/health

# 3. Check CORS is enabled
# Backend logs should show request

# 4. Restart frontend
docker-compose restart web
```

---

### Memory/Performance Issues

**Problem**: Services running slow, high memory usage

**Solution**:

```bash
# Check resource usage
docker stats

# Increase Docker memory allocation (Desktop)
# Preferences → Resources → Memory: 4GB+

# Or reduce background processes
docker-compose down -v
docker-compose up
```

---

### Tests Failing

**Problem**: `pytest: command not found` or test failures

**Solution**:

```bash
# Restart backend
docker-compose restart api

# Run tests
docker-compose exec api pytest tests/ -v

# Check for dependency issues
docker-compose exec api pip list
```

## 📊 Performance Monitoring

### Check Service Health

```bash
docker-compose ps
# All should show "Up" and containers without "Exited"
```

### Monitor Real-time Performance

```bash
# Resource usage (CPU, Memory, Network)
docker stats

# Database query performance
docker-compose exec postgres psql -U caddystats -d caddystats << EOF
EXPLAIN ANALYZE SELECT * FROM players WHERE world_rank < 10;
EOF
```

### View Backend Metrics

```bash
# Enable detailed logging
docker-compose logs -f api | grep -E "(SELECT|INSERT|POST|GET)"

# Check response times
# Look for X-Debug-Time header in responses
curl -v http://localhost:8000/api/v1/players?page=1 | grep X-Debug
```

## 📈 Development Workflow

### Typical Session

```bash
# 1. Start everything in background
./dev.sh up &

# 2. Watch logs in another terminal
docker-compose logs -f api &

# 3. Open frontend
open http://localhost:3000

# 4. Make changes (auto-reload enabled)
# Edit apps/web/src/pages/home.tsx
# Changes appear instantly

# 5. Test API changes
open http://localhost:8000/docs
# Try endpoints interactively

# 6. Run tests before committing
docker-compose exec api pytest tests/
docker-compose exec web npm run test

# 7. When done, stop services
./dev.sh stop
```

### Adding a New Feature

1. **Create backend endpoint**

   ```bash
   # Edit backend/app/routes/players.py
   # Auto-reload: changes visible immediately
   # Test: curl http://localhost:8000/api/v1/players
   ```

2. **Create frontend component**

   ```bash
   # Edit apps/web/src/pages/players.tsx
   # Auto-reload: changes visible immediately
   # Check DevTools for errors
   ```

3. **Type check & test**

   ```bash
   docker-compose exec web npm run typecheck
   docker-compose exec api pytest tests/
   ```

4. **Commit & push**
   ```bash
   git add .
   git commit -m "feat: add players listing"
   git push
   ```

## 🎓 Learning Resources

### Understanding the Stack

- **React 19**: https://react.dev
- **TanStack Query**: https://tanstack.com/query
- **FastAPI**: https://fastapi.tiangolo.com
- **PostgreSQL**: https://www.postgresql.org/docs
- **Docker**: https://docs.docker.com

### CaddyStats Specific

- Architecture: `docs/architecture/`
- API docs (interactive): http://localhost:8000/docs
- GraphQL explorer: http://localhost:8000/graphql
- Type definitions: `apps/web/src/types/index.ts`

## ✅ Verification Checklist

After setup, verify everything is working:

- [ ] `docker-compose ps` shows all containers "Up"
- [ ] http://localhost:3000 loads frontend
- [ ] http://localhost:8000/docs shows API documentation
- [ ] Frontend shows "CaddyStats" title
- [ ] Can navigate to different pages
- [ ] API endpoints respond to requests
- [ ] `docker-compose exec api pytest` runs tests
- [ ] Browser DevTools shows no errors
- [ ] Network tab shows API calls succeeding

## 🎯 Next Steps

1. **Read** `QUICKREF.md` (2 min) - One-page reference
2. **Setup** - Run `./dev.sh up` (2 min)
3. **Explore** - Open http://localhost:3000 (1 min)
4. **Test API** - Open http://localhost:8000/docs (2 min)
5. **Code** - Make your first change!

## 🤝 Getting Help

### Documentation Files

- `QUICKREF.md` - Quick reference
- `LOCAL_DEVELOPMENT.md` - Detailed commands
- `DEVELOPMENT_SETUP.md` - Configuration guide
- `API_TESTING.md` - API testing guide

### Checking Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api

# Recent logs only
docker-compose logs --tail=50 api
```

### Resetting Environment

```bash
# Clean slate
docker-compose down -v

# Rebuild from scratch
docker-compose up -d --build

# Fresh database with migrations
docker-compose exec api alembic upgrade head
```

## 📞 Support

- **Documentation**: `/docs` folder
- **Issues**: GitHub Issues
- **Questions**: Check `CONTRIBUTING.md`

---

**Ready to start?** Run `./dev.sh up` and open http://localhost:3000! 🚀
