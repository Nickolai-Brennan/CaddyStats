"""API routes — auth domain."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.dependencies.auth import get_current_user
from app.models.auth import User
from app.schemas.auth import (
    LoginIn,
    RefreshIn,
    TokenOut,
    UserOut,
    UserRegisterIn,
    UserUpdateIn,
)
from app.services.auth import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenOut, status_code=status.HTTP_201_CREATED)
async def register(
    data: UserRegisterIn,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> TokenOut:
    svc = AuthService(db)
    tokens = await svc.register(data)
    await db.commit()
    return tokens


@router.post("/login", response_model=TokenOut)
async def login(
    data: LoginIn,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> TokenOut:
    svc = AuthService(db)
    tokens = await svc.login(data)
    await db.commit()
    return tokens


@router.post("/refresh", response_model=TokenOut)
async def refresh(
    data: RefreshIn,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> TokenOut:
    svc = AuthService(db)
    tokens = await svc.refresh(data.refresh_token)
    await db.commit()
    return tokens


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    data: RefreshIn,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> None:
    svc = AuthService(db)
    await svc.logout(str(current_user.id), data.refresh_token)
    await db.commit()


@router.get("/me", response_model=UserOut)
async def get_me(
    current_user: Annotated[User, Depends(get_current_user)],
) -> UserOut:
    return UserOut.model_validate(current_user)


@router.patch("/me", response_model=UserOut)
async def update_me(
    data: UserUpdateIn,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> UserOut:
    from app.repositories.auth import UserRepository
    repo = UserRepository(db)
    updates = data.model_dump(exclude_none=True)
    if not updates:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields to update")
    for key, value in updates.items():
        setattr(current_user, key, value)
    user = await repo.save(current_user)
    await db.commit()
    return UserOut.model_validate(user)
