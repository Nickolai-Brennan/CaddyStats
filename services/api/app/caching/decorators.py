"""Cache decorators — Reusable caching patterns for services and endpoints."""

from __future__ import annotations

import functools
import inspect
from typing import Any, Awaitable, Callable, TypeVar, cast

import structlog

from app.caching.client import CacheOps
from app.caching.config import CachePolicy

logger = structlog.get_logger(__name__)

F = TypeVar("F", bound=Callable[..., Awaitable[Any]])


def cache_aside(
    key_func: Callable[..., str] | str,
    ttl_seconds: int | None = None,
    policy_name: str | None = None,
) -> Callable[[F], F]:
    """
    Cache-aside (lazy-loading) decorator.

    Attempts to fetch from cache first; if miss, calls function and caches result.
    Ideal for read-heavy endpoints.

    Args:
        key_func: Function to generate cache key from function args, or static string.
        ttl_seconds: Override TTL in seconds. If None, uses policy_name or default.
        policy_name: Cache policy name (e.g., "LEADERBOARD_TOURNAMENT") to determine TTL.

    Example:
        @cache_aside(lambda tournament_slug: f"leaderboard:{tournament_slug}", ttl_seconds=3600)
        async def get_tournament_leaderboard(tournament_slug: str):
            return await db.query(...)
    """

    def decorator(func: F) -> F:
        @functools.wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> Any:
            # Generate cache key
            if callable(key_func):
                cache_key = key_func(*args, **kwargs)
            else:
                cache_key = key_func

            # Determine TTL
            ttl = ttl_seconds
            if ttl is None and policy_name:
                policy = getattr(CachePolicy, policy_name, None)
                if policy:
                    ttl = policy.ttl_seconds

            # Try cache hit
            try:
                cached = await CacheOps.get(cache_key)
                if cached is not None:
                    logger.debug("cache_hit", key=cache_key, func=func.__name__)
                    return cached
            except Exception as e:
                logger.warning("cache_get_error", key=cache_key, error=str(e))

            # Cache miss — call function
            result = await func(*args, **kwargs)

            # Cache result
            try:
                if ttl:
                    await CacheOps.set(cache_key, result, ttl_seconds=ttl)
                else:
                    await CacheOps.set(cache_key, result)
                logger.debug("cache_set", key=cache_key, func=func.__name__)
            except Exception as e:
                logger.warning("cache_set_error", key=cache_key, error=str(e))

            return result

        return cast(F, wrapper)

    return decorator


def cache_through(
    key_func: Callable[..., str] | str,
    ttl_seconds: int | None = None,
    policy_name: str | None = None,
) -> Callable[[F], F]:
    """
    Write-through cache decorator.

    Writes to cache before/after calling function. Useful for mutations.

    Args:
        key_func: Function to generate cache key from function args, or static string.
        ttl_seconds: Override TTL in seconds. If None, uses policy_name or default.
        policy_name: Cache policy name to determine TTL.

    Example:
        @cache_through(lambda article_id: f"article:{article_id}", ttl_seconds=7200)
        async def update_article(article_id: str, data: dict):
            return await db.update(Article, article_id, data)
    """

    def decorator(func: F) -> F:
        @functools.wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> Any:
            # Generate cache key
            if callable(key_func):
                cache_key = key_func(*args, **kwargs)
            else:
                cache_key = key_func

            # Determine TTL
            ttl = ttl_seconds
            if ttl is None and policy_name:
                policy = getattr(CachePolicy, policy_name, None)
                if policy:
                    ttl = policy.ttl_seconds

            # Call function (write to DB)
            result = await func(*args, **kwargs)

            # Write to cache (after DB success)
            try:
                if ttl:
                    await CacheOps.set(cache_key, result, ttl_seconds=ttl)
                else:
                    await CacheOps.set(cache_key, result)
                logger.debug("cache_through_set", key=cache_key, func=func.__name__)
            except Exception as e:
                logger.warning("cache_through_error", key=cache_key, error=str(e))

            return result

        return cast(F, wrapper)

    return decorator


def invalidate_cache(*key_patterns: str) -> Callable[[F], F]:
    """
    Cache invalidation decorator.

    Deletes specified cache keys after function execution (e.g., after mutations).

    Args:
        key_patterns: Cache key patterns to invalidate (supports wildcards).

    Example:
        @invalidate_cache("leaderboard:*", "ranking:world")
        async def update_tournament_results(tournament_id: str):
            await db.update(...)
    """

    def decorator(func: F) -> F:
        @functools.wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> Any:
            # Call function first
            result = await func(*args, **kwargs)

            # Invalidate caches
            for pattern in key_patterns:
                try:
                    count = await CacheOps.delete_pattern(pattern)
                    logger.debug(
                        "cache_invalidated",
                        pattern=pattern,
                        count=count,
                        func=func.__name__,
                    )
                except Exception as e:
                    logger.warning("cache_invalidation_error", pattern=pattern, error=str(e))

            return result

        return cast(F, wrapper)

    return decorator


def invalidate_on_error(
    *key_patterns: str,
) -> Callable[[F], F]:
    """
    Cache invalidation on error decorator.

    Deletes specified cache keys if function raises an exception.
    Useful for cache consistency when operations fail.

    Args:
        key_patterns: Cache key patterns to invalidate.
    """

    def decorator(func: F) -> F:
        @functools.wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> Any:
            try:
                return await func(*args, **kwargs)
            except Exception as e:
                # Invalidate on error to maintain consistency
                for pattern in key_patterns:
                    try:
                        count = await CacheOps.delete_pattern(pattern)
                        logger.warning(
                            "cache_invalidated_on_error",
                            pattern=pattern,
                            count=count,
                            func=func.__name__,
                            error=str(e),
                        )
                    except Exception as ie:
                        logger.error("cache_invalidation_error", pattern=pattern, error=str(ie))

                raise

        return cast(F, wrapper)

    return decorator


def cache_with_ttl(ttl_seconds: int) -> Callable[[F], F]:
    """
    Simple cache decorator with fixed TTL and auto-key generation.

    Generates cache key from function name and arguments.

    Args:
        ttl_seconds: Cache TTL in seconds.

    Example:
        @cache_with_ttl(3600)
        async def expensive_calculation(param_a: str, param_b: int):
            return await compute(param_a, param_b)
    """

    def decorator(func: F) -> F:
        @functools.wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> Any:
            # Generate key from function name and args
            args_str = ":".join([str(a) for a in args if not inspect.isclass(type(a))])
            kwargs_str = ":".join([f"{k}={v}" for k, v in sorted(kwargs.items())])
            cache_key = f"auto:{func.__module__}:{func.__name__}:{args_str}:{kwargs_str}"

            # Try cache
            try:
                cached = await CacheOps.get(cache_key)
                if cached is not None:
                    logger.debug("cache_hit_auto", func=func.__name__)
                    return cached
            except Exception as e:
                logger.warning("cache_get_error", key=cache_key, error=str(e))

            # Cache miss
            result = await func(*args, **kwargs)

            # Set cache
            try:
                await CacheOps.set(cache_key, result, ttl_seconds=ttl_seconds)
            except Exception as e:
                logger.warning("cache_set_error", error=str(e))

            return result

        return cast(F, wrapper)

    return decorator


def conditional_cache(
    key_func: Callable[..., str],
    should_cache: Callable[..., bool],
    ttl_seconds: int | None = None,
) -> Callable[[F], F]:
    """
    Conditional cache decorator.

    Only caches result if should_cache() returns True.
    Useful for selective caching based on result or request context.

    Args:
        key_func: Function to generate cache key.
        should_cache: Function to determine if result should be cached.
        ttl_seconds: Cache TTL.

    Example:
        def should_cache_result(result):
            return result is not None and len(result) > 0

        @conditional_cache(
            key_func=lambda q, page: f"search:{q}:p{page}",
            should_cache=should_cache_result,
            ttl_seconds=600
        )
        async def search_players(q: str, page: int):
            return await db.search(...)
    """

    def decorator(func: F) -> F:
        @functools.wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> Any:
            # Generate key
            cache_key = key_func(*args, **kwargs)

            # Try cache
            try:
                cached = await CacheOps.get(cache_key)
                if cached is not None:
                    logger.debug("cache_hit_conditional", key=cache_key)
                    return cached
            except Exception as e:
                logger.warning("cache_get_error", key=cache_key, error=str(e))

            # Call function
            result = await func(*args, **kwargs)

            # Conditionally cache
            if should_cache(result):
                try:
                    await CacheOps.set(cache_key, result, ttl_seconds=ttl_seconds)
                    logger.debug("cache_set_conditional", key=cache_key)
                except Exception as e:
                    logger.warning("cache_set_error", error=str(e))

            return result

        return cast(F, wrapper)

    return decorator
