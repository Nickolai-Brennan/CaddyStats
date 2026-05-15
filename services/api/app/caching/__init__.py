"""Caching package initialization and exports."""

from app.caching.client import CacheOps, RedisClient
from app.caching.config import CachePolicy, CachePriority
from app.caching.decorators import (
    cache_aside,
    cache_through,
    cache_with_ttl,
    conditional_cache,
    invalidate_cache,
    invalidate_on_error,
)
from app.caching.invalidation import CacheInvalidationFlow, InvalidationEvent
from app.caching.keys import CacheKeyBuilder

__all__ = [
    # Client
    "RedisClient",
    "CacheOps",
    # Configuration
    "CachePolicy",
    "CachePriority",
    # Decorators
    "cache_aside",
    "cache_through",
    "cache_with_ttl",
    "conditional_cache",
    "invalidate_cache",
    "invalidate_on_error",
    # Keys
    "CacheKeyBuilder",
    # Invalidation
    "CacheInvalidationFlow",
    "InvalidationEvent",
]
