"""Service — auth domain."""

from __future__ import annotations

import hashlib
from datetime import UTC, datetime

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.auth import Session
from app.repositories.auth import UserRepository
from app.schemas.auth import LoginIn, TokenOut, UserRegisterIn
from app.security.jwt import create_access_token, create_refresh_token, decode_token
from app.security.passwords import hash_password, verify_password


def _token_hash(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


class AuthService:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db
        self._repo = UserRepository(db)

    async def register(self, data: UserRegisterIn) -> TokenOut:
        if await self._repo.get_by_email(data.email):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")
        if await self._repo.get_by_username(data.username):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username taken")

        user = await self._repo.create(
            email=data.email.lower(),
            username=data.username,
            display_name=data.display_name or data.username,
            password_hash=hash_password(data.password),
            account_status="active",
        )
        await self._repo.assign_role(user.id, "user")
        return await self._issue_tokens(user.id)

    async def login(self, data: LoginIn) -> TokenOut:
        user = await self._repo.get_by_email(data.email)
        if user is None or not verify_password(data.password, user.password_hash or ""):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        if user.account_status != "active":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account suspended")
        user.last_login_at = datetime.now(UTC)
        await self._repo.save(user)
        return await self._issue_tokens(user.id)

    async def refresh(self, refresh_token: str) -> TokenOut:
        try:
            payload = decode_token(refresh_token)
        except Exception:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
        user_id: str = payload["sub"]

        # Verify session still exists (not logged out)
        token_hash = _token_hash(refresh_token)
        from sqlalchemy import select
        session_result = await self._db.execute(
            select(Session).where(
                Session.user_id == user_id,
                Session.refresh_token_hash == token_hash,
                Session.revoked_at.is_(None),
            )
        )
        session = session_result.scalar_one_or_none()
        if session is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session not found or revoked")

        user = await self._repo.get_by_id(user_id)
        if user is None or user.account_status != "active":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User unavailable")

        # Rotate: revoke old session, issue new tokens
        session.revoked_at = datetime.now(UTC)
        self._db.add(session)
        return await self._issue_tokens(user.id)

    async def logout(self, user_id: str, refresh_token: str) -> None:
        token_hash = _token_hash(refresh_token)
        from sqlalchemy import select
        session_result = await self._db.execute(
            select(Session).where(
                Session.user_id == user_id,
                Session.refresh_token_hash == token_hash,
            )
        )
        session = session_result.scalar_one_or_none()
        if session:
            session.revoked_at = datetime.now(UTC)
            self._db.add(session)
            await self._db.flush()

    async def _issue_tokens(self, user_id: str) -> TokenOut:
        access_token, access_exp = create_access_token(user_id)
        refresh_token, refresh_exp = create_refresh_token(user_id)

        session = Session(
            user_id=user_id,
            token_hash=_token_hash(access_token),
            refresh_token_hash=_token_hash(refresh_token),
            expires_at=refresh_exp,
        )
        self._db.add(session)
        await self._db.flush()

        expires_in = int((access_exp - datetime.now(UTC)).total_seconds())
        return TokenOut(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=max(0, expires_in),
        )
