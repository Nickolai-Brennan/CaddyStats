"""Rate limiting middleware with Redis-first and in-memory fallback."""

from __future__ import annotations

import asyncio
import time
from collections.abc import Callable

from fastapi import Request, Response
from redis.asyncio import Redis
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.config import settings
from app.core.errors import structured_error_response


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Apply path-aware fixed-window rate limits to incoming requests."""

    def __init__(self, app: Callable):  # type: ignore[type-arg]
        super().__init__(app)
        self._memory_counts: dict[str, int] = {}
        self._memory_expiry: dict[str, int] = {}
        self._lock = asyncio.Lock()
        self._redis: Redis | None = None

    async def dispatch(self, request: Request, call_next: Callable) -> Response:  # type: ignore[type-arg]
        if not settings.RATE_LIMIT_ENABLED or self._is_exempt_path(request.url.path):
            return await call_next(request)

        client_id = self._client_identifier(request)
        bucket = "auth" if request.url.path.startswith("/api/v1/auth") else "default"
        limit = (
            settings.RATE_LIMIT_AUTH_REQUESTS_PER_MINUTE
            if bucket == "auth"
            else settings.RATE_LIMIT_REQUESTS_PER_MINUTE
        )

        now = int(time.time())
        window = now // 60
        reset_at = ((window + 1) * 60)
        ttl = max(1, reset_at - now)

        key = f"ratelimit:{bucket}:{window}:{client_id}"
        current_count = await self._increment(key=key, ttl_seconds=ttl)
        remaining = max(0, limit - current_count)

        headers = {
            "X-RateLimit-Limit": str(limit),
            "X-RateLimit-Remaining": str(remaining),
            "X-RateLimit-Reset": str(reset_at),
        }

        if current_count > limit:
            headers["Retry-After"] = str(ttl)
            return structured_error_response(
                request,
                status_code=429,
                code="rate_limit_exceeded",
                message="Too many requests, please retry later",
                headers=headers,
                details=[
                    {
                        "scope": bucket,
                        "limit_per_minute": str(limit),
                    }
                ],
            )

        response = await call_next(request)
        for key_name, value in headers.items():
            response.headers[key_name] = value
        return response

    def _is_exempt_path(self, path: str) -> bool:
        return path.startswith("/health") or path in {
            "/docs",
            "/openapi.json",
            "/redoc",
        }

    def _client_identifier(self, request: Request) -> str:
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        if request.client and request.client.host:
            return request.client.host
        return "unknown"

    async def _increment(self, *, key: str, ttl_seconds: int) -> int:
        redis = await self._get_redis()
        if redis is not None:
            count = await redis.incr(key)
            if count == 1:
                await redis.expire(key, ttl_seconds)
            return int(count)

        now = int(time.time())
        async with self._lock:
            expired_keys = [k for k, exp in self._memory_expiry.items() if exp <= now]
            for expired_key in expired_keys:
                self._memory_expiry.pop(expired_key, None)
                self._memory_counts.pop(expired_key, None)

            self._memory_counts[key] = self._memory_counts.get(key, 0) + 1
            self._memory_expiry[key] = now + ttl_seconds
            return self._memory_counts[key]

    async def _get_redis(self) -> Redis | None:
        if self._redis is not None:
            return self._redis

        try:
            redis = Redis.from_url(settings.REDIS_URL, encoding="utf-8", decode_responses=True)
            await redis.ping()
            self._redis = redis
            return self._redis
        except Exception:
            self._redis = None
            return None
