"""Pytest configuration and shared fixtures for CaddyStats backend testing."""

import asyncio
from typing import AsyncGenerator
from unittest.mock import AsyncMock, MagicMock, patch

import pytest
import pytest_asyncio
from httpx import AsyncClient
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

# Configure the event loop
pytest_plugins = ("pytest_asyncio",)


# ==============================================================================
# Database Fixtures
# ==============================================================================


@pytest.fixture(scope="session")
def event_loop() -> asyncio.AbstractEventLoop:
    """Create event loop for async tests."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture
async def test_db_engine():
    """Create a test database engine with SQLite (in-memory for speed)."""
    # For test environments, use a test database
    database_url = "sqlite+aiosqlite:///:memory:"
    engine = create_async_engine(database_url, echo=False, future=True)

    # Create tables
    async with engine.begin() as conn:
        # Create schemas
        await conn.execute(text("PRAGMA foreign_keys=ON"))
        # In production, you'd use Alembic migrations here
        # For now, create minimal tables for testing

    yield engine

    await engine.dispose()


@pytest_asyncio.fixture
async def test_db_session(test_db_engine) -> AsyncGenerator[AsyncSession, None]:
    """Create a test database session."""
    async_session = sessionmaker(
        test_db_engine, class_=AsyncSession, expire_on_commit=False
    )

    async with async_session() as session:
        yield session
        await session.rollback()


@pytest_asyncio.fixture
async def test_app():
    """Create a test FastAPI app instance."""
    from app.main import create_app

    app = create_app()
    yield app


@pytest_asyncio.fixture
async def test_client(test_app, test_db_session):
    """Create an async HTTP test client."""
    # Dependency override for database session
    from app.core.dependencies import get_db

    def override_get_db():
        return test_db_session

    test_app.dependency_overrides[get_db] = override_get_db

    async with AsyncClient(app=test_app, base_url="http://test") as client:
        yield client

    test_app.dependency_overrides.clear()


# ==============================================================================
# Auth Fixtures
# ==============================================================================


@pytest.fixture
def test_user_data():
    """Test user data."""
    return {
        "id": "user-test-1",
        "email": "test@example.com",
        "username": "testuser",
        "password_hash": "hashed_password",
        "active": True,
        "role": "user",
    }


@pytest.fixture
def test_admin_data():
    """Test admin user data."""
    return {
        "id": "admin-test-1",
        "email": "admin@example.com",
        "username": "admin",
        "password_hash": "hashed_password",
        "active": True,
        "role": "admin",
    }


@pytest.fixture
def test_jwt_token():
    """Valid JWT token for testing."""
    from datetime import datetime, timedelta, timezone
    import jwt
    from app.core.config import settings

    payload = {
        "sub": "user-test-1",
        "email": "test@example.com",
        "role": "user",
        "exp": datetime.now(timezone.utc) + timedelta(hours=1),
    }
    token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return token


@pytest.fixture
def test_expired_jwt_token():
    """Expired JWT token for testing."""
    from datetime import datetime, timedelta, timezone
    import jwt
    from app.core.config import settings

    payload = {
        "sub": "user-test-1",
        "email": "test@example.com",
        "role": "user",
        "exp": datetime.now(timezone.utc) - timedelta(hours=1),
    }
    token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return token


@pytest.fixture
def test_api_key():
    """Valid API key for testing."""
    return "test_key_12345|secret_67890|user,editor|read,write"


@pytest.fixture
def mock_redis_client():
    """Mock Redis client for cache testing."""
    mock_client = AsyncMock()
    mock_client.get = AsyncMock(return_value=None)
    mock_client.set = AsyncMock(return_value=True)
    mock_client.delete = AsyncMock(return_value=1)
    mock_client.delete_pattern = AsyncMock(return_value=5)
    mock_client.exists = AsyncMock(return_value=1)
    mock_client.ttl = AsyncMock(return_value=3600)
    mock_client.expire = AsyncMock(return_value=1)
    return mock_client


@pytest.fixture
def mock_auth_service():
    """Mock authentication service."""
    mock_service = AsyncMock()
    mock_service.verify_jwt = AsyncMock(
        return_value={"sub": "user-test-1", "role": "user"}
    )
    mock_service.verify_api_key = AsyncMock(
        return_value={"id": "key-1", "role": "user", "permissions": ["read", "write"]}
    )
    return mock_service


# ==============================================================================
# Repository Fixtures
# ==============================================================================


@pytest.fixture
def mock_player_repository():
    """Mock player repository."""
    mock_repo = AsyncMock()
    mock_repo.get = AsyncMock(return_value={"id": "p1", "name": "Test Player"})
    mock_repo.get_by_slug = AsyncMock(return_value={"id": "p1", "slug": "test-player"})
    mock_repo.list = AsyncMock(
        return_value=(
            [
                {"id": "p1", "name": "Player 1"},
                {"id": "p2", "name": "Player 2"},
            ],
            100,
        )
    )
    mock_repo.create = AsyncMock(return_value={"id": "p3", "name": "New Player"})
    mock_repo.update = AsyncMock(return_value={"id": "p1", "name": "Updated Player"})
    mock_repo.delete = AsyncMock(return_value=True)
    return mock_repo


@pytest.fixture
def mock_tournament_repository():
    """Mock tournament repository."""
    mock_repo = AsyncMock()
    mock_repo.get = AsyncMock(return_value={"id": "t1", "name": "Test Tournament"})
    mock_repo.get_by_slug = AsyncMock(
        return_value={"id": "t1", "slug": "test-tournament"}
    )
    mock_repo.list = AsyncMock(
        return_value=(
            [
                {"id": "t1", "name": "Tournament 1"},
                {"id": "t2", "name": "Tournament 2"},
            ],
            50,
        )
    )
    return mock_repo


@pytest.fixture
def mock_projection_repository():
    """Mock projection repository."""
    mock_repo = AsyncMock()
    mock_repo.get = AsyncMock(return_value={"id": "proj1", "player_id": "p1"})
    mock_repo.list = AsyncMock(
        return_value=(
            [{"id": "proj1", "player_id": "p1"}],
            25,
        )
    )
    mock_repo.create = AsyncMock(return_value={"id": "proj1", "player_id": "p1"})
    mock_repo.publish = AsyncMock(return_value={"id": "proj1", "published": True})
    return mock_repo


# ==============================================================================
# Service Fixtures
# ==============================================================================


@pytest.fixture
def mock_stats_service(mock_player_repository, mock_tournament_repository):
    """Mock stats service."""
    mock_service = AsyncMock()
    mock_service.list_players = AsyncMock(
        return_value={
            "items": [{"id": "p1", "name": "Player 1"}],
            "total": 100,
            "page": 1,
            "page_size": 10,
            "has_next": True,
        }
    )
    mock_service.get_player = AsyncMock(return_value={"id": "p1", "name": "Player 1"})
    mock_service.get_overview = AsyncMock(
        return_value={
            "active_players": 150,
            "active_tournaments": 5,
            "publishable_projections": 300,
            "open_markets": 200,
        }
    )
    return mock_service


@pytest.fixture
def mock_betting_service():
    """Mock betting service."""
    mock_service = AsyncMock()
    mock_service.get_markets = AsyncMock(
        return_value={
            "items": [
                {"id": "m1", "name": "To Win Tournament"},
                {"id": "m2", "name": "Top 10 Finish"},
            ],
            "total": 50,
            "page": 1,
        }
    )
    mock_service.get_market_odds = AsyncMock(
        return_value={"market_id": "m1", "odds": [{"player_id": "p1", "odds": 25.0}]}
    )
    mock_service.calculate_edge = AsyncMock(
        return_value={"player_id": "p1", "market_id": "m1", "edge": 0.15}
    )
    return mock_service


@pytest.fixture
def mock_content_service():
    """Mock content service."""
    mock_service = AsyncMock()
    mock_service.get_article = AsyncMock(
        return_value={"id": "a1", "title": "Test Article", "content": "Test"}
    )
    mock_service.list_articles = AsyncMock(
        return_value={
            "items": [{"id": "a1", "title": "Article 1"}],
            "total": 100,
            "page": 1,
        }
    )
    mock_service.create_article = AsyncMock(
        return_value={"id": "a1", "title": "New Article"}
    )
    mock_service.update_article = AsyncMock(
        return_value={"id": "a1", "title": "Updated Article"}
    )
    mock_service.publish_article = AsyncMock(
        return_value={"id": "a1", "published": True}
    )
    return mock_service


# ==============================================================================
# Cache Fixtures
# ==============================================================================


@pytest_asyncio.fixture
async def mock_cache_ops():
    """Mock cache operations."""
    mock_ops = AsyncMock()
    mock_ops.get = AsyncMock(return_value=None)
    mock_ops.set = AsyncMock(return_value=True)
    mock_ops.delete = AsyncMock(return_value=1)
    mock_ops.delete_pattern = AsyncMock(return_value=5)
    mock_ops.exists = AsyncMock(return_value=0)
    mock_ops.ttl = AsyncMock(return_value=-2)
    return mock_ops


# ==============================================================================
# Performance Fixtures
# ==============================================================================


@pytest.fixture
def performance_budget():
    """API performance budgets in milliseconds."""
    return {
        "list_players": 200,
        "get_player": 150,
        "list_tournaments": 200,
        "get_tournament": 150,
        "get_leaderboard": 300,
        "get_rankings": 400,
        "get_projections": 300,
        "get_markets": 200,
        "calculate_edge": 500,
        "graphql_query": 500,
        "graphql_mutation": 600,
    }


# ==============================================================================
# AI Fixtures
# ==============================================================================


@pytest.fixture
def valid_grounding_data():
    """Valid grounding data for AI validation."""
    return {
        "player_stats": {
            "strokes_gained": 2.5,
            "proximity": 28.5,
            "gir_percentage": 65.2,
        },
        "market_data": {
            "market_id": "m1",
            "sportsbook_odds": 25.0,
            "model_probability": 0.08,
        },
        "projection_data": {
            "projection_id": "proj1",
            "win_percentage": 8.0,
            "top_10_percentage": 45.0,
        },
    }


@pytest.fixture
def mock_ai_service():
    """Mock AI service."""
    mock_service = AsyncMock()
    mock_service.generate_article_summary = AsyncMock(
        return_value="Generated summary based on verified data."
    )
    mock_service.generate_player_analysis = AsyncMock(
        return_value="Player analysis with grounded statistics."
    )
    mock_service.validate_claim = AsyncMock(
        return_value={"valid": True, "confidence": 0.95, "sources": ["database", "model"]}
    )
    mock_service.generate_projection_explanation = AsyncMock(
        return_value="Projection explanation backed by data."
    )
    return mock_service


# ==============================================================================
# GraphQL Fixtures
# ==============================================================================


@pytest.fixture
def graphql_client(test_app):
    """GraphQL client for testing."""
    from strawberry.asgi import GraphQL as StrawberryGraphQL

    # Return the GraphQL ASGI app
    return StrawberryGraphQL


# ==============================================================================
# Test Data Factories
# ==============================================================================


class PlayerFactory:
    """Factory for creating test player data."""

    @staticmethod
    def build(
        id: str = "p1",
        name: str = "Test Player",
        slug: str = "test-player",
        active: bool = True,
        country: str = "USA",
    ) -> dict:
        """Build player data."""
        return {
            "id": id,
            "name": name,
            "slug": slug,
            "active": active,
            "country": country,
            "status": "active" if active else "inactive",
        }


class TournamentFactory:
    """Factory for creating test tournament data."""

    @staticmethod
    def build(
        id: str = "t1",
        name: str = "Test Tournament",
        slug: str = "test-tournament",
        status: str = "scheduled",
    ) -> dict:
        """Build tournament data."""
        return {
            "id": id,
            "name": name,
            "slug": slug,
            "status": status,
            "start_date": "2026-05-20",
            "end_date": "2026-05-23",
        }


class ProjectionFactory:
    """Factory for creating test projection data."""

    @staticmethod
    def build(
        id: str = "proj1",
        player_id: str = "p1",
        tournament_id: str = "t1",
        win_percentage: float = 8.0,
        published: bool = False,
    ) -> dict:
        """Build projection data."""
        return {
            "id": id,
            "player_id": player_id,
            "tournament_id": tournament_id,
            "win_percentage": win_percentage,
            "top_10_percentage": 45.0,
            "top_20_percentage": 65.0,
            "published": published,
        }


class ArticleFactory:
    """Factory for creating test article data."""

    @staticmethod
    def build(
        id: str = "a1",
        title: str = "Test Article",
        slug: str = "test-article",
        published: bool = False,
        author_id: str = "user1",
    ) -> dict:
        """Build article data."""
        return {
            "id": id,
            "title": title,
            "slug": slug,
            "content": "Test article content.",
            "published": published,
            "author_id": author_id,
            "created_at": "2026-05-15T00:00:00Z",
        }


@pytest.fixture
def player_factory():
    """Player factory."""
    return PlayerFactory()


@pytest.fixture
def tournament_factory():
    """Tournament factory."""
    return TournamentFactory()


@pytest.fixture
def projection_factory():
    """Projection factory."""
    return ProjectionFactory()


@pytest.fixture
def article_factory():
    """Article factory."""
    return ArticleFactory()
