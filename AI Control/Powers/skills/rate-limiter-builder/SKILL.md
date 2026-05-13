---
name: rate-limiter-builder
description: |
  Implements rate limiting middleware with configurable rules, sliding window or
  token bucket algorithms, Redis-backed distributed limiting, and response headers.
  Use this skill whenever a user says "add rate limiting", "protect this endpoint
  from abuse", "implement a rate limiter", "limit API requests per user",
  "throttle this endpoint", "add rate limits to my API", "prevent brute force on
  login", or "implement per-IP and per-user rate limits". Also activate when
  someone's API is being hammered or abused. Supports Express/Node.js and
  FastAPI/Python with Redis (distributed) or in-memory (single-server). Do NOT
  use for CDN-level rate limiting (Cloudflare, AWS WAF — infrastructure scope) or
  queue throttling (use background-job-designer).
---

# Rate Limiter Builder

Implement production-ready rate limiting middleware with configurable windows,
algorithms, Redis-backed distributed support, and proper response headers.

## When to Use

- Protecting public API endpoints from abuse or scraping
- Preventing brute-force attacks on authentication endpoints
- Implementing per-user or per-API-key quotas
- Adding cost protection to expensive operations (LLM calls, file processing)

## When NOT to Use

- CDN-level DDoS protection (Cloudflare, AWS WAF)
- Queue-based throttling of background jobs (use `background-job-designer`)
- Application-level concurrency limiting (semaphores)

---

## Workflow

### Step 1 — Define Rate Limit Rules

Ask for:

1. **Endpoints to limit:** All routes / specific routes / by route type?
2. **Limit key:** By IP / by user ID / by API key / by plan tier?
3. **Limits:** Requests per window (e.g., 100 req/15min, 10 req/sec)
4. **Algorithm:** Fixed window / Sliding window / Token bucket
5. **Infrastructure:** Redis available (distributed) or single server (in-memory)?
6. **On limit exceeded:** Hard block (429) / soft delay / queue?

### Step 2 — Choose the Algorithm

| Algorithm          | Use case            | Pro                              | Con                                    |
| ------------------ | ------------------- | -------------------------------- | -------------------------------------- |
| **Fixed window**   | Simple use case     | Easy to implement                | Edge case: 2× burst at window boundary |
| **Sliding window** | General API limits  | Fair, no burst edge case         | More complex                           |
| **Token bucket**   | Smooth flow control | Allows bursts, refills gradually | Most complex                           |

**Recommendation:** Sliding window for API limits; Token bucket for expensive operations.

### Step 3 — Express Middleware Implementation

**Using `express-rate-limit` + `rate-limit-redis` (recommended for most apps):**

```typescript
// middleware/rateLimiter.ts
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import { createClient } from "redis";

const redisClient = createClient({ url: process.env.REDIS_URL });
await redisClient.connect();

// General API rate limit: 100 req / 15 min
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,
  standardHeaders: "draft-7", // includes RateLimit-Policy header
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),
  keyGenerator: (req) => {
    // Use authenticated user ID if available, fall back to IP
    return (req as any).user?.id ?? req.ip ?? "anonymous";
  },
  handler: (req, res) => {
    res.status(429).json({
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many requests. Please slow down.",
        retryAfter: res.getHeader("Retry-After"),
      },
    });
  },
  skip: (req) => {
    // Skip rate limiting for internal/health-check routes
    return req.path === "/health";
  },
});

// Strict auth limit: 10 req / 15 min (brute force protection)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
    prefix: "auth_limit:",
  }),
  keyGenerator: (req) => req.ip ?? "unknown",
  handler: (_req, res) => {
    res.status(429).json({
      error: {
        code: "AUTH_RATE_LIMIT_EXCEEDED",
        message: "Too many login attempts. Try again in 15 minutes.",
      },
    });
  },
});

// Expensive operations: 5 req / minute per user
export const expensiveLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => (req as any).user?.id ?? req.ip,
});
```

**Route registration:**

```typescript
// app.ts
import {
  apiLimiter,
  authLimiter,
  expensiveLimiter,
} from "./middleware/rateLimiter";

// Apply broadly
app.use("/api/", apiLimiter);

// Override for auth endpoints (stricter)
app.use("/api/auth/", authLimiter);

// Override for expensive routes
app.use("/api/reports/", expensiveLimiter);
```

### Step 4 — Custom Sliding Window (Redis, from scratch)

For fine-grained control:

```typescript
// middleware/slidingWindowLimiter.ts
import { redis } from "../redis";

interface RateLimitOptions {
  key: string; // identifies the limiter (e.g., 'api:user:123')
  windowMs: number; // window in milliseconds
  maxRequests: number; // max requests per window
}

export async function checkRateLimit({
  key,
  windowMs,
  maxRequests,
}: RateLimitOptions): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: Date;
}> {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Redis sorted set: score = timestamp, member = unique request ID
  const pipeline = redis.pipeline();
  pipeline.zremrangebyscore(key, 0, windowStart); // remove expired entries
  pipeline.zadd(key, now, `${now}-${Math.random()}`); // add current request
  pipeline.zcard(key); // count in window
  pipeline.pexpire(key, windowMs); // set TTL

  const results = await pipeline.exec();
  const count = (results?.[2]?.[1] as number) ?? 0;

  return {
    allowed: count <= maxRequests,
    remaining: Math.max(0, maxRequests - count),
    resetAt: new Date(now + windowMs),
  };
}
```

### Step 5 — Plan-Based Rate Limits

For tiered SaaS pricing:

```typescript
const PLAN_LIMITS: Record<string, { windowMs: number; limit: number }> = {
  free: { windowMs: 60_000, limit: 60 }, // 60 req/min
  pro: { windowMs: 60_000, limit: 600 }, // 600 req/min
  enterprise: { windowMs: 60_000, limit: 6000 }, // 6000 req/min
};

export function createPlanLimiter() {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    const plan = user?.plan ?? "free";
    const { windowMs, limit } = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;

    const result = await checkRateLimit({
      key: `plan_limit:${user?.id ?? req.ip}`,
      windowMs,
      maxRequests: limit,
    });

    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", result.remaining);
    res.setHeader("X-RateLimit-Reset", result.resetAt.toISOString());

    if (!result.allowed) {
      return res.status(429).json({
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: "Rate limit exceeded for your plan.",
        },
      });
    }

    next();
  };
}
```

---

## Standard Rate Limit Headers

All rate-limited endpoints should include:

```
RateLimit-Limit: 100
RateLimit-Remaining: 42
RateLimit-Reset: 1699999999
Retry-After: 47
```

---

## Output Format

1. **Rate limit rules table** — endpoint, window, limit, key type
2. **Middleware implementation** — ready-to-use Express/FastAPI middleware
3. **Route registration** — where to apply each limiter
4. **Response headers** — standard RateLimit headers
5. **Plan-based variant** — if tiered limits are needed

---

## Safety & Confirmation

- Always apply a strict rate limit to authentication endpoints (login, password reset, OTP) regardless of other limits.
- Use Redis-backed distributed rate limiting for multi-instance deployments — in-memory won't work behind a load balancer.
- Return `Retry-After` in the 429 response — don't leave clients guessing when to retry.
- Don't rate limit health check and monitoring endpoints.
