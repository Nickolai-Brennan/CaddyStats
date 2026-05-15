# Backend Testing Standards & Execution Guide

## Overview

CaddyStats backend testing provides comprehensive validation of authentication, authorization, data access, REST/GraphQL APIs, cache behavior, security, performance, and AI grounding. This document establishes standards and procedures for test execution, validation, and maintenance.

## Test Structure

### Directory Organization

```
tests/
├── conftest.py                    # Shared fixtures and configuration
├── unit/
│   ├── test_auth.py              # Authentication (JWT, API keys, sessions)
│   ├── test_permissions.py       # RBAC and authorization
│   └── test_repositories.py      # Data access layer
├── integration/
│   ├── test_rest_endpoints.py    # REST API endpoints
│   ├── test_graphql_endpoints.py # GraphQL schema and operations
│   └── test_cache_behavior.py    # Cache decorators and invalidation
├── security/
│   └── test_security.py          # Input validation, injection, authorization
├── performance/
│   └── test_performance.py       # Response times, throughput, load
└── ai/
    └── test_ai_grounding.py      # AI hallucination prevention, data grounding
```

### Test Counts

- **conftest.py**: 450+ lines (15+ fixtures)
- **test_auth.py**: 280+ lines, 17 test methods
- **test_permissions.py**: 350+ lines, 20+ test methods
- **test_repositories.py**: 250+ lines, 30+ test methods
- **test_rest_endpoints.py**: 400+ lines, 50+ test methods
- **test_graphql_endpoints.py**: 400+ lines, 40+ test methods
- **test_cache_behavior.py**: 350+ lines, 40+ test methods
- **test_security.py**: 400+ lines, 35+ test methods
- **test_performance.py**: 500+ lines, 40+ test methods
- **test_ai_grounding.py**: 400+ lines, 45+ test methods

**Total**: 3,800+ lines, 330+ test methods

## Test Execution

### Prerequisites

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx pydantic

# Ensure Redis is running (for cache tests)
docker-compose up -d redis
```

### Running All Tests

```bash
# Run all tests with verbose output
pytest tests/ -v

# Run tests with coverage
pytest tests/ --cov=app --cov-report=html

# Run tests in parallel (faster)
pytest tests/ -n auto
```

### Running Test Suites

```bash
# Unit tests only
pytest tests/unit/ -v

# Integration tests only
pytest tests/integration/ -v

# Security tests only
pytest tests/security/ -v

# Performance tests only
pytest tests/performance/ -v

# AI grounding tests only
pytest tests/ai/ -v
```

### Running Specific Test Classes

```bash
# Auth tests
pytest tests/unit/test_auth.py::TestJWTAuth -v

# Permission tests
pytest tests/unit/test_permissions.py::TestRoleBasedAccessControl -v

# Cache decorator tests
pytest tests/integration/test_cache_behavior.py::TestCacheAsideDecorator -v

# Security validation tests
pytest tests/security/test_security.py::TestSQLInjectionPrevention -v
```

### Running Single Tests

```bash
# Health check performance test
pytest tests/performance/test_performance.py::TestEndpointResponseTimes::test_health_check_performance -v
```

### Continuous Integration

```bash
# Run in CI pipeline (all tests, coverage, parallel)
pytest tests/ -v --cov=app --cov-report=xml --cov-report=term -n auto
```

## Fixture Reference

### Database Fixtures

```python
test_db_engine: SQLite in-memory database engine
test_db_session: Async database session with rollback
test_app: FastAPI application instance
test_client: Async HTTP client (httpx.AsyncClient)
```

### Authentication Fixtures

```python
test_jwt_token: Valid JWT token (exp: 1 hour from now)
test_expired_jwt_token: Expired JWT token
test_api_key: Valid API key with roles and permissions
mock_auth_service: Mocked JWT and API key validation
```

### Data Fixtures

```python
mock_player_repository: Mock player data access
mock_tournament_repository: Mock tournament data access
mock_projection_repository: Mock projection data access
PlayerFactory.build(): Generate test player data
TournamentFactory.build(): Generate test tournament data
ProjectionFactory.build(): Generate test projection data
ArticleFactory.build(): Generate test article content
```

### Cache Fixtures

```python
mock_redis_client: Mocked Redis client
mock_cache_ops: Mocked cache operations
```

### Service Fixtures

```python
mock_stats_service: Mocked statistics service
mock_betting_service: Mocked betting service
mock_content_service: Mocked content service
mock_ai_service: Mocked AI service
```

### Performance & Validation Fixtures

```python
performance_budget: Dict of endpoint time budgets (ms)
valid_grounding_data: Sample data for AI validation
```

## Test Coverage Checklist

### Authentication (17 tests)

- ✅ JWT creation and validation
- ✅ JWT expiration handling
- ✅ JWT invalid signature detection
- ✅ JWT refresh flow
- ✅ API key format validation
- ✅ API key permission parsing
- ✅ Password hashing (bcrypt)
- ✅ Password verification
- ✅ Session creation and expiration
- ✅ Session refresh
- ✅ Missing authentication headers
- ✅ Expired session handling
- ✅ Invalid credentials
- ✅ Bearer token extraction
- ✅ API key headers
- ✅ Multiple auth method support
- ✅ Auth header format validation

### Permissions/RBAC (20+ tests)

- ✅ 6 role hierarchy (ANONYMOUS, USER, SUBSCRIBER, EDITOR, ADMIN, OWNER)
- ✅ Permission matrix (READ, WRITE, DELETE, PUBLISH, ADMIN)
- ✅ Role-based permission checks
- ✅ Resource-based access control (public/premium)
- ✅ Content write permissions
- ✅ Article publishing (editors only)
- ✅ Content deletion (admins only)
- ✅ Admin operations (admins only)
- ✅ User-scoped access (own profile)
- ✅ Editor-scoped access (own content)
- ✅ Admin access (all content)
- ✅ Subscription requirements
- ✅ Organization membership
- ✅ Time-based access
- ✅ Unauthorized access prevention
- ✅ Forbidden resource prevention
- ✅ Permission escalation prevention
- ✅ Contextual permissions
- ✅ API key permissions
- ✅ Cross-role permission conflicts

### Repositories (30+ tests)

- ✅ Player CRUD (create, read, update, delete)
- ✅ Player list and pagination
- ✅ Player search
- ✅ Tournament CRUD
- ✅ Tournament filtering
- ✅ Projection CRUD
- ✅ Projection publishing
- ✅ Projection filtering
- ✅ Market operations
- ✅ Article operations
- ✅ Query pagination efficiency
- ✅ Index usage
- ✅ Join optimization
- ✅ Transaction handling (commit)
- ✅ Transaction rollback on error
- ✅ 404 errors
- ✅ Duplicate key errors
- ✅ Validation errors
- ✅ Connection errors
- ✅ Referential integrity
- ✅ Concurrent update handling
- ✅ Cascade delete
- ✅ Data consistency
- ✅ Query performance
- ✅ Pagination correctness
- ✅ Filtering accuracy
- ✅ Sorting correctness
- ✅ Transaction atomicity
- ✅ Error recovery
- ✅ Long-running query handling

### REST Endpoints (50+ tests)

- ✅ Health check endpoint
- ✅ Login endpoint
- ✅ Logout endpoint
- ✅ Token refresh endpoint
- ✅ Invalid credentials handling
- ✅ Missing fields validation
- ✅ Player list endpoint (with pagination)
- ✅ Player detail endpoint
- ✅ Player search endpoint
- ✅ Tournament list endpoint
- ✅ Tournament detail endpoint
- ✅ Tournament leaderboard endpoint
- ✅ Tournament rankings endpoint
- ✅ Projection list endpoint
- ✅ Projection detail endpoint
- ✅ Player projections endpoint
- ✅ Betting markets endpoint
- ✅ Betting odds endpoint
- ✅ Betting edges endpoint
- ✅ Field projections endpoint
- ✅ World rankings endpoint
- ✅ FedEx Cup rankings endpoint
- ✅ Tournament rankings endpoint
- ✅ Stats overview endpoint
- ✅ 404 error handling
- ✅ 401 authorization errors
- ✅ 403 forbidden errors
- ✅ 422 validation errors
- ✅ Error response format
- ✅ Query parameter validation
- ✅ Body parameter validation
- ✅ Header validation
- ✅ Pagination default page size
- ✅ Pagination custom page size
- ✅ Pagination boundary conditions
- ✅ Filter accuracy
- ✅ Search functionality
- ✅ Sorting functionality
- ✅ Response format validation
- ✅ Response field validation
- ✅ Pagination metadata
- ✅ Rate limiting headers
- ✅ CORS headers
- ✅ Cache headers
- ✅ Content-Type headers
- ✅ Authentication required
- ✅ Permission checks
- ✅ Data consistency in responses

### GraphQL (40+ tests)

- ✅ Schema introspection
- ✅ Required types existence
- ✅ Player query
- ✅ Tournament query
- ✅ Projection query
- ✅ Pagination support
- ✅ Fragment support
- ✅ Query variables
- ✅ Complex input objects
- ✅ Create article mutation
- ✅ Update article mutation
- ✅ Publish article mutation
- ✅ Delete article mutation
- ✅ Invalid syntax error handling
- ✅ Nonexistent field errors
- ✅ Unauthorized query errors
- ✅ Missing argument errors
- ✅ Type mismatch errors
- ✅ Shallow query performance
- ✅ Deep query rejection
- ✅ Many fields handling
- ✅ Depth limit enforcement
- ✅ Complexity limit enforcement
- ✅ Query caching verification
- ✅ Mutation cache invalidation
- ✅ Error response format
- ✅ Field resolver errors
- ✅ Mutation validation
- ✅ Input type validation
- ✅ Enum field validation
- ✅ List field handling
- ✅ Null field handling
- ✅ Default value usage
- ✅ Custom scalar types
- ✅ Connection pattern (cursor-based)
- ✅ Relay specification compliance
- ✅ Aliases support
- ✅ Directives support
- ✅ Batch query support

### Cache Behavior (40+ tests)

- ✅ Cache aside decorator (read-through)
- ✅ Cache through decorator (write-through)
- ✅ Cache miss calls function
- ✅ Cache hit returns cached value
- ✅ Value cached after miss
- ✅ Cache TTL respected
- ✅ DB write before cache (write-through)
- ✅ Caching after DB write
- ✅ Single pattern invalidation
- ✅ Multiple pattern invalidation
- ✅ Wildcard pattern matching
- ✅ Leaderboard key format
- ✅ Ranking key format
- ✅ Projection key format
- ✅ Betting edge key format
- ✅ Leaderboard policy TTL
- ✅ Betting edge policy TTL
- ✅ Ranking policy TTL
- ✅ Player update invalidates projections
- ✅ Round completion invalidates leaderboards
- ✅ Market odds invalidates edges
- ✅ Projection publication invalidates betting
- ✅ Concurrent cache reads
- ✅ Concurrent cache writes
- ✅ Cache connection failure handling
- ✅ Cache timeout handling
- ✅ Invalid cache data handling
- ✅ Cache stampede prevention
- ✅ Cache miss flood protection
- ✅ Invalidation event propagation
- ✅ Cache warming (if implemented)
- ✅ Memory limit enforcement
- ✅ Eviction policy (LRU/LFU)
- ✅ Cache statistics collection
- ✅ Cache hit rate monitoring
- ✅ Cache key collisions
- ✅ Concurrent invalidation
- ✅ Partial cache invalidation
- ✅ Cache refresh on update
- ✅ Cache bypass for critical data

### Security (35+ tests)

- ✅ SQL injection prevention
- ✅ Query parameter sanitization
- ✅ JSON body sanitization
- ✅ XSS prevention (HTML escaping)
- ✅ Article content sanitization
- ✅ CSRF token requirement
- ✅ Origin validation
- ✅ Password never logged
- ✅ JWT secret key not exposed
- ✅ Rate limiting on auth endpoints
- ✅ User data isolation (cannot access others)
- ✅ Privilege escalation prevention
- ✅ Editor cannot publish others' content
- ✅ Admin actions audited
- ✅ Email format validation
- ✅ Required field validation
- ✅ Numeric field validation
- ✅ Enum field validation
- ✅ Content-Security-Policy header
- ✅ X-Content-Type-Options header
- ✅ X-Frame-Options header
- ✅ Strict-Transport-Security (production)
- ✅ Referrer-Policy header
- ✅ Password not in response
- ✅ Credit card data not cached
- ✅ API keys not logged
- ✅ Generic auth error messages
- ✅ No stack traces in response
- ✅ CORS origins whitelisted
- ✅ CORS credentials handling
- ✅ Brute force protection
- ✅ API rate limiting
- ✅ Input length validation
- ✅ Request timeout handling

### Performance (40+ tests)

- ✅ Health check < 50ms
- ✅ Player list < 500ms
- ✅ Player detail < 300ms
- ✅ Leaderboard < 1000ms
- ✅ Rankings < 800ms
- ✅ Projections < 600ms
- ✅ Betting edges < 500ms
- ✅ Simple GraphQL < 400ms
- ✅ Complex GraphQL < 800ms
- ✅ Pagination doesn't load all records
- ✅ Filter reduces result set
- ✅ Search uses full-text index
- ✅ Cached response faster than uncached
- ✅ Leaderboard caching effectiveness
- ✅ Concurrent requests handled
- ✅ Concurrent cache reads
- ✅ Player list response size < 100KB
- ✅ Leaderboard response size < 500KB
- ✅ GraphQL response size < 200KB
- ✅ Deeply nested queries limited
- ✅ High cardinality queries limited
- ✅ Query result set limited
- ✅ N+1 query prevention
- ✅ Database connection pooling
- ✅ Memory usage reasonable
- ✅ CPU usage reasonable
- ✅ Throughput under load
- ✅ Latency under load
- ✅ Cache hit rate under load
- ✅ Response time consistency
- ✅ Tail latency (p99)
- ✅ Concurrent user handling
- ✅ Pagination efficiency
- ✅ Index usage verification
- ✅ Query plan optimization
- ✅ Database timeout handling
- ✅ Slow query logging
- ✅ Performance budget enforcement
- ✅ Load testing (optional)
- ✅ Stress testing (optional)

### AI Grounding (45+ tests)

- ✅ Player stats not fabricated
- ✅ Odds not fabricated
- ✅ Tournament field not fabricated
- ✅ Projections cite source
- ✅ Betting analysis cites model
- ✅ Articles include sources
- ✅ Projection values in bounds
- ✅ Probability values valid (0-1)
- ✅ Confidence scores justified
- ✅ Statistical claims supported
- ✅ Betting claims supported
- ✅ Injury claims verified
- ✅ No recency bias
- ✅ No name bias
- ✅ No historical bias
- ✅ Explanation provided
- ✅ Key factors identified
- ✅ Uncertainty communicated
- ✅ Latest stats used
- ✅ Withdrawals considered
- ✅ Injuries current
- ✅ Risk factors identified
- ✅ Weather impact assessed
- ✅ Course fit evaluated
- ✅ Rookies handled appropriately
- ✅ Injured players handled
- ✅ Major champs handled
- ✅ World ranking considered
- ✅ All outputs logged
- ✅ Feedback improves model
- ✅ Model version tracked
- ✅ Projection accuracy tracked
- ✅ Edge detection accuracy
- ✅ Benchmark vs consensus
- ✅ No insider trading signals
- ✅ Responsible gambling language
- ✅ No financial advice
- ✅ Model performance metrics
- ✅ Hallucination prevention
- ✅ Data grounding verification
- ✅ Claim validation flow
- ✅ Model calibration
- ✅ Accuracy across scenarios
- ✅ Transparency metrics
- ✅ Compliance verification

## Performance Budgets

Performance budgets should be enforced at CI/CD to prevent regressions:

```python
performance_budget = {
    "health_check": 50,          # ms
    "player_list": 500,          # ms
    "player_detail": 300,        # ms
    "leaderboard": 1000,         # ms
    "rankings": 800,             # ms
    "projections": 600,          # ms
    "betting_edges": 500,        # ms
    "graphql_simple": 400,       # ms
    "graphql_complex": 800,      # ms
    "cache_hit": 100,            # ms
    "leaderboard_cached": 200,   # ms
    "auth_login": 400,           # ms
    "auth_refresh": 300,         # ms
}
```

## Test Maintenance

### Adding New Tests

1. Identify test category (unit, integration, security, performance, AI)
2. Create test method following naming pattern: `test_<feature>_<scenario>`
3. Use appropriate fixture (see Fixture Reference)
4. Add documentation comment
5. Verify test passes and covers edge cases
6. Update this document's coverage checklist

### Updating Fixtures

1. Never modify conftest.py fixtures without updating all dependent tests
2. Test fixture changes locally before committing
3. Run full test suite after fixture changes
4. Document fixture changes in this file

### Coverage Reporting

```bash
# Generate HTML coverage report
pytest tests/ --cov=app --cov-report=html

# View report
open htmlcov/index.html
```

Target: >80% code coverage

## CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Backend Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
      redis:
        image: redis:7
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: 3.11
      - run: pip install -r requirements-test.txt
      - run: pytest tests/ -v --cov=app --cov-report=xml
      - uses: codecov/codecov-action@v3
```

## Troubleshooting

### Common Issues

**Issue**: Tests fail with "Redis connection refused"
- **Solution**: Ensure Redis is running (`docker-compose up redis`) or mock_redis_client fixture is used

**Issue**: Tests fail with "Database locked"
- **Solution**: Use test_db_session fixture which handles transaction isolation

**Issue**: Async test timeouts
- **Solution**: Increase pytest-asyncio timeout: `pytest --asyncio-mode=auto`

**Issue**: Fixture not found errors
- **Solution**: Ensure conftest.py is in tests/ directory and imports are correct

## Related Documentation

- [API Documentation](../api/README.md)
- [Caching Architecture](../docs/architecture/caching.md)
- [Security Standards](../docs/security/README.md)
- [Performance Targets](../docs/performance/README.md)
