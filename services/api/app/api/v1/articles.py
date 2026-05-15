"""API routes — articles (public reads + editor writes)."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.dependencies.auth import require_permission
from app.schemas.content import ArticleCreateIn, ArticleListOut, ArticleOut, ArticleUpdateIn
from app.schemas.stats import PaginatedOut
from app.services.content import ContentService

router = APIRouter(prefix="/articles", tags=["articles"])


# ------------------------------------------------------------------
# Public reads
# ------------------------------------------------------------------

@router.get("", response_model=PaginatedOut[ArticleListOut])
async def list_articles(
    db: Annotated[AsyncSession, Depends(get_db_session)],
    author_slug: str | None = Query(default=None),
    tag_slug: str | None = Query(default=None),
    q: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
) -> PaginatedOut[ArticleListOut]:
    # Public endpoint: only show published articles
    return await ContentService(db).list_articles(
        status="published",
        author_slug=author_slug,
        tag_slug=tag_slug,
        q=q,
        page=page,
        page_size=page_size,
    )


@router.get("/{slug}", response_model=ArticleOut)
async def get_article(
    slug: str,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> ArticleOut:
    return await ContentService(db).get_article(slug)


# ------------------------------------------------------------------
# Editor writes (require content.create / content.edit permissions)
# ------------------------------------------------------------------

@router.post(
    "",
    response_model=ArticleOut,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_permission("content.write"))],
)
async def create_article(
    data: ArticleCreateIn,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> ArticleOut:
    svc = ContentService(db)
    article = await svc.create_article(data)
    await db.commit()
    return article


@router.patch(
    "/{article_id}",
    response_model=ArticleOut,
    dependencies=[Depends(require_permission("content.write"))],
)
async def update_article(
    article_id: str,
    data: ArticleUpdateIn,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> ArticleOut:
    svc = ContentService(db)
    article = await svc.update_article(article_id, data)
    await db.commit()
    return article


@router.delete(
    "/{article_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(require_permission("content.delete"))],
)
async def delete_article(
    article_id: str,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> None:
    svc = ContentService(db)
    await svc.delete_article(article_id)
    await db.commit()
