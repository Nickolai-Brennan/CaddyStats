"""Redis client management — connection pooling, lifecycle, and utilities."""

from __future__ import annotations

import json
from typing import Any, Generic, TypeVar

import redis.asyncio as redis
import structlog
from redis.asyncio.connection import ConnectionPool

logger = structlog.get_logger(__name__)

T = TypeVar("T")


class RedisClient:
    """Async Redis client with connection pooling and graceful lifecycle management."""

    _pool: ConnectionPool | None = None
    _client: redis.Redis[bytes] | None = None

    @classmethod
    async def connect(cls, url: str) -> redis.Redis[bytes]:
        """Initialize Redis connection pool and client."""
        if cls._client is not None:
            return cls._client

        try:
            cls._pool = ConnectionPool.from_url(
                url,
                encoding="utf-8",
                decode_responses=False,
                max_connections=20,
            )
            cls._client = redis.Redis(connection_pool=cls._pool)

            # Test connection
            await cls._client.ping()
            logger.info("Redis connection established")

            return cls._client
        except Exception as e:
            logger.error("Failed to connect to Redis", error=str(e))
            raise

    @classmethod
    async def disconnect(cls) -> None:
        """Close Redis connection pool."""
        if cls._client is not None:
            await cls._client.close()
            cls._client = None

        if cls._pool is not None:
            await cls._pool.disconnect()
            cls._pool = None

        logger.info("Redis connection closed")

    @classmethod
    def get(cls) -> redis.Redis[bytes]:
        """Get active Redis client instance."""
        if cls._client is None:
            raise RuntimeError("Redis client not initialized. Call RedisClient.connect() first.")
        return cls._client


class CacheOps:
    """High-level cache operations."""

    @staticmethod
    async def get(key: str) -> Any:
        """Get value from cache, deserialize if JSON."""
        client = RedisClient.get()
        value = await client.get(key)
        if value is None:
            return None

        try:
            return json.loads(value.decode("utf-8"))
        except (json.JSONDecodeError, UnicodeDecodeError):
            return value.decode("utf-8")

    @staticmethod
    async def get_bytes(key: str) -> bytes | None:
        """Get raw bytes from cache."""
        client = RedisClient.get()
        return await client.get(key)

    @staticmethod
    async def set(
        key: str,
        value: Any,
        ttl_seconds: int | None = None,
        serialize: bool = True,
    ) -> None:
        """Set value in cache with optional TTL."""
        client = RedisClient.get()

        if serialize:
            encoded = json.dumps(value).encode("utf-8")
        else:
            encoded = value if isinstance(value, bytes) else str(value).encode("utf-8")

        if ttl_seconds:
            await client.setex(key, ttl_seconds, encoded)
        else:
            await client.set(key, encoded)

    @staticmethod
    async def delete(*keys: str) -> int:
        """Delete one or more keys. Returns number of keys deleted."""
        if not keys:
            return 0

        client = RedisClient.get()
        return await client.delete(*keys)

    @staticmethod
    async def delete_pattern(pattern: str) -> int:
        """Delete all keys matching pattern (uses SCAN for efficiency)."""
        client = RedisClient.get()
        count = 0
        async for key in client.scan_iter(match=pattern):
            await client.delete(key)
            count += 1
        return count

    @staticmethod
    async def exists(*keys: str) -> int:
        """Check how many keys exist. Returns count."""
        if not keys:
            return 0

        client = RedisClient.get()
        return await client.exists(*keys)

    @staticmethod
    async def clear() -> None:
        """Flush all keys in current database."""
        client = RedisClient.get()
        await client.flushdb()
        logger.info("Cache cleared")

    @staticmethod
    async def ttl(key: str) -> int:
        """Get TTL for key in seconds. Returns -1 if key has no TTL, -2 if key doesn't exist."""
        client = RedisClient.get()
        return await client.ttl(key)

    @staticmethod
    async def expire(key: str, ttl_seconds: int) -> bool:
        """Set or update TTL for key. Returns True if key exists and TTL was set."""
        client = RedisClient.get()
        return await client.expire(key, ttl_seconds)

    @staticmethod
    async def incr(key: str, amount: int = 1) -> int:
        """Atomically increment counter."""
        client = RedisClient.get()
        return await client.incrby(key, amount)

    @staticmethod
    async def decr(key: str, amount: int = 1) -> int:
        """Atomically decrement counter."""
        client = RedisClient.get()
        return await client.decrby(key, amount)

    @staticmethod
    async def hset(key: str, mapping: dict[str, Any]) -> int:
        """Set hash fields. Returns number of fields added."""
        client = RedisClient.get()
        encoded_mapping = {
            k: json.dumps(v) if not isinstance(v, (str, bytes)) else v
            for k, v in mapping.items()
        }
        return await client.hset(key, mapping=encoded_mapping)

    @staticmethod
    async def hget(key: str, field: str) -> Any:
        """Get hash field value."""
        client = RedisClient.get()
        value = await client.hget(key, field)
        if value is None:
            return None

        try:
            return json.loads(value.decode("utf-8"))
        except (json.JSONDecodeError, UnicodeDecodeError):
            return value.decode("utf-8")

    @staticmethod
    async def hgetall(key: str) -> dict[str, Any]:
        """Get all hash fields."""
        client = RedisClient.get()
        raw = await client.hgetall(key)
        result = {}
        for k, v in raw.items():
            try:
                result[k.decode("utf-8")] = json.loads(v.decode("utf-8"))
            except (json.JSONDecodeError, UnicodeDecodeError):
                result[k.decode("utf-8")] = v.decode("utf-8")
        return result

    @staticmethod
    async def lpush(key: str, *values: Any) -> int:
        """Push values to list (left side). Returns list length."""
        client = RedisClient.get()
        encoded = [json.dumps(v) if not isinstance(v, (str, bytes)) else v for v in values]
        return await client.lpush(key, *encoded)

    @staticmethod
    async def lrange(key: str, start: int = 0, stop: int = -1) -> list[Any]:
        """Get range of list items."""
        client = RedisClient.get()
        items = await client.lrange(key, start, stop)
        result = []
        for item in items:
            try:
                result.append(json.loads(item.decode("utf-8")))
            except (json.JSONDecodeError, UnicodeDecodeError):
                result.append(item.decode("utf-8"))
        return result

    @staticmethod
    async def sadd(key: str, *members: Any) -> int:
        """Add members to set. Returns number of members added."""
        client = RedisClient.get()
        encoded = [json.dumps(m) if not isinstance(m, (str, bytes)) else m for m in members]
        return await client.sadd(key, *encoded)

    @staticmethod
    async def smembers(key: str) -> set[Any]:
        """Get all set members."""
        client = RedisClient.get()
        raw = await client.smembers(key)
        result = set()
        for member in raw:
            try:
                result.add(json.loads(member.decode("utf-8")))
            except (json.JSONDecodeError, UnicodeDecodeError):
                result.add(member.decode("utf-8"))
        return result

    @staticmethod
    async def sismember(key: str, member: Any) -> bool:
        """Check if member exists in set."""
        client = RedisClient.get()
        encoded = json.dumps(member) if not isinstance(member, (str, bytes)) else member
        return await client.sismember(key, encoded)

    @staticmethod
    async def mget(*keys: str) -> list[Any]:
        """Get multiple keys."""
        if not keys:
            return []

        client = RedisClient.get()
        values = await client.mget(*keys)
        result = []
        for value in values:
            if value is None:
                result.append(None)
            else:
                try:
                    result.append(json.loads(value.decode("utf-8")))
                except (json.JSONDecodeError, UnicodeDecodeError):
                    result.append(value.decode("utf-8"))
        return result

    @staticmethod
    async def mset(mapping: dict[str, Any]) -> None:
        """Set multiple key-value pairs."""
        if not mapping:
            return

        client = RedisClient.get()
        encoded_mapping = {
            k: json.dumps(v) if not isinstance(v, (str, bytes)) else v
            for k, v in mapping.items()
        }
        await client.mset(encoded_mapping)
