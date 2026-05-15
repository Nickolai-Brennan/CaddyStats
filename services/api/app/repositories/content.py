"""Repository — content domain."""

from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload, selectinload

from app.models.content import Article, ArticleBlock, ArticleTag, Author, Tag, Template


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

    async def list_tags(self, limit: int = 100) -> list[Tag]:
        result = await self._db.execute(
            select(Tag).order_by(Tag.name.asc()).limit(limit)
        )
        return list(result.scalars().all())

    async def list_authors(self, limit: int = 100) -> list[Author]:
        result = await self._db.execute(
            select(Author).order_by(Author.display_name.asc()).limit(limit)
        )
        return list(result.scalars().all())

    async def list_templates(self, active_only: bool = True, limit: int = 100) -> list[Template]:
        stmt = select(Template)
        if active_only:
            stmt = stmt.where(Template.is_active.is_(True))
        result = await self._db.execute(stmt.order_by(Template.name.asc()).limit(limit))
        return list(result.scalars().all())

    async def get_dashboard_stats(self) -> dict:
        """Fetch editorial dashboard statistics."""

        # Total articles
        total_result = await self._db.execute(select(func.count()).select_from(Article))
        total = total_result.scalar_one() or 0

        # Draft count
        draft_result = await self._db.execute(
            select(func.count()).select_from(Article).where(Article.status == "draft")
        )
        draft_count = draft_result.scalar_one() or 0

        # Published count
        published_result = await self._db.execute(
            select(func.count()).select_from(Article).where(Article.status == "published")
        )
        published_count = published_result.scalar_one() or 0

        # AI-assisted count
        ai_result = await self._db.execute(
            select(func.count()).select_from(Article).where(Article.ai_assisted.is_(True))
        )
        ai_assisted_count = ai_result.scalar_one() or 0

        # Average read time
        avg_time_result = await self._db.execute(
            select(func.avg(Article.read_time_minutes)).select_from(Article)
        )
        avg_read_time = avg_time_result.scalar_one()

        # Total word count
        word_count_result = await self._db.execute(
            select(func.sum(Article.word_count)).select_from(Article)
        )
        total_word_count = word_count_result.scalar_one() or 0

        # Authors count
        authors_result = await self._db.execute(select(func.count(func.distinct(Article.author_id))).select_from(Article))
        authors_count = authors_result.scalar_one() or 0

        return {
            "total": total,
            "draft_count": draft_count,
            "published_count": published_count,
            "ai_assisted_count": ai_assisted_count,
            "avg_read_time": float(avg_read_time) if avg_read_time else None,
            "total_word_count": int(total_word_count) if total_word_count else 0,
            "authors_count": authors_count,
        }

    async def get_recent_activity(self, limit: int = 20) -> list[dict]:
        """Fetch recent article activity for dashboard."""
        result = await self._db.execute(
            select(
                Article.id.label("article_id"),
                Article.title.label("article_title"),
                func.literal("updated").label("action"),
                Author.display_name.label("actor_name"),
                Article.updated_at.label("occurred_at"),
            )
            .select_from(Article)
            .join(Author)
            .order_by(Article.updated_at.desc())
            .limit(limit)
        )
        rows = result.all()
        return [
            {
                "article_id": row.article_id,
                "article_title": row.article_title,
                "action": row.action,
                "actor_name": row.actor_name,
                "occurred_at": row.occurred_at,
            }
            for row in rows
        ]


class AuthorRepository:
    """Repository for Author operations."""

    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def get_by_id(self, author_id: str) -> Author | None:
        result = await self._db.execute(select(Author).where(Author.id == author_id))
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> Author | None:
        result = await self._db.execute(select(Author).where(Author.slug == slug))
        return result.scalar_one_or_none()

    async def list_all(self, limit: int = 100) -> list[Author]:
        result = await self._db.execute(
            select(Author).order_by(Author.display_name.asc()).limit(limit)
        )
        return list(result.scalars().all())

    async def create(
        self,
        display_name: str,
        slug: str,
        bio: str | None = None,
        avatar_url: str | None = None,
        twitter_handle: str | None = None,
    ) -> Author:
        author = Author(
            display_name=display_name,
            slug=slug,
            bio=bio,
            avatar_url=avatar_url,
            twitter_handle=twitter_handle,
        )
        self._db.add(author)
        await self._db.flush()
        return author


class TagRepository:
    """Repository for Tag operations."""

    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def get_by_id(self, tag_id: str) -> Tag | None:
        result = await self._db.execute(select(Tag).where(Tag.id == tag_id))
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> Tag | None:
        result = await self._db.execute(select(Tag).where(Tag.slug == slug))
        return result.scalar_one_or_none()

    async def list_all(self, limit: int = 100) -> list[Tag]:
        result = await self._db.execute(
            select(Tag).order_by(Tag.name.asc()).limit(limit)
        )
        return list(result.scalars().all())


class TemplateRepository:
    """Repository for Template operations."""

    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def get_by_id(self, template_id: str) -> Template | None:
        result = await self._db.execute(select(Template).where(Template.id == template_id))
        return result.scalar_one_or_none()

    async def get_by_slug(self, slug: str) -> Template | None:
        result = await self._db.execute(select(Template).where(Template.slug == slug))
        return result.scalar_one_or_none()

    async def list_active(self, limit: int = 100) -> list[Template]:
        result = await self._db.execute(
            select(Template)
            .where(Template.is_active.is_(True))
            .order_by(Template.name.asc())
            .limit(limit)
        )
        return list(result.scalars().all())
