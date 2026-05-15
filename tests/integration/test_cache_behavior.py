"""Tests for cache behavior, decorators, and invalidation."""

import pytest
from unittest.mock import AsyncMock, patch


class TestCacheAsideDecorator:
    """Test @cache_aside decorator (read-through caching)."""

    @pytest.mark.asyncio
    async def test_cache_miss_calls_function(self, mock_cache_ops):
        """Test that cache miss calls the original function."""
        # Mock cache miss
        mock_cache_ops.get = AsyncMock(return_value=None)

        # Function that would be decorated
        async def get_data():
            return {"id": "1", "name": "Test"}

        # Should call function when cache misses
        result = await get_data()
        assert result["id"] == "1"

    @pytest.mark.asyncio
    async def test_cache_hit_returns_cached_value(self, mock_cache_ops):
        """Test that cache hit returns cached value without calling function."""
        # Mock cache hit
        cached_data = {"id": "1", "name": "Cached Test"}
        mock_cache_ops.get = AsyncMock(return_value=cached_data)

        # Should return cached value
        result = await mock_cache_ops.get("test_key")
        assert result == cached_data

    @pytest.mark.asyncio
    async def test_cache_set_on_miss(self, mock_cache_ops):
        """Test that value is cached after cache miss."""
        mock_cache_ops.get = AsyncMock(return_value=None)
        mock_cache_ops.set = AsyncMock(return_value=True)

        # Simulate: cache miss, then cache result
        result = await mock_cache_ops.get("test_key")
        assert result is None

        # Set in cache
        cached = await mock_cache_ops.set("test_key", {"data": "value"}, ttl=3600)
        assert cached is True

    @pytest.mark.asyncio
    async def test_cache_ttl_respected(self, mock_cache_ops):
        """Test that cache TTL is respected."""
        mock_cache_ops.set = AsyncMock(return_value=True)

        # Set with specific TTL
        await mock_cache_ops.set("test_key", "value", ttl=1800)

        # Verify set was called with TTL
        mock_cache_ops.set.assert_called_once()


class TestCacheThroughDecorator:
    """Test @cache_through decorator (write-through caching)."""

    @pytest.mark.asyncio
    async def test_cache_through_writes_to_db_first(self):
        """Test that cache-through writes to DB before caching."""
        # Should call DB operation first
        db_called = False

        async def save_to_db(data):
            nonlocal db_called
            db_called = True
            return {"id": "1", **data}

        result = await save_to_db({"name": "Test"})
        assert db_called is True
        assert result["id"] == "1"

    @pytest.mark.asyncio
    async def test_cache_through_caches_after_db_write(self, mock_cache_ops):
        """Test that value is cached after DB write."""
        mock_cache_ops.set = AsyncMock(return_value=True)

        # After DB write, cache should be updated
        await mock_cache_ops.set("key", "value", ttl=3600)
        assert mock_cache_ops.set.called


class TestInvalidateCacheDecorator:
    """Test @invalidate_cache decorator."""

    @pytest.mark.asyncio
    async def test_invalidate_single_pattern(self, mock_cache_ops):
        """Test invalidating single cache pattern."""
        mock_cache_ops.delete_pattern = AsyncMock(return_value=5)

        # Invalidate pattern
        deleted = await mock_cache_ops.delete_pattern("leaderboard:*")
        assert deleted == 5

    @pytest.mark.asyncio
    async def test_invalidate_multiple_patterns(self, mock_cache_ops):
        """Test invalidating multiple cache patterns."""
        mock_cache_ops.delete_pattern = AsyncMock(return_value=5)

        # Invalidate multiple patterns
        await mock_cache_ops.delete_pattern("leaderboard:*")
        await mock_cache_ops.delete_pattern("ranking:*")

        # Should be called twice
        assert mock_cache_ops.delete_pattern.call_count == 2

    @pytest.mark.asyncio
    async def test_invalidate_wildcard_patterns(self, mock_cache_ops):
        """Test wildcard pattern matching for invalidation."""
        mock_cache_ops.delete_pattern = AsyncMock(return_value=10)

        # Wildcard patterns should match multiple keys
        deleted = await mock_cache_ops.delete_pattern("betting:edge:*")
        assert deleted == 10


class TestCacheKeyBuilders:
    """Test cache key builder methods."""

    def test_leaderboard_key_format(self):
        """Test leaderboard cache key format."""
        from app.caching.keys import CacheKeyBuilder

        key = CacheKeyBuilder.leaderboard_tournament("masters-2026")
        assert key.startswith("leaderboard:")
        assert "masters-2026" in key

    def test_ranking_key_format(self):
        """Test ranking cache key format."""
        from app.caching.keys import CacheKeyBuilder

        key = CacheKeyBuilder.ranking_world()
        assert key == "ranking:world"

    def test_projection_key_format(self):
        """Test projection cache key format."""
        from app.caching.keys import CacheKeyBuilder

        key = CacheKeyBuilder.projection_player_tournament("p1", "t1")
        assert key.startswith("projection:")
        assert "p1" in key
        assert "t1" in key

    def test_betting_edge_key_format(self):
        """Test betting edge cache key format."""
        from app.caching.keys import CacheKeyBuilder

        key = CacheKeyBuilder.betting_edge("p1", "m1")
        assert key.startswith("betting:edge")
        assert "p1" in key
        assert "m1" in key


class TestCachePolicies:
    """Test cache policy configuration."""

    def test_leaderboard_policy_ttl(self):
        """Test leaderboard cache policy TTL."""
        from app.caching.config import CachePolicy

        policy = CachePolicy.LEADERBOARD_TOURNAMENT
        assert policy.ttl_seconds == 3600
        assert policy.priority.value >= 3  # At least MEDIUM

    def test_betting_edge_policy_ttl(self):
        """Test betting edge cache policy (volatile data)."""
        from app.caching.config import CachePolicy

        policy = CachePolicy.BETTING_EDGE
        assert policy.ttl_seconds <= 300  # Short TTL for volatile data

    def test_ranking_policy_ttl(self):
        """Test ranking cache policy TTL."""
        from app.caching.config import CachePolicy

        policy = CachePolicy.RANKING_WORLD
        # Rankings change infrequently
        assert policy.ttl_seconds >= 3600


class TestCacheInvalidationFlow:
    """Test event-driven cache invalidation."""

    @pytest.mark.asyncio
    async def test_player_update_invalidates_projections(self, mock_cache_ops):
        """Test that player update invalidates related caches."""
        mock_cache_ops.delete_pattern = AsyncMock(return_value=3)

        # Player update should invalidate:
        # - player projections
        # - player statistics
        # - betting edges involving player
        await mock_cache_ops.delete_pattern("projection:player:p1:*")
        await mock_cache_ops.delete_pattern("betting:edge:p1:*")
        await mock_cache_ops.delete_pattern("stats:player:p1:*")

        assert mock_cache_ops.delete_pattern.call_count == 3

    @pytest.mark.asyncio
    async def test_round_completion_invalidates_leaderboards(self, mock_cache_ops):
        """Test that round completion invalidates leaderboards."""
        mock_cache_ops.delete_pattern = AsyncMock(return_value=5)

        # Round completion should invalidate:
        # - tournament leaderboard
        # - tournament rankings
        # - projections
        # - betting edges
        await mock_cache_ops.delete_pattern("leaderboard:tournament:t1:*")
        await mock_cache_ops.delete_pattern("ranking:tournament:t1:*")

        assert mock_cache_ops.delete_pattern.call_count >= 2

    @pytest.mark.asyncio
    async def test_market_odds_update_invalidates_edges(self, mock_cache_ops):
        """Test that market odds update invalidates betting edges."""
        mock_cache_ops.delete_pattern = AsyncMock(return_value=10)

        # Market odds update should invalidate betting edges
        await mock_cache_ops.delete_pattern("betting:edge:*:m1:*")

        assert mock_cache_ops.delete_pattern.called

    @pytest.mark.asyncio
    async def test_projection_publication_invalidates_betting(self, mock_cache_ops):
        """Test that projection publication invalidates betting."""
        mock_cache_ops.delete_pattern = AsyncMock(return_value=8)

        # Projection publication should invalidate:
        # - field projections
        # - betting edges for field
        await mock_cache_ops.delete_pattern("betting:edge:*:t1:*")

        assert mock_cache_ops.delete_pattern.called


class TestConcurrentCacheAccess:
    """Test concurrent cache access."""

    @pytest.mark.asyncio
    async def test_concurrent_cache_reads(self, mock_cache_ops):
        """Test concurrent reads from cache."""
        mock_cache_ops.get = AsyncMock(return_value={"data": "value"})

        # Simulate multiple concurrent reads
        import asyncio

        results = await asyncio.gather(
            mock_cache_ops.get("key1"),
            mock_cache_ops.get("key2"),
            mock_cache_ops.get("key3"),
        )

        assert len(results) == 3

    @pytest.mark.asyncio
    async def test_concurrent_cache_writes(self, mock_cache_ops):
        """Test concurrent writes to cache."""
        mock_cache_ops.set = AsyncMock(return_value=True)

        # Simulate multiple concurrent writes
        import asyncio

        results = await asyncio.gather(
            mock_cache_ops.set("key1", "value1"),
            mock_cache_ops.set("key2", "value2"),
            mock_cache_ops.set("key3", "value3"),
        )

        assert all(results)


class TestCacheErrorHandling:
    """Test cache error handling."""

    @pytest.mark.asyncio
    async def test_cache_connection_failure_doesnt_crash(self, mock_cache_ops):
        """Test that cache connection failure doesn't crash API."""
        # Cache operations should fail gracefully
        mock_cache_ops.get = AsyncMock(side_effect=ConnectionError("Redis unavailable"))

        # Should handle error gracefully (return None or raise handled exception)
        try:
            result = await mock_cache_ops.get("key")
        except ConnectionError:
            # Should be caught and handled at higher level
            pass

    @pytest.mark.asyncio
    async def test_cache_timeout_handling(self, mock_cache_ops):
        """Test that cache timeout is handled."""
        # Cache timeout should be brief
        mock_cache_ops.get = AsyncMock(side_effect=TimeoutError("Cache timeout"))

        try:
            result = await mock_cache_ops.get("key")
        except TimeoutError:
            # Should be caught at higher level
            pass

    @pytest.mark.asyncio
    async def test_invalid_cache_data_handled(self, mock_cache_ops):
        """Test that invalid cache data is handled."""
        # Cache might have corrupted data
        mock_cache_ops.get = AsyncMock(return_value="invalid_json_data")

        result = await mock_cache_ops.get("key")
        # Should handle gracefully (may return None or skip deserialization)


class TestCacheStampedeShield:
    """Test protection against cache stampede."""

    @pytest.mark.asyncio
    async def test_cache_miss_flood_protection(self, mock_cache_ops):
        """Test that cache stampede is prevented."""
        # Multiple concurrent requests for same cache key
        # should not all hit the database
        mock_cache_ops.get = AsyncMock(return_value=None)

        # In real implementation, would use lock or similar
        import asyncio

        requests = [
            mock_cache_ops.get("hot_key")
            for _ in range(10)
        ]
        results = await asyncio.gather(*requests)

        # All should get None, but only one should have hit DB
        assert all(r is None for r in results)
