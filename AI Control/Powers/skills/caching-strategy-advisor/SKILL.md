---
name: caching-strategy-advisor
description: |
  Recommends and implements caching strategies for APIs, databases, and frontend
  assets: cache layers, TTLs, cache invalidation patterns, and Redis/in-memory
  implementation code. Use this skill whenever a user says "add caching to this",
  "my API is too slow — should I cache?", "implement Redis caching", "what's the
  right TTL for this?", "how do I cache this database query?", "add HTTP caching
  headers", "implement a cache-aside pattern", or "optimize performance with caching".
  Also activate when someone has a slow endpoint or repeated expensive query.
  Supports Redis, in-memory (Node, Python), and HTTP cache headers. Do NOT use
  for CDN configuration (infrastructure-level) or browser service worker caching
  (different skill scope).
---

# Caching Strategy Advisor

Recommend the right caching layer and TTL strategy, then implement it with
cache-aside patterns, proper invalidation, and monitoring hooks.

## When to Use

- An API endpoint is slow because of repeated expensive DB queries
- A third-party API is rate-limited and responses can be reused
- A computation (aggregation, report, ML inference) is expensive and inputs change rarely
- Static assets and API responses need HTTP caching headers

## When NOT to Use

- CDN configuration (Cloudflare, CloudFront — infrastructure scope)
- Browser service worker caching
- Database query result caching within the ORM (use ORM-level caching)

---

## Workflow

### Step 1 — Diagnose the Caching Opportunity

Ask:

1. **What's slow?** (Specific endpoint, query, or computation)
2. **How often does the data change?** (Real-time / seconds / minutes / hours / rarely)
3. **How many users share the same data?** (Shared cache vs. per-user cache)
4. **What's the tolerance for stale data?** (Strict = no cache; Tolerant = long TTL)
5. **Existing infrastructure:** Redis available? Or in-memory only?

### Step 2 — Recommend the Cache Strategy

| Data type                            | Strategy                                | TTL                 |
| ------------------------------------ | --------------------------------------- | ------------------- |
| User profile (own data)              | Per-user cache, short TTL               | 5 min               |
| Public content (blog posts, catalog) | Shared cache                            | 1–24 hrs            |
| Aggregate stats / dashboards         | Shared cache, background refresh        | 5–60 min            |
| Third-party API responses            | Shared cache, respect API cache headers | 1–60 min            |
| Auth tokens / sessions               | Per-user, until expiry                  | Token TTL           |
| Heavy computation results            | Shared, keyed by inputs                 | Until input changes |

### Step 3 — Implement Cache-Aside Pattern

**Node.js + Redis (ioredis):**

```typescript
// cache/redis.ts
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: 3,
  lazyConnect: true,
});

export async function cacheAside<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number,
): Promise<T> {
  // 1. Try cache
  const cached = await redis.get(key);
  if (cached !== null) {
    return JSON.parse(cached) as T;
  }

  // 2. Cache miss — fetch from source
  const data = await fetcher();

  // 3. Store in cache (don't await — let it happen in background)
  redis
    .setex(key, ttlSeconds, JSON.stringify(data))
    .catch((err) => console.error(`[cache] Failed to set key ${key}:`, err));

  return data;
}

export function buildCacheKey(...parts: string[]): string {
  return parts.join(":");
}

export async function invalidateCache(...keys: string[]): Promise<void> {
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

export async function invalidateCacheByPattern(pattern: string): Promise<void> {
  const keys = await redis.keys(pattern);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}
```

**Usage in a service:**

```typescript
// services/productService.ts
import { cacheAside, invalidateCache, buildCacheKey } from "../cache/redis";

const PRODUCT_TTL = 60 * 30; // 30 minutes

export async function getProduct(id: string): Promise<Product | null> {
  return cacheAside(
    buildCacheKey("product", id),
    () => db.products.findOne({ where: { id } }),
    PRODUCT_TTL,
  );
}

export async function updateProduct(
  id: string,
  data: Partial<Product>,
): Promise<Product> {
  const updated = await db.products.update(data, { where: { id } });
  // Invalidate cache on write
  await invalidateCache(buildCacheKey("product", id));
  return updated;
}

export async function getProductList(category: string): Promise<Product[]> {
  return cacheAside(
    buildCacheKey("products", "list", category),
    () => db.products.findAll({ where: { category } }),
    PRODUCT_TTL,
  );
}
```

**Python + Redis:**

```python
# cache/redis_cache.py
import json
import redis
import os
from typing import TypeVar, Callable, Awaitable
from functools import wraps

r = redis.Redis.from_url(os.environ['REDIS_URL'], decode_responses=True)
T = TypeVar('T')

def cache_aside(key: str, fetcher: Callable, ttl_seconds: int):
    """Cache-aside pattern: check cache, fetch if miss, store result."""
    cached = r.get(key)
    if cached is not None:
        return json.loads(cached)

    data = fetcher()
    r.setex(key, ttl_seconds, json.dumps(data))
    return data

def cached(ttl_seconds: int, key_prefix: str = ''):
    """Decorator for caching function results by arguments."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            key = f'{key_prefix or func.__name__}:{args}:{sorted(kwargs.items())}'
            return cache_aside(key, lambda: func(*args, **kwargs), ttl_seconds)
        return wrapper
    return decorator

# Usage:
@cached(ttl_seconds=1800, key_prefix='product')
def get_product(product_id: str):
    return db.session.query(Product).filter_by(id=product_id).first()
```

### Step 4 — HTTP Cache Headers

For API responses, add HTTP caching headers:

```typescript
// middleware/cacheHeaders.ts
export function setCacheHeaders(
  maxAge: number,
  options: { private?: boolean; revalidate?: boolean } = {},
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const directives: string[] = [
      options.private ? "private" : "public",
      `max-age=${maxAge}`,
    ];
    if (options.revalidate) {
      directives.push("must-revalidate");
    }
    res.set("Cache-Control", directives.join(", "));
    next();
  };
}

// Route usage:
router.get("/products", setCacheHeaders(1800), asyncHandler(getProducts));
router.get(
  "/profile",
  setCacheHeaders(60, { private: true }),
  asyncHandler(getProfile),
);
```

### Step 5 — Stale-While-Revalidate (Background Refresh)

For data that should never be slow:

```typescript
export async function staleWhileRevalidate<T>(
  key: string,
  fetcher: () => Promise<T>,
  staleTTL: number,
  revalidateTTL: number,
): Promise<T> {
  const cached = await redis.get(key);
  const revalidateFlagKey = `${key}:revalidating`;

  if (cached !== null) {
    // Return stale data immediately, refresh in background if near expiry
    const ttl = await redis.ttl(key);
    if (ttl < revalidateTTL && !(await redis.get(revalidateFlagKey))) {
      await redis.setex(revalidateFlagKey, 30, "1"); // lock for 30s
      fetcher().then((fresh) =>
        redis.setex(key, staleTTL, JSON.stringify(fresh)),
      );
    }
    return JSON.parse(cached);
  }

  // No cache — fetch synchronously
  const data = await fetcher();
  await redis.setex(key, staleTTL, JSON.stringify(data));
  return data;
}
```

---

## Output Format

1. **Strategy recommendation** — which caching layer, what TTL, and why
2. **`cacheAside()` helper** — generic implementation for the target stack
3. **Usage examples** — how to wrap existing service functions
4. **Cache invalidation** — where and how to call invalidation on writes
5. **HTTP cache headers** — if the endpoint is public

---

## Safety & Confirmation

- Never cache user-specific data in a shared cache without including the user ID in the cache key.
- Flag any data that must be consistent in real-time (financial balances, inventory counts) — recommend short TTL or no cache.
- Confirm Redis connection is available before switching to Redis-based caching.
- Add a circuit breaker pattern — if Redis is down, fall through to the source of truth gracefully.
