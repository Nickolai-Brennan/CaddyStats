"""API routes — content metadata and discovery."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.schemas.content import AuthorOut, TagOut, TemplateOut
from app.services.content import ContentService

router = APIRouter(prefix="/content", tags=["content"])


@router.get("/tags", response_model=list[TagOut])
async def list_tags(
    db: Annotated[AsyncSession, Depends(get_db_session)],
    limit: int = Query(default=100, ge=1, le=500),
) -> list[TagOut]:
    return await ContentService(db).list_tags(limit=limit)


@router.get("/authors", response_model=list[AuthorOut])
async def list_authors(
    db: Annotated[AsyncSession, Depends(get_db_session)],
    limit: int = Query(default=100, ge=1, le=500),
) -> list[AuthorOut]:
    return await ContentService(db).list_authors(limit=limit)


@router.get("/templates", response_model=list[TemplateOut])
async def list_templates(
    db: Annotated[AsyncSession, Depends(get_db_session)],
    active_only: bool = Query(default=True),
    limit: int = Query(default=100, ge=1, le=500),
) -> list[TemplateOut]:
    return await ContentService(db).list_templates(active_only=active_only, limit=limit)
