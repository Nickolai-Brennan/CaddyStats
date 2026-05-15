"""Service — content domain."""

from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.content import ArticleRepository
from app.schemas.content import (
    ArticleCreateIn,
    ArticleListOut,
    ArticleOut,
    ArticleUpdateIn,
    AuthorOut,
    TagOut,
    TemplateOut,
)
from app.schemas.stats import PaginatedOut


class ContentService:
    def __init__(self, db: AsyncSession) -> None:
        self._repo = ArticleRepository(db)

    async def list_articles(
        self,
        status: str | None,
        author_slug: str | None,
        tag_slug: str | None,
        q: str | None,
        page: int,
        page_size: int,
    ) -> PaginatedOut[ArticleListOut]:
        items, total = await self._repo.list(
            status=status,
            author_slug=author_slug,
            tag_slug=tag_slug,
            q=q,
            page=page,
            page_size=page_size,
        )
        return PaginatedOut(
            items=[ArticleListOut.model_validate(a) for a in items],
            total=total,
            page=page,
            page_size=page_size,
            has_next=(page * page_size) < total,
        )

    async def get_article(self, slug: str) -> ArticleOut:
        article = await self._repo.get_by_slug(slug)
        if article is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")
        return ArticleOut.model_validate(article)

    async def create_article(self, data: ArticleCreateIn) -> ArticleOut:
        existing = await self._repo.get_by_slug(data.slug)
        if existing is not None:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Slug already exists")
        payload = data.model_dump(exclude={"tag_ids", "blocks"})
        blocks = [b.model_dump() for b in data.blocks]
        article = await self._repo.create(payload, data.tag_ids, blocks)
        return ArticleOut.model_validate(article)

    async def update_article(self, article_id: str, data: ArticleUpdateIn) -> ArticleOut:
        article = await self._repo.get_by_id(article_id)
        if article is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")
        update_data = data.model_dump(exclude_none=True, exclude={"tag_ids", "blocks"})
        article = await self._repo.update(article, update_data)
        if data.tag_ids is not None:
            await self._repo.replace_tags(article_id, data.tag_ids)
        if data.blocks is not None:
            await self._repo.replace_blocks(article_id, [b.model_dump() for b in data.blocks])
        # Re-fetch with all relationships
        article = await self._repo.get_by_id(article_id)
        return ArticleOut.model_validate(article)

    async def delete_article(self, article_id: str) -> None:
        article = await self._repo.get_by_id(article_id)
        if article is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Article not found")
        article.status = "archived"
        await self._repo.update(article, {"status": "archived"})

    async def list_tags(self, limit: int) -> list[TagOut]:
        tags = await self._repo.list_tags(limit=limit)
        return [TagOut.model_validate(item) for item in tags]

    async def list_authors(self, limit: int) -> list[AuthorOut]:
        authors = await self._repo.list_authors(limit=limit)
        return [AuthorOut.model_validate(item) for item in authors]

    async def list_templates(self, active_only: bool, limit: int) -> list[TemplateOut]:
        templates = await self._repo.list_templates(active_only=active_only, limit=limit)
        return [TemplateOut.model_validate(item) for item in templates]
