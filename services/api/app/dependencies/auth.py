"""FastAPI dependencies — authentication and authorization."""

from __future__ import annotations

import hashlib
from dataclasses import dataclass
from functools import lru_cache
from typing import Annotated

from fastapi import Depends, HTTPException, Security, status
from fastapi.security import APIKeyHeader, HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.session import get_db_session
from app.models.auth import User
from app.repositories.auth import UserRepository
from app.security.jwt import decode_token

_bearer = HTTPBearer(auto_error=False)
_api_key_header = APIKeyHeader(name=settings.API_KEY_HEADER_NAME, auto_error=False)


@dataclass(frozen=True)
class APIKeyPrincipal:
    """Authenticated principal resolved from a configured API key."""

    key_id: str
    display_name: str
    roles: tuple[str, ...]
    permissions: tuple[str, ...]

    def has_permission(self, key: str) -> bool:
        return "*" in self.permissions or key in self.permissions

    def has_role(self, name: str) -> bool:
        return "*" in self.roles or name in self.roles


Principal = User | APIKeyPrincipal


@lru_cache(maxsize=1)
def _configured_api_keys() -> dict[str, APIKeyPrincipal]:
    """Parse static API key definitions from settings.

    Format per key: name|secret|role1,role2|perm1,perm2
    Roles and permissions are optional.
    """
    keys: dict[str, APIKeyPrincipal] = {}
    for row in settings.API_KEY_STATIC_KEYS:
        parts = [p.strip() for p in row.split("|")]
        if len(parts) < 2:
            continue
        name, raw_key = parts[0], parts[1]
        if not name or not raw_key:
            continue
        roles = tuple(r.strip() for r in parts[2].split(",") if r.strip()) if len(parts) >= 3 else tuple()
        perms = tuple(p.strip() for p in parts[3].split(",") if p.strip()) if len(parts) >= 4 else tuple()
        key_hash = hashlib.sha256(raw_key.encode("utf-8")).hexdigest()
        keys[key_hash] = APIKeyPrincipal(
            key_id=f"apikey:{name}",
            display_name=name,
            roles=roles,
            permissions=perms,
        )
    return keys


def _resolve_api_key_principal(raw_key: str | None) -> APIKeyPrincipal | None:
    if not raw_key:
        return None
    key_hash = hashlib.sha256(raw_key.encode("utf-8")).hexdigest()
    return _configured_api_keys().get(key_hash)


async def _get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Security(_bearer)],
    api_key: Annotated[str | None, Security(_api_key_header)],
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> Principal | None:
    """Return the authenticated principal from JWT bearer or API key."""
    principal = _resolve_api_key_principal(api_key)
    if principal is not None:
        return principal

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


async def get_current_principal(
    user: Annotated[Principal | None, Depends(_get_current_user)],
) -> Principal:
    """Require an authenticated principal (JWT user or API key)."""
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


async def get_current_user(
    principal: Annotated[Principal, Depends(get_current_principal)],
) -> User:
    """Require an authenticated end-user JWT principal."""
    if not isinstance(principal, User):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User token required for this endpoint",
        )
    return principal


async def get_optional_user(
    user: Annotated[Principal | None, Depends(_get_current_user)],
) -> User | None:
    """Return JWT user if authenticated with bearer token; otherwise None."""
    if isinstance(user, User):
        return user
    return None


def require_permission(permission_key: str):
    """Dependency factory: require a specific permission key."""

    async def _check(principal: Annotated[Principal, Depends(get_current_principal)]) -> Principal:
        if not principal.has_permission(permission_key):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission required: {permission_key}",
            )
        return principal

    return _check


def require_role(role_name: str):
    """Dependency factory: require a specific role."""

    async def _check(principal: Annotated[Principal, Depends(get_current_principal)]) -> Principal:
        if not principal.has_role(role_name):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role required: {role_name}",
            )
        return principal

    return _check


# Convenience pre-built dependencies
RequireSubscriber = Depends(require_role("subscriber"))
RequireEditor = Depends(require_role("editor"))
RequireAdmin = Depends(require_role("admin"))
