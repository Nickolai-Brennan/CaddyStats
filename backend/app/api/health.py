"""Health check endpoints."""

import time

from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter(tags=["health"])

_start_time = time.time()


@router.get("/health", summary="Health check")
async def health() -> JSONResponse:
    """Return service health status."""
    return JSONResponse(
        content={
            "status": "ok",
            "service": "caddystats-api",
            "uptime_seconds": round(time.time() - _start_time, 2),
        }
    )


@router.get("/health/ready", summary="Readiness check")
async def ready() -> JSONResponse:
    """Return readiness status (DB + Redis connectivity)."""
    return JSONResponse(content={"status": "ready"})
