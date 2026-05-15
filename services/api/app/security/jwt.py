"""JWT token creation and verification."""

from __future__ import annotations

from datetime import UTC, datetime, timedelta
from typing import Any

from jose import JWTError, jwt

from app.core.config import settings

_ALGORITHM = settings.JWT_ALGORITHM
_SECRET = settings.JWT_SECRET_KEY


def _now() -> datetime:
    return datetime.now(UTC)


def create_access_token(subject: str, extra_claims: dict[str, Any] | None = None) -> tuple[str, datetime]:
    """Return (encoded_jwt, expires_at)."""
    expires_at = _now() + timedelta(minutes=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
    payload: dict[str, Any] = {
        "sub": subject,
        "exp": expires_at,
        "iat": _now(),
        "type": "access",
        **(extra_claims or {}),
    }
    return jwt.encode(payload, _SECRET, algorithm=_ALGORITHM), expires_at


def create_refresh_token(subject: str) -> tuple[str, datetime]:
    """Return (encoded_jwt, expires_at)."""
    expires_at = _now() + timedelta(days=settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS)
    payload: dict[str, Any] = {
        "sub": subject,
        "exp": expires_at,
        "iat": _now(),
        "type": "refresh",
    }
    return jwt.encode(payload, _SECRET, algorithm=_ALGORITHM), expires_at


def decode_token(token: str) -> dict[str, Any]:
    """Decode and verify a JWT. Raises JWTError on failure."""
    return jwt.decode(token, _SECRET, algorithms=[_ALGORITHM])


def get_subject(token: str) -> str | None:
    """Return the 'sub' claim from a token, or None if invalid."""
    try:
        payload = decode_token(token)
        return str(payload["sub"])
    except (JWTError, KeyError):
        return None
