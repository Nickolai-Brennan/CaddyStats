# CaddyStats Developer Quick Reference

**One-page cheat sheet for running and developing CaddyStats locally.**

## 🚀 Quick Start (30 seconds)

### macOS/Linux
```bash
cd CaddyStats
./dev.sh up
# Open http://localhost:3000
```

### Windows (PowerShell)
```powershell
cd CaddyStats
.\dev.cmd up
# Open http://localhost:3000
```

**Note:** PowerShell requires `.\ ` prefix. Alternatively, use Command Prompt: `dev.cmd up`

## 📍 Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | React web app |
| **API Docs** | http://localhost:8000/docs | Interactive API |
| **GraphQL** | http://localhost:8000/graphql | GraphQL IDE |
| **Health** | http://localhost:8000/health | Backend status |
| **Database** | localhost:5432 | PostgreSQL |
| **Cache** | localhost:6379 | Redis |

## 🔧 Essential Commands

```bash
# Start services
./dev.sh up              (macOS/Linux)
dev.cmd up               (Windows)

# View logs
docker-compose logs -f

# Stop services
./dev.sh stop            (macOS/Linux)
docker-compose stop      (Windows)

# Restart services
./dev.sh restart         (macOS/Linux)
docker-compose restart   (Windows)

# Database shell
docker-compose exec postgres psql -U caddystats -d caddystats

# Backend shell
docker-compose exec api bash

# Frontend shell
docker-compose exec web sh
```

## 📝 File Locations

```
Frontend:
  apps/web/src/          # React components & pages
  apps/web/.env.local    # Frontend config

Backend:
  backend/app/           # FastAPI code
  backend/tests/         # Tests
  database/schemas/      # Database migrations

Config:
  .env                   # Environment variables
  docker-compose.yml     # Service definitions
```

## 🔐 Default Credentials

```
Database:  caddystats / caddystats_dev
Redis:     password: caddystats_dev
Email:     test@example.com
Password:  test123
```

## 💻 Development Workflow

### Add Backend Endpoint
1. Create service in `backend/app/services/`
2. Create route in `backend/app/routes/`
3. Add types in `backend/app/schemas/`
4. Test with `docker-compose exec api pytest`

### Add Frontend Component
1. Create component in `apps/web/src/components/`
2. Use `useQuery()` for data
3. Use `useAuth()` for authentication
4. Test with `docker-compose exec web npm run test`

### Database Changes
```bash
# Create migration
docker-compose exec api alembic revision -m "description"

# Apply migration
docker-compose exec api alembic upgrade head

# Downgrade
docker-compose exec api alembic downgrade -1
```

## 🧪 Testing

```bash
# Backend tests
docker-compose exec api pytest tests/ -v

# Frontend tests
docker-compose exec web npm run test

# With coverage
docker-compose exec api pytest --cov=app tests/
```

## 🐛 Debugging

### Backend
```bash
# View logs
docker-compose logs -f api

# Enable debug mode
export LOG_LEVEL=debug
docker-compose restart api
```

### Frontend
```bash
# Browser DevTools (F12)
# - React DevTools tab
# - Network tab for API calls
# - Console for errors

# Query client state
queryClient.getQueryData(['players'])
```

### Database
```bash
# Connect to database
docker-compose exec postgres psql -U caddystats -d caddystats

# View tables
\dt

# Run query
SELECT * FROM players LIMIT 10;
```

## 🌐 API Quick Tests

```bash
# Get players
curl http://localhost:8000/api/v1/players

# Get specific player
curl http://localhost:8000/api/v1/players/123

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# With authentication
TOKEN="your-token-here"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/auth/me
```

## ⚙️ Configuration

### Environment Variables
Edit `.env` file:
```bash
API_PORT=8000                              # Backend port
VITE_API_BASE_URL=http://localhost:8000    # Frontend API URL
DATABASE_URL=postgresql://...              # Database
LOG_LEVEL=info|debug                       # Logging
```

### Enable/Disable Features
```bash
GRAPHQL_PLAYGROUND_ENABLED=true            # GraphQL IDE
DEBUG=true                                 # Debug mode
RATE_LIMIT_ENABLED=true                    # Rate limiting
```

## 📊 Performance Monitoring

```bash
# Check service status
docker-compose ps

# View real-time logs
docker-compose logs -f

# Check database performance
docker-compose exec postgres psql -U caddystats -d caddystats << EOF
EXPLAIN ANALYZE SELECT * FROM players WHERE world_rank < 50;
EOF

# Monitor resource usage
docker stats
```

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port already in use | `netstat -an \| grep :8000` then kill process |
| Can't connect to DB | `docker-compose logs postgres` |
| Frontend can't reach API | Check `VITE_API_BASE_URL` in .env |
| Services won't start | `docker-compose down -v && docker-compose up` |
| Tests failing | `docker-compose restart api && docker-compose exec api pytest` |

## 📚 Documentation

- **Quick Start**: `LOCAL_DEVELOPMENT.md`
- **Setup Guide**: `DEVELOPMENT_SETUP.md`
- **API Reference**: `API_TESTING.md`
- **Architecture**: `docs/architecture/`

## 🔄 Typical Development Session

```bash
# 1. Start everything
./dev.sh up

# 2. Watch logs
docker-compose logs -f api &

# 3. In editor: create component/endpoint
# (Auto-reload enabled)

# 4. Test in browser
open http://localhost:3000

# 5. Check API
open http://localhost:8000/docs

# 6. Run tests
docker-compose exec api pytest

# 7. When done
./dev.sh stop
```

## 💡 Pro Tips

- Use Swagger UI (http://localhost:8000/docs) to test endpoints interactively
- Use VS Code REST Client extension for API testing
- Enable `GRAPHQL_PLAYGROUND_ENABLED=true` to explore GraphQL
- Use `docker-compose exec` to run commands in containers
- Check `.vscode/` for recommended extensions and settings
- Watch `.github/workflows/` for CI/CD patterns

## 🚀 Next Steps

1. Start services: `./dev.sh up`
2. Check frontend: http://localhost:3000
3. Check API: http://localhost:8000/docs
4. Start coding!
5. Push changes to `master` branch

---

**Questions?** See full documentation in `LOCAL_DEVELOPMENT.md`, `DEVELOPMENT_SETUP.md`, or `API_TESTING.md`

**Need help?** Check logs: `docker-compose logs -f`
