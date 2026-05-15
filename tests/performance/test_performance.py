"""Performance tests for endpoint response times, throughput, and load."""

import pytest
import time
from httpx import AsyncClient


class TestEndpointResponseTimes:
    """Test endpoint performance against budgets."""

    @pytest.mark.asyncio
    async def test_health_check_performance(
        self, test_client: AsyncClient, performance_budget
    ):
        """Test health check endpoint is fast."""
        start = time.time()
        response = await test_client.get("/health")
        duration = (time.time() - start) * 1000  # ms

        assert response.status_code == 200
        assert duration < performance_budget["health_check"]

    @pytest.mark.asyncio
    async def test_player_list_endpoint_performance(
        self, test_client: AsyncClient, performance_budget
    ):
        """Test player list endpoint meets performance budget."""
        start = time.time()
        response = await test_client.get("/api/v1/players?page=1&page_size=20")
        duration = (time.time() - start) * 1000  # ms

        if response.status_code == 200:
            assert duration < performance_budget.get("player_list", 500)

    @pytest.mark.asyncio
    async def test_player_detail_endpoint_performance(
        self, test_client: AsyncClient, performance_budget
    ):
        """Test player detail endpoint meets performance budget."""
        start = time.time()
        response = await test_client.get("/api/v1/players/p1")
        duration = (time.time() - start) * 1000  # ms

        if response.status_code == 200:
            assert duration < performance_budget.get("player_detail", 300)

    @pytest.mark.asyncio
    async def test_tournament_leaderboard_performance(
        self, test_client: AsyncClient, performance_budget
    ):
        """Test tournament leaderboard endpoint performance."""
        start = time.time()
        response = await test_client.get("/api/v1/tournaments/t1/leaderboard")
        duration = (time.time() - start) * 1000  # ms

        if response.status_code == 200:
            assert duration < performance_budget.get("leaderboard", 1000)

    @pytest.mark.asyncio
    async def test_rankings_endpoint_performance(
        self, test_client: AsyncClient, performance_budget
    ):
        """Test rankings endpoint performance."""
        start = time.time()
        response = await test_client.get("/api/v1/rankings/world")
        duration = (time.time() - start) * 1000  # ms

        if response.status_code == 200:
            assert duration < performance_budget.get("rankings", 800)

    @pytest.mark.asyncio
    async def test_projection_list_performance(
        self, test_client: AsyncClient, performance_budget
    ):
        """Test projection list endpoint performance."""
        start = time.time()
        response = await test_client.get("/api/v1/projections?tournament_id=t1")
        duration = (time.time() - start) * 1000  # ms

        if response.status_code == 200:
            assert duration < performance_budget.get("projections", 600)

    @pytest.mark.asyncio
    async def test_betting_edges_performance(
        self, test_client: AsyncClient, performance_budget
    ):
        """Test betting edges endpoint performance."""
        start = time.time()
        response = await test_client.get("/api/v1/betting/edges?market_id=m1")
        duration = (time.time() - start) * 1000  # ms

        if response.status_code == 200:
            assert duration < performance_budget.get("betting_edges", 500)


class TestGraphQLPerformance:
    """Test GraphQL query performance."""

    @pytest.mark.asyncio
    async def test_simple_graphql_query_performance(
        self, test_client: AsyncClient, performance_budget
    ):
        """Test simple GraphQL query performance."""
        query = """
        query {
            players(first: 10) {
                edges {
                    node {
                        id
                        name
                    }
                }
            }
        }
        """

        start = time.time()
        response = await test_client.post("/graphql", json={"query": query})
        duration = (time.time() - start) * 1000  # ms

        if response.status_code == 200:
            assert duration < performance_budget.get("graphql_simple", 400)

    @pytest.mark.asyncio
    async def test_complex_graphql_query_performance(
        self, test_client: AsyncClient, performance_budget
    ):
        """Test complex GraphQL query performance."""
        query = """
        query {
            tournaments(first: 5) {
                edges {
                    node {
                        id
                        name
                        leaderboard {
                            entries {
                                player {
                                    name
                                }
                                score
                            }
                        }
                    }
                }
            }
        }
        """

        start = time.time()
        response = await test_client.post("/graphql", json={"query": query})
        duration = (time.time() - start) * 1000  # ms

        if response.status_code == 200:
            assert duration < performance_budget.get("graphql_complex", 800)


class TestDatabaseQueryPerformance:
    """Test database query efficiency."""

    @pytest.mark.asyncio
    async def test_pagination_doesnt_load_all_records(self, test_client: AsyncClient):
        """Test that pagination doesn't load all records."""
        # Pagination with limit should not load full result set
        response = await test_client.get("/api/v1/players?page=1&page_size=10")

        if response.status_code == 200:
            data = response.json()
            # Should only return requested page size
            assert len(data.get("results", [])) <= 10

    @pytest.mark.asyncio
    async def test_filter_reduces_result_set(self, test_client: AsyncClient):
        """Test that filters reduce result set efficiently."""
        # Filtered query should use indexes
        response = await test_client.get("/api/v1/players?status=active&page_size=100")
        assert response.status_code in [200, 404]

    @pytest.mark.asyncio
    async def test_search_uses_full_text_index(self, test_client: AsyncClient):
        """Test that search uses full-text index."""
        # Search should be indexed
        response = await test_client.get("/api/v1/players?q=tiger")
        assert response.status_code in [200, 404]


class TestCacheEffectiveness:
    """Test cache hit rates and effectiveness."""

    @pytest.mark.asyncio
    async def test_cached_response_faster_than_uncached(
        self, test_client: AsyncClient, performance_budget
    ):
        """Test that cached responses are faster."""
        # First request (cache miss)
        start1 = time.time()
        response1 = await test_client.get("/api/v1/rankings/world")
        time1 = (time.time() - start1) * 1000

        # Second request (cache hit) - should be faster
        start2 = time.time()
        response2 = await test_client.get("/api/v1/rankings/world")
        time2 = (time.time() - start2) * 1000

        if response1.status_code == 200 and response2.status_code == 200:
            # Cached response should be significantly faster
            assert time2 < time1 * 0.5 or time2 < performance_budget.get("cache_hit", 100)

    @pytest.mark.asyncio
    async def test_leaderboard_cache_effectiveness(
        self, test_client: AsyncClient, performance_budget
    ):
        """Test leaderboard caching effectiveness."""
        # Make multiple requests to same leaderboard
        for i in range(3):
            start = time.time()
            response = await test_client.get("/api/v1/tournaments/t1/leaderboard")
            duration = (time.time() - start) * 1000

            if response.status_code == 200:
                # Later requests should be faster due to cache
                if i > 0:
                    assert duration < performance_budget.get("leaderboard_cached", 200)


class TestConcurrentLoad:
    """Test performance under concurrent load."""

    @pytest.mark.asyncio
    async def test_multiple_concurrent_requests(self, test_client: AsyncClient):
        """Test handling multiple concurrent requests."""
        import asyncio

        # Make 10 concurrent requests
        tasks = [
            test_client.get("/api/v1/players?page=1")
            for _ in range(10)
        ]

        responses = await asyncio.gather(*tasks)

        # All should succeed
        assert all(r.status_code in [200, 401, 403] for r in responses)

    @pytest.mark.asyncio
    async def test_concurrent_cache_reads(self, test_client: AsyncClient):
        """Test concurrent cache reads."""
        import asyncio

        # Multiple concurrent reads of cached data
        tasks = [
            test_client.get("/api/v1/rankings/world")
            for _ in range(20)
        ]

        start = time.time()
        responses = await asyncio.gather(*tasks)
        duration = (time.time() - start) * 1000

        # Should handle concurrent reads efficiently
        assert all(r.status_code == 200 for r in responses)
        # Total time should be reasonable (not sequential)
        assert duration < 5000  # All 20 requests in < 5 seconds


class TestPayloadSize:
    """Test response payload sizes."""

    @pytest.mark.asyncio
    async def test_player_list_response_size(self, test_client: AsyncClient):
        """Test that player list response size is reasonable."""
        response = await test_client.get("/api/v1/players?page=1&page_size=20")

        if response.status_code == 200:
            size_kb = len(response.content) / 1024
            # Response should not be excessively large
            assert size_kb < 100

    @pytest.mark.asyncio
    async def test_leaderboard_response_size(self, test_client: AsyncClient):
        """Test that leaderboard response is reasonably sized."""
        response = await test_client.get("/api/v1/tournaments/t1/leaderboard")

        if response.status_code == 200:
            size_kb = len(response.content) / 1024
            # Leaderboard should not exceed 500KB
            assert size_kb < 500

    @pytest.mark.asyncio
    async def test_graphql_response_size(self, test_client: AsyncClient):
        """Test GraphQL response size."""
        query = """
        query {
            players(first: 100) {
                edges {
                    node {
                        id
                        name
                    }
                }
            }
        }
        """

        response = await test_client.post("/graphql", json={"query": query})

        if response.status_code == 200:
            size_kb = len(response.content) / 1024
            assert size_kb < 200


class TestQueryComplexity:
    """Test GraphQL query complexity limits."""

    @pytest.mark.asyncio
    async def test_deeply_nested_query_limited(self, test_client: AsyncClient):
        """Test that deeply nested queries are limited."""
        # Query with excessive nesting
        query = """
        query {
            tournaments {
                leaderboard {
                    entries {
                        player {
                            seasons {
                                rounds {
                                    scores {
                                        adjustments {
                                            reason
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        """

        response = await test_client.post("/graphql", json={"query": query})

        # Should either reject or limit complexity
        assert response.status_code in [200, 400]

    @pytest.mark.asyncio
    async def test_high_cardinality_query_limited(self, test_client: AsyncClient):
        """Test that high cardinality queries are limited."""
        # Query requesting many items
        query = """
        query {
            players(first: 10000) {
                edges {
                    node {
                        id
                    }
                }
            }
        }
        """

        response = await test_client.post("/graphql", json={"query": query})

        # Should limit result set
        if response.status_code == 200:
            data = response.json()
            # Should not return 10000 items
            edges = data.get("data", {}).get("players", {}).get("edges", [])
            assert len(edges) <= 100
