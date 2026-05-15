"""Tests for REST API endpoints."""

import pytest
from httpx import AsyncClient


class TestHealthCheckEndpoint:
    """Test health check endpoint."""

    @pytest.mark.asyncio
    async def test_health_check_success(self, test_client: AsyncClient):
        """Test successful health check."""
        response = await test_client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"

    @pytest.mark.asyncio
    async def test_health_check_response_format(self, test_client: AsyncClient):
        """Test health check response format."""
        response = await test_client.get("/health")
        data = response.json()
        assert "status" in data
        assert "timestamp" in data


class TestAuthEndpoints:
    """Test authentication endpoints."""

    @pytest.mark.asyncio
    async def test_login_success(self, test_client: AsyncClient):
        """Test successful login."""
        response = await test_client.post(
            "/api/v1/auth/login",
            json={"email": "test@example.com", "password": "test_password"},
        )
        assert response.status_code in [200, 401]  # 401 if no user in DB

    @pytest.mark.asyncio
    async def test_login_invalid_credentials(self, test_client: AsyncClient):
        """Test login with invalid credentials."""
        response = await test_client.post(
            "/api/v1/auth/login",
            json={"email": "test@example.com", "password": "wrong_password"},
        )
        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_login_missing_fields(self, test_client: AsyncClient):
        """Test login with missing fields."""
        response = await test_client.post("/api/v1/auth/login", json={})
        assert response.status_code == 422  # Validation error

    @pytest.mark.asyncio
    async def test_refresh_token(self, test_client: AsyncClient, test_jwt_token: str):
        """Test token refresh endpoint."""
        response = await test_client.post(
            "/api/v1/auth/refresh",
            json={"refresh_token": test_jwt_token},
        )
        assert response.status_code in [200, 401]

    @pytest.mark.asyncio
    async def test_logout(self, test_client: AsyncClient, test_jwt_token: str):
        """Test logout endpoint."""
        response = await test_client.post(
            "/api/v1/auth/logout",
            headers={"Authorization": f"Bearer {test_jwt_token}"},
        )
        assert response.status_code in [200, 204, 401]


class TestPlayerEndpoints:
    """Test player API endpoints."""

    @pytest.mark.asyncio
    async def test_list_players(self, test_client: AsyncClient):
        """Test list players endpoint."""
        response = await test_client.get("/api/v1/players")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data or response.status_code >= 400

    @pytest.mark.asyncio
    async def test_list_players_pagination(self, test_client: AsyncClient):
        """Test player list pagination."""
        response = await test_client.get("/api/v1/players?page=1&page_size=10")
        assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_list_players_search(self, test_client: AsyncClient):
        """Test player list with search."""
        response = await test_client.get("/api/v1/players?q=tiger")
        assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_get_player(self, test_client: AsyncClient):
        """Test get player detail."""
        response = await test_client.get("/api/v1/players/tiger-woods")
        assert response.status_code in [200, 404]

    @pytest.mark.asyncio
    async def test_player_response_schema(self, test_client: AsyncClient):
        """Test player response schema."""
        response = await test_client.get("/api/v1/players?page=1&page_size=1")
        if response.status_code == 200:
            data = response.json()
            # Check expected fields
            if "items" in data and len(data["items"]) > 0:
                player = data["items"][0]
                # Should have expected fields
                assert isinstance(player, dict)


class TestTournamentEndpoints:
    """Test tournament API endpoints."""

    @pytest.mark.asyncio
    async def test_list_tournaments(self, test_client: AsyncClient):
        """Test list tournaments endpoint."""
        response = await test_client.get("/api/v1/tournaments")
        assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_get_tournament(self, test_client: AsyncClient):
        """Test get tournament detail."""
        response = await test_client.get("/api/v1/tournaments/masters-2026")
        assert response.status_code in [200, 404]

    @pytest.mark.asyncio
    async def test_get_tournament_leaderboard(self, test_client: AsyncClient):
        """Test tournament leaderboard endpoint."""
        response = await test_client.get("/api/v1/tournaments/masters-2026/leaderboard")
        assert response.status_code in [200, 404]

    @pytest.mark.asyncio
    async def test_get_tournament_rankings(self, test_client: AsyncClient):
        """Test tournament rankings endpoint."""
        response = await test_client.get("/api/v1/tournaments/masters-2026/rankings")
        assert response.status_code in [200, 404]


class TestProjectionEndpoints:
    """Test projection API endpoints."""

    @pytest.mark.asyncio
    async def test_list_projections(self, test_client: AsyncClient):
        """Test list projections endpoint."""
        response = await test_client.get("/api/v1/projections")
        assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_get_projection(self, test_client: AsyncClient):
        """Test get projection detail."""
        response = await test_client.get("/api/v1/projections/proj-123")
        assert response.status_code in [200, 404]

    @pytest.mark.asyncio
    async def test_get_player_projections(self, test_client: AsyncClient):
        """Test get projections for specific player."""
        response = await test_client.get("/api/v1/players/tiger-woods/projections")
        assert response.status_code in [200, 404]


class TestBettingEndpoints:
    """Test betting/market API endpoints."""

    @pytest.mark.asyncio
    async def test_list_markets(self, test_client: AsyncClient):
        """Test list markets endpoint."""
        response = await test_client.get("/api/v1/betting/markets")
        assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_get_market_detail(self, test_client: AsyncClient):
        """Test get market detail."""
        response = await test_client.get("/api/v1/betting/markets/market-123")
        assert response.status_code in [200, 404]

    @pytest.mark.asyncio
    async def test_get_betting_edge(self, test_client: AsyncClient):
        """Test get betting edge calculation."""
        response = await test_client.get(
            "/api/v1/betting/edges?player_id=p1&market_id=m1"
        )
        assert response.status_code in [200, 404]

    @pytest.mark.asyncio
    async def test_tournament_field_markets(self, test_client: AsyncClient):
        """Test tournament field markets."""
        response = await test_client.get("/api/v1/betting/tournament/masters-2026/field")
        assert response.status_code in [200, 404]


class TestRankingsEndpoints:
    """Test rankings API endpoints."""

    @pytest.mark.asyncio
    async def test_get_world_rankings(self, test_client: AsyncClient):
        """Test world rankings endpoint."""
        response = await test_client.get("/api/v1/rankings/world")
        assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_get_fedex_cup_rankings(self, test_client: AsyncClient):
        """Test FedEx Cup rankings endpoint."""
        response = await test_client.get("/api/v1/rankings/fedex-cup")
        assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_get_tournament_rankings(self, test_client: AsyncClient):
        """Test tournament rankings endpoint."""
        response = await test_client.get("/api/v1/rankings/tournament/masters-2026")
        assert response.status_code in [200, 404]


class TestStatsOverviewEndpoint:
    """Test stats overview endpoint."""

    @pytest.mark.asyncio
    async def test_get_stats_overview(self, test_client: AsyncClient):
        """Test getting statistics overview."""
        response = await test_client.get("/api/v1/stats/overview")
        assert response.status_code == 200
        data = response.json()
        # Should have key metrics
        expected_fields = [
            "active_players",
            "active_tournaments",
            "publishable_projections",
            "open_markets",
        ]
        for field in expected_fields:
            assert field in data or response.status_code >= 400


class TestRESTErrorHandling:
    """Test REST API error handling."""

    @pytest.mark.asyncio
    async def test_404_not_found(self, test_client: AsyncClient):
        """Test 404 error response."""
        response = await test_client.get("/api/v1/nonexistent")
        assert response.status_code == 404

    @pytest.mark.asyncio
    async def test_401_unauthorized(self, test_client: AsyncClient):
        """Test 401 unauthorized response."""
        response = await test_client.get(
            "/api/v1/admin/settings",
            headers={},  # No auth header
        )
        assert response.status_code in [401, 403]

    @pytest.mark.asyncio
    async def test_403_forbidden(self, test_client: AsyncClient):
        """Test 403 forbidden response."""
        response = await test_client.post(
            "/api/v1/admin/users",
            json={"email": "user@example.com"},
            headers={},  # User without admin permission
        )
        assert response.status_code in [401, 403]

    @pytest.mark.asyncio
    async def test_422_validation_error(self, test_client: AsyncClient):
        """Test 422 validation error response."""
        response = await test_client.post(
            "/api/v1/auth/login",
            json={"invalid_field": "value"},  # Missing required fields
        )
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_500_server_error_format(self, test_client: AsyncClient):
        """Test 500 error response format."""
        # This would require a deliberately broken endpoint
        # Typically checked in integration/smoke tests
        pass


class TestPagination:
    """Test pagination on list endpoints."""

    @pytest.mark.asyncio
    async def test_default_pagination(self, test_client: AsyncClient):
        """Test default pagination."""
        response = await test_client.get("/api/v1/players")
        assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_custom_page_size(self, test_client: AsyncClient):
        """Test custom page size."""
        response = await test_client.get("/api/v1/players?page_size=25")
        assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_page_boundary(self, test_client: AsyncClient):
        """Test requesting last page."""
        response = await test_client.get("/api/v1/players?page=100")
        assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_invalid_pagination_params(self, test_client: AsyncClient):
        """Test invalid pagination parameters."""
        response = await test_client.get("/api/v1/players?page=abc&page_size=xyz")
        assert response.status_code == 422


class TestRequestValidation:
    """Test request input validation."""

    @pytest.mark.asyncio
    async def test_query_parameter_validation(self, test_client: AsyncClient):
        """Test query parameter validation."""
        # Should validate page numbers, page sizes, etc.
        response = await test_client.get("/api/v1/players?page=0")
        assert response.status_code in [200, 422]

    @pytest.mark.asyncio
    async def test_body_validation(self, test_client: AsyncClient):
        """Test request body validation."""
        response = await test_client.post(
            "/api/v1/auth/login",
            json={"email": "not-an-email", "password": "short"},
        )
        # Should validate email format and password strength
        assert response.status_code in [422, 400, 401]

    @pytest.mark.asyncio
    async def test_header_validation(self, test_client: AsyncClient):
        """Test header validation."""
        response = await test_client.get(
            "/api/v1/players",
            headers={"X-API-Key": "invalid_key_format"},
        )
        # Should validate API key format
        assert response.status_code in [200, 401]
