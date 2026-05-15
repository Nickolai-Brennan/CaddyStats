"""Caddy Stats API — Application Entry Point."""

from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.logging import configure_logging
from app.middleware.request_id import RequestIDMiddleware

logger = structlog.get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Manage application lifecycle."""
    configure_logging()
    logger.info("Starting CaddyStats API", env=settings.APP_ENV, version=settings.APP_VERSION)
    yield
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
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Routes
    _register_routes(app)

    return app


def _register_routes(app: FastAPI) -> None:
    """Register all API routers."""
    from app.api.health import router as health_router
    from app.api.v1.auth import router as auth_router
    from app.api.v1.articles import router as articles_router
    from app.api.v1.players import router as players_router
    from app.api.v1.tournaments import router as tournaments_router

    app.include_router(health_router)
    app.include_router(auth_router, prefix="/api/v1")
    app.include_router(players_router, prefix="/api/v1")
    app.include_router(tournaments_router, prefix="/api/v1")
    app.include_router(articles_router, prefix="/api/v1")


app = create_app()
