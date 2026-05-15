"""Repository — content domain."""

from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload

from app.models.content import Article, ArticleBlock, ArticleTag, Author, Tag


class ArticleRepository:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    def _base_query(self) -> select:
        return (
            select(Article)
            .options(
                joinedload(Article.author),
                selectinload(Article.article_tags).joinedload(ArticleTag.tag),
                selectinload(Article.blocks),
            )
        )

    async def get_by_id(self, article_id: str) -> Article | None:
        result = await self._db.execute(
            self._base_query().where(Article.id == article_id)
        )
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> Article | None:
        result = await self._db.execute(
            self._base_query().where(Article.slug == slug)
        )
        return result.scalar_one_or_none()

    async def list(
        self,
        status: str | None = None,
        author_slug: str | None = None,
        tag_slug: str | None = None,
        q: str | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[list[Article], int]:
        stmt = select(Article)
        if status:
            stmt = stmt.where(Article.status == status)
        if author_slug:
            stmt = stmt.join(Article.author).where(Author.slug == author_slug)
        if tag_slug:
            stmt = stmt.join(Article.article_tags).join(ArticleTag.tag).where(Tag.slug == tag_slug)
        if q:
            stmt = stmt.where(Article.title.ilike(f"%{q}%"))
        count_result = await self._db.execute(select(func.count()).select_from(stmt.subquery()))
        total = count_result.scalar_one()
        stmt = stmt.order_by(Article.publish_at.desc().nulls_last(), Article.updated_at.desc())
        stmt = stmt.offset((page - 1) * page_size).limit(page_size)
        full_stmt = stmt.options(
            joinedload(Article.author),
            selectinload(Article.article_tags).joinedload(ArticleTag.tag),
        )
        result = await self._db.execute(full_stmt)
        return list(result.scalars().unique().all()), total

    async def create(self, data: dict, tag_ids: list[str], blocks: list[dict]) -> Article:
        article = Article(**{k: v for k, v in data.items() if k not in ("tag_ids", "blocks")})
        self._db.add(article)
        await self._db.flush()
        for tag_id in tag_ids:
            self._db.add(ArticleTag(article_id=article.id, tag_id=tag_id))
        for b in blocks:
            self._db.add(ArticleBlock(article_id=article.id, **b))
        await self._db.flush()
        await self._db.refresh(article)
        return article

    async def update(self, article: Article, data: dict) -> Article:
        for key, value in data.items():
            setattr(article, key, value)
        self._db.add(article)
        await self._db.flush()
        await self._db.refresh(article)
        return article

    async def replace_tags(self, article_id: str, tag_ids: list[str]) -> None:
        from sqlalchemy import delete
        await self._db.execute(
            delete(ArticleTag).where(ArticleTag.article_id == article_id)
        )
        for tag_id in tag_ids:
            self._db.add(ArticleTag(article_id=article_id, tag_id=tag_id))
        await self._db.flush()

    async def replace_blocks(self, article_id: str, blocks: list[dict]) -> None:
        from sqlalchemy import delete
        await self._db.execute(
            delete(ArticleBlock).where(ArticleBlock.article_id == article_id)
        )
        for b in blocks:
            self._db.add(ArticleBlock(article_id=article_id, **b))
        await self._db.flush()
