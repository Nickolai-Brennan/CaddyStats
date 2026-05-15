# CaddyStats API Testing & Integration Guide

Complete guide for testing and developing with the CaddyStats API.

## API Overview

### Base URL

```
http://localhost:8000/api/v1
```

### Available Endpoints

#### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user

#### Players

- `GET /players` - List players (paginated)
- `GET /players/{id}` - Get player details
- `GET /players/{id}/stats` - Get player statistics
- `GET /players/{id}/history` - Get player tournament history

#### Tournaments

- `GET /tournaments` - List tournaments
- `GET /tournaments/{id}` - Get tournament details
- `GET /tournaments/{id}/leaderboard` - Tournament leaderboard
- `GET /tournaments/{id}/field` - Tournament field

#### Rankings

- `GET /rankings/world` - World golf rankings
- `GET /rankings/fedex-cup` - FedEx Cup standings
- `GET /rankings/tournament/{id}` - Tournament rankings

#### Projections

- `GET /projections` - List projections
- `GET /projections/tournament/{id}` - Projections for tournament
- `GET /projections/{id}` - Get projection details

#### Betting

- `GET /betting/edges` - Betting edges/recommendations
- `GET /betting/odds` - Sportsbook odds
- `GET /betting/markets` - Available betting markets

#### Articles

- `GET /articles` - List articles
- `GET /articles/{slug}` - Get article by slug
- `POST /articles` - Create article (admin only)

#### Admin

- `POST /admin/rebuild-cache` - Rebuild cache
- `POST /admin/ingest-data` - Trigger data ingestion
- `GET /admin/health` - System health check

## Testing Tools

### Using Curl

#### GET Request

```bash
# List players
curl http://localhost:8000/api/v1/players

# With parameters
curl "http://localhost:8000/api/v1/players?page=1&page_size=10&sort=world_rank"

# Get specific player
curl http://localhost:8000/api/v1/players/123
```

#### POST Request with Authentication

```bash
# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password"
  }'

# Response includes access_token
# {
#   "access_token": "eyJ0eXAi...",
#   "refresh_token": "eyJ0eXAi...",
#   "token_type": "bearer"
# }
```

#### Using Bearer Token

```bash
# Get current user
TOKEN="your-access-token-here"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/auth/me

# Create article (admin only)
curl -X POST http://localhost:8000/api/v1/articles \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Article Title",
    "slug": "article-title",
    "content": "Article content here",
    "status": "published"
  }'
```

### Using Swagger UI (Interactive)

Access the interactive API documentation:

```
http://localhost:8000/docs
```

Features:

- Browse all endpoints
- Test requests directly from browser
- View request/response schemas
- See example responses
- Try different parameters

### Using GraphQL IDE

Access GraphQL playground:

```
http://localhost:8000/graphql
```

#### Example GraphQL Query

```graphql
query GetPlayers {
  players(first: 10) {
    edges {
      node {
        id
        name
        worldRank
        statistics {
          avgDrivingDistance
          avgScore
        }
      }
    }
  }
}
```

#### Example GraphQL Mutation

```graphql
mutation CreateArticle {
  createArticle(
    input: {
      title: "New Article"
      slug: "new-article"
      content: "Article content"
      status: PUBLISHED
    }
  ) {
    article {
      id
      title
      slug
    }
  }
}
```

### Using Postman

1. Import OpenAPI spec:
   - Open Postman
   - File → Import
   - URL → `http://localhost:8000/openapi.json`
   - Import

2. Authenticate:
   - Create request to `POST /auth/login`
   - Send credentials
   - Copy `access_token` from response
   - In Postman: Authorization tab → Type: Bearer Token → paste token

3. Test endpoints:
   - Select pre-imported request
   - Update parameters as needed
   - Send request
   - View response

### Using REST Client (VS Code)

Create file `requests.rest`:

```rest
### Variables
@baseUrl = http://localhost:8000/api/v1
@token =

### Login
POST {{baseUrl}}/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}

### List Players
GET {{baseUrl}}/players?page=1&page_size=20

### Get Player Details
GET {{baseUrl}}/players/123

### Get Tournament Leaderboard
GET {{baseUrl}}/tournaments/456/leaderboard

### Get World Rankings
GET {{baseUrl}}/rankings/world?page=1&page_size=50

### Create Article (requires token)
POST {{baseUrl}}/articles
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "title": "Test Article",
  "slug": "test-article",
  "content": "Article content",
  "status": "draft"
}
```

Install VS Code extension: REST Client

- Click "Send Request" above each request to test

## Common Use Cases

### Authentication Flow

```bash
# 1. Register
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securepassword123",
    "name": "New User"
  }'

# 2. Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securepassword123"
  }'
# Copy access_token

# 3. Use token for authenticated requests
TOKEN="<access_token_from_login>"
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/auth/me
```

### Search Players

```bash
# Search by name
curl "http://localhost:8000/api/v1/players?search=Tiger%20Woods"

# Filter by ranking
curl "http://localhost:8000/api/v1/players?world_rank_min=1&world_rank_max=50"

# Sort by world rank
curl "http://localhost:8000/api/v1/players?sort=world_rank&order=asc"

# Combine filters
curl "http://localhost:8000/api/v1/players?search=Woods&world_rank_max=100&page=1&page_size=10"
```

### Get Tournament Data

```bash
# List upcoming tournaments
curl "http://localhost:8000/api/v1/tournaments?status=upcoming"

# Get leaderboard for tournament
curl "http://localhost:8000/api/v1/tournaments/123/leaderboard"

# Get field (participating players)
curl "http://localhost:8000/api/v1/tournaments/123/field"

# Get rankings at specific tournament
curl "http://localhost:8000/api/v1/rankings/tournament/123"
```

### Betting Intelligence

```bash
# Get betting recommendations
curl "http://localhost:8000/api/v1/betting/edges?tournament_id=123"

# Get sportsbook odds
curl "http://localhost:8000/api/v1/betting/odds?player_id=456&tournament_id=123"

# Get available markets
curl "http://localhost:8000/api/v1/betting/markets"
```

### Projections

```bash
# Get all projections for tournament
curl "http://localhost:8000/api/v1/projections/tournament/123"

# Get projection for specific player
curl "http://localhost:8000/api/v1/projections?player_id=456&tournament_id=123"

# Get projections with high confidence
curl "http://localhost:8000/api/v1/projections?min_confidence=0.75"
```

## Response Formats

### Success Response

```json
{
  "data": {
    "id": "123",
    "name": "Tiger Woods",
    "worldRank": 10,
    ...
  },
  "meta": {
    "timestamp": "2026-05-15T10:30:00Z",
    "request_id": "req-12345"
  }
}
```

### Paginated Response

```json
{
  "results": [
    { "id": "1", "name": "Player 1" },
    { "id": "2", "name": "Player 2" }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total": 500,
    "pages": 25
  }
}
```

### Error Response

```json
{
  "detail": "Not found",
  "code": "PLAYER_NOT_FOUND",
  "status": 404,
  "request_id": "req-12345"
}
```

## Rate Limiting

Default rate limits (configurable):

- Anonymous users: 60 requests/minute
- Authenticated users: 300 requests/minute
- Admin users: 1000 requests/minute

Response headers indicate rate limit status:

```
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 298
X-RateLimit-Reset: 1620000000
```

## Performance Tips

### Pagination

Always use pagination for list endpoints:

```bash
# Bad: No pagination (slow, large response)
curl http://localhost:8000/api/v1/players

# Good: Paginated request
curl "http://localhost:8000/api/v1/players?page=1&page_size=20"
```

### Caching

Use appropriate query parameters to leverage caching:

```bash
# These requests are cached:
curl "http://localhost:8000/api/v1/players?page=1"

# Different page = different cache key
curl "http://localhost:8000/api/v1/players?page=2"

# Force refresh (bypasses cache)
curl "http://localhost:8000/api/v1/players?nocache=1"
```

### Filtering

Filter on server instead of fetching all:

```bash
# Bad: Fetch all and filter client-side
curl http://localhost:8000/api/v1/players | grep "Woods"

# Good: Filter server-side
curl "http://localhost:8000/api/v1/players?search=Woods"
```

## Debugging

### Enable Debug Headers

Most endpoints return helpful debug headers in development:

```bash
curl -v http://localhost:8000/api/v1/players

# Look for:
# X-Debug-Time: Query took 45ms
# X-Debug-Cache: Hit (from cache)
# X-Debug-Query-Count: 3 SQL queries
```

### Check Backend Logs

```bash
# View real-time logs
docker-compose logs -f api

# View specific lines
docker-compose logs api --tail=50
```

### Database Queries

```bash
# Enable query logging
export DB_ECHO=true

# Restart backend
docker-compose restart api

# View SQL queries in logs
docker-compose logs -f api | grep "SELECT\|INSERT\|UPDATE"
```

## Testing Scripts

### Test Complete Flow

```bash
#!/bin/bash
API="http://localhost:8000/api/v1"

# Test health
echo "Testing health..."
curl $API/health

# Test players endpoint
echo "Testing players..."
curl $API/players?page=1

# Test rankings
echo "Testing rankings..."
curl $API/rankings/world

# Test articles
echo "Testing articles..."
curl $API/articles

echo "All tests complete!"
```

Save as `test-api.sh` and run:

```bash
chmod +x test-api.sh
./test-api.sh
```

## Integration Testing with Frontend

### Test Login Flow

1. Open DevTools (F12)
2. Go to Network tab
3. Open frontend: http://localhost:3000
4. Click "Sign In"
5. Enter credentials
6. Watch network requests:
   - `POST /api/v1/auth/login` - Should return tokens
   - `GET /api/v1/auth/me` - Should return user profile

### Test Data Fetching

1. Open frontend
2. Navigate to Players page
3. Watch Network tab:
   - `GET /api/v1/players` - Should return paginated results
   - Check cache headers

### Verify Type Safety

1. Check browser console for errors
2. Types should autocomplete in IDE
3. Invalid API calls should show TypeScript errors

## CI/CD Testing

### Run Integration Tests

```bash
# Backend tests
docker-compose exec api pytest tests/integration/ -v

# Frontend tests
docker-compose exec web npm run test

# E2E tests
docker-compose exec web npm run test:e2e
```

### Test Coverage

```bash
# Backend coverage
docker-compose exec api pytest --cov=app tests/

# Frontend coverage
docker-compose exec web npm run test -- --coverage
```

## Common Issues & Solutions

### 401 Unauthorized

- Token expired: Refresh using `/auth/refresh`
- Invalid token: Re-login
- CORS issue: Check `CORS_ALLOWED_ORIGINS` in .env

### 403 Forbidden

- Insufficient permissions: Check user role
- Admin endpoint: Must be admin user
- Resource access: Cannot access others' data

### 500 Internal Server Error

- Check backend logs: `docker-compose logs api`
- Restart backend: `docker-compose restart api`
- Check database connection: `docker-compose logs postgres`

### Slow Response

- Check cache: Is endpoint cacheable?
- Check database load: `docker-compose logs postgres`
- Profile query: Enable `DB_ECHO=true`

## Next Steps

1. ✅ Start services: `./dev.sh up`
2. ✅ Access API docs: http://localhost:8000/docs
3. ✅ Test endpoints with Swagger UI
4. ✅ Try frontend integration: http://localhost:3000
5. ✅ Check logs for any errors
6. ✅ Start developing!
