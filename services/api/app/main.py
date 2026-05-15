"""Caddy Stats API — Application Entry Point."""

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from strawberry.asgi import GraphQL

from app.caching.client import RedisClient
from app.core.config import settings
from app.core.errors import (
    http_exception_handler,
    unhandled_exception_handler,
    validation_exception_handler,
)
from app.core.logging import configure_logging
from app.graphql.schema import schema
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.request_id import RequestIDMiddleware

logger = structlog.get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Manage application lifecycle."""
    configure_logging()
    logger.info("Starting CaddyStats API", env=settings.APP_ENV, version=settings.APP_VERSION)

    # Initialize Redis connection for caching
    try:
        await RedisClient.connect(settings.REDIS_URL)
        logger.info("Redis cache initialized")
    except Exception as e:
        logger.warning("Redis cache initialization failed", error=str(e))

    yield

    # Cleanup
    await RedisClient.disconnect()
    logger.info("Shutting down CaddyStats API")


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title="CaddyStats API",
        description="Golf analytics, content, and betting intelligence platform API",
        version=settings.APP_VERSION,
        docs_url="/docs" if settings.APP_ENV != "production" else None,
        redoc_url="/redoc" if settings.APP_ENV != "production" else None,
        openapi_url="/openapi.json" if settings.APP_ENV != "production" else None,
        lifespan=lifespan,
    )

    # Middleware
    app.add_middleware(RequestIDMiddleware)
    app.add_middleware(RateLimitMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Exception handlers
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)

    # Routes
    _register_routes(app)

    # GraphQL endpoint
    graphql_app = GraphQL(schema, debug=settings.APP_ENV != "production")
    app.mount("/graphql", graphql_app)

    return app


def _register_routes(app: FastAPI) -> None:
    """Register all API routers."""
    from app.api.health import router as health_router
    from app.api.v1.admin import router as admin_router
    from app.api.v1.ai_workflows import router as ai_router
    from app.api.v1.auth import router as auth_router
    from app.api.v1.articles import router as articles_router
    from app.api.v1.betting import router as betting_router
    from app.api.v1.billing import router as billing_router
    from app.api.v1.content import router as content_router
    from app.api.v1.players import router as players_router
    from app.api.v1.projections import router as projections_router
    from app.api.v1.rankings import router as rankings_router
    from app.api.v1.stats import router as stats_router
    from app.api.v1.tournaments import router as tournaments_router

    app.include_router(health_router)
    app.include_router(auth_router, prefix="/api/v1")
    app.include_router(players_router, prefix="/api/v1")
    app.include_router(tournaments_router, prefix="/api/v1")
    app.include_router(stats_router, prefix="/api/v1")
    app.include_router(projections_router, prefix="/api/v1")
    app.include_router(betting_router, prefix="/api/v1")
    app.include_router(rankings_router, prefix="/api/v1")
    app.include_router(ai_router, prefix="/api/v1")
    app.include_router(articles_router, prefix="/api/v1")
    app.include_router(content_router, prefix="/api/v1")
    app.include_router(billing_router, prefix="/api/v1")
    app.include_router(admin_router, prefix="/api/v1")


app = create_app()
