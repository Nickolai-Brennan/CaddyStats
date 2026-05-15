"""Structured and sanitized API error responses."""

from __future__ import annotations

import html
import re
from datetime import UTC, datetime
from typing import Any

import structlog
from fastapi import HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette import status

logger = structlog.get_logger(__name__)

_CONTROL_CHARS = re.compile(r"[\x00-\x1f\x7f]")


def sanitize_text(value: object, *, max_length: int = 300) -> str:
    """Normalize arbitrary values into safe, bounded error strings."""
    text = html.escape(str(value), quote=False)
    text = _CONTROL_CHARS.sub("", text).strip()
    if len(text) > max_length:
        return f"{text[:max_length]}..."
    return text


def _error_payload(
    request: Request,
    *,
    status_code: int,
    code: str,
    message: str,
    details: list[dict[str, str]] | None = None,
) -> dict[str, Any]:
    request_id = request.headers.get("X-Request-ID") or request.scope.get("request_id")
    return {
        "error": {
            "code": code,
            "message": sanitize_text(message),
            "details": details or [],
        },
        "meta": {
            "status": status_code,
            "request_id": request_id,
            "path": request.url.path,
            "timestamp": datetime.now(UTC).isoformat(),
        },
    }


def structured_error_response(
    request: Request,
    *,
    status_code: int,
    code: str,
    message: str,
    details: list[dict[str, str]] | None = None,
    headers: dict[str, str] | None = None,
) -> JSONResponse:
    """Build a sanitized JSON API error response."""
    return JSONResponse(
        status_code=status_code,
        content=_error_payload(
            request,
            status_code=status_code,
            code=code,
            message=message,
            details=details,
        ),
        headers=headers,
    )


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """Handle expected HTTP errors with a structured response envelope."""
    code = f"http_{exc.status_code}"
    detail_message = exc.detail if isinstance(exc.detail, str) else "Request failed"
    details: list[dict[str, str]] = []
    if isinstance(exc.detail, list):
        for item in exc.detail:
            details.append({"message": sanitize_text(item)})
    elif isinstance(exc.detail, dict):
        for key, value in exc.detail.items():
            details.append({"field": sanitize_text(key), "message": sanitize_text(value)})
    return structured_error_response(
        request,
        status_code=exc.status_code,
        code=code,
        message=detail_message,
        details=details,
        headers=exc.headers,
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Handle request validation errors in a deterministic envelope."""
    details: list[dict[str, str]] = []
    for error in exc.errors():
        path = ".".join(str(p) for p in error.get("loc", []) if p != "body")
        details.append(
            {
                "field": sanitize_text(path or "request"),
                "message": sanitize_text(error.get("msg", "Invalid input")),
                "type": sanitize_text(error.get("type", "validation_error")),
            }
        )

    return structured_error_response(
        request,
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        code="validation_error",
        message="Request validation failed",
        details=details,
    )


async def unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle unexpected exceptions without leaking internals to clients."""
    logger.exception(
        "Unhandled API exception",
        path=request.url.path,
        method=request.method,
        error_type=type(exc).__name__,
    )
    return structured_error_response(
        request,
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        code="internal_server_error",
        message="An unexpected error occurred",
    )
