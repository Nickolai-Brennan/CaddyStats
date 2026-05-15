"""FastAPI dependencies — authentication and authorization."""

from __future__ import annotations

from typing import Annotated

from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.models.auth import User
from app.repositories.auth import UserRepository
from app.security.jwt import decode_token

_bearer = HTTPBearer(auto_error=False)


async def _get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Security(_bearer)],
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> User | None:
    """Return the authenticated User or None for unauthenticated requests."""
    if credentials is None:
        return None
    try:
        payload = decode_token(credentials.credentials)
        if payload.get("type") != "access":
            return None
        user_id: str | None = payload.get("sub")
        if not user_id:
            return None
    except JWTError:
        return None

    repo = UserRepository(db)
    user = await repo.get_by_id(user_id)
    if user is None or user.account_status != "active":
        return None
    return user


async def get_current_user(
    user: Annotated[User | None, Depends(_get_current_user)],
) -> User:
    """Require an authenticated user; raise 401 if missing."""
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


async def get_optional_user(
    user: Annotated[User | None, Depends(_get_current_user)],
) -> User | None:
    """Return user if authenticated, None otherwise (for public+auth shared routes)."""
    return user


def require_permission(permission_key: str):
    """Dependency factory: require a specific permission key."""

    async def _check(user: Annotated[User, Depends(get_current_user)]) -> User:
        if not user.has_permission(permission_key):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission required: {permission_key}",
            )
        return user

    return _check


def require_role(role_name: str):
    """Dependency factory: require a specific role."""

    async def _check(user: Annotated[User, Depends(get_current_user)]) -> User:
        if not user.has_role(role_name):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role required: {role_name}",
            )
        return user

    return _check


# Convenience pre-built dependencies
RequireSubscriber = Depends(require_role("subscriber"))
RequireEditor = Depends(require_role("editor"))
RequireAdmin = Depends(require_role("admin"))
