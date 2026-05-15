"""Strawberry GraphQL queries — editorial, admin, and dashboard domain."""

from __future__ import annotations

from typing import Optional

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession

from app.graphql.types import (
    ArticleBlockType,
    ArticleListType,
    ArticleType,
    AuthorType,
    DashboardStatsType,
    RecentActivityType,
    RoleType,
    TagType,
    UserType,
)
from app.repositories.content import ArticleRepository, AuthorRepository, TagRepository
from app.services.admin import AdminService
from app.services.content import ContentService


@strawberry.type
class Query:
    """Root query type for editorial, admin, and dashboard access."""

    # -----------------------------------------------------------------------
    # Article queries
    # -----------------------------------------------------------------------

    @strawberry.field
    async def articles(
        self,
        status: Optional[str] = None,
        author_slug: Optional[str] = None,
        tag_slug: Optional[str] = None,
        q: Optional[str] = None,
        page: int = 1,
        page_size: int = 20,
        db: AsyncSession = strawberry.field(description="Database session"),
    ) -> list[ArticleListType]:
        """Query articles with optional filtering and search."""
        service = ContentService(db)
        result = await service.list_articles(
            status=status,
            author_slug=author_slug,
            tag_slug=tag_slug,
            q=q,
            page=page,
            page_size=page_size,
        )
        return [
            ArticleListType(
                id=a.id,
                slug=a.slug,
                title=a.title,
                summary=a.summary,
                status=a.status,
                publish_at=a.publish_at,
                word_count=a.word_count,
                read_time_minutes=a.read_time_minutes,
                ai_assisted=a.ai_assisted,
                author=AuthorType(
                    id=a.author.id,
                    slug=a.author.slug,
                    display_name=a.author.display_name,
                    bio=a.author.bio,
                    avatar_url=a.author.avatar_url,
                    twitter_handle=a.author.twitter_handle,
                ),
                tags=[
                    TagType(
                        id=t.id,
                        slug=t.slug,
                        name=t.name,
                        description=t.description,
                    )
                    for t in a.tags
                ],
                updated_at=a.updated_at,
            )
            for a in result.items
        ]

    @strawberry.field
    async def article(self, slug: str, db: AsyncSession = strawberry.field(description="Database session")) -> Optional[ArticleType]:
        """Fetch single article by slug."""
        repo = ArticleRepository(db)
        article = await repo.get_by_slug(slug)
        if not article:
            return None

        return ArticleType(
            id=article.id,
            slug=article.slug,
            title=article.title,
            summary=article.summary,
            status=article.status,
            canonical_url=article.canonical_url,
            seo_title=article.seo_title,
            seo_description=article.seo_description,
            og_image_url=article.og_image_url,
            schema_org_type=article.schema_org_type,
            tournament_id=article.tournament_id,
            course_id=article.course_id,
            player_id=article.player_id,
            word_count=article.word_count,
            read_time_minutes=article.read_time_minutes,
            ai_assisted=article.ai_assisted,
            review_notes=article.review_notes,
            publish_at=article.publish_at,
            unpublish_at=article.unpublish_at,
            created_at=article.created_at,
            updated_at=article.updated_at,
            author=AuthorType(
                id=article.author.id,
                slug=article.author.slug,
                display_name=article.author.display_name,
                bio=article.author.bio,
                avatar_url=article.author.avatar_url,
                twitter_handle=article.author.twitter_handle,
            ),
            template=None,  # Could be loaded if needed
            blocks=[
                ArticleBlockType(
                    id=b.id,
                    block_type=b.block_type,
                    order_index=b.order_index,
                    content=b.content,
                )
                for b in article.blocks
            ],
            tags=[
                TagType(
                    id=t.id,
                    slug=t.slug,
                    name=t.name,
                    description=t.description,
                )
                for t in article.tags
            ],
        )

    # -----------------------------------------------------------------------
    # Author queries
    # -----------------------------------------------------------------------

    @strawberry.field
    async def authors(
        self,
        db: AsyncSession = strawberry.field(description="Database session"),
    ) -> list[AuthorType]:
        """Fetch all authors."""
        repo = AuthorRepository(db)
        authors = await repo.list_all()
        return [
            AuthorType(
                id=a.id,
                slug=a.slug,
                display_name=a.display_name,
                bio=a.bio,
                avatar_url=a.avatar_url,
                twitter_handle=a.twitter_handle,
            )
            for a in authors
        ]

    @strawberry.field
    async def author(
        self,
        slug: str,
        db: AsyncSession = strawberry.field(description="Database session"),
    ) -> Optional[AuthorType]:
        """Fetch single author by slug."""
        repo = AuthorRepository(db)
        author = await repo.get_by_slug(slug)
        if not author:
            return None

        return AuthorType(
            id=author.id,
            slug=author.slug,
            display_name=author.display_name,
            bio=author.bio,
            avatar_url=author.avatar_url,
            twitter_handle=author.twitter_handle,
        )

    # -----------------------------------------------------------------------
    # Tag queries
    # -----------------------------------------------------------------------

    @strawberry.field
    async def tags(
        self,
        db: AsyncSession = strawberry.field(description="Database session"),
    ) -> list[TagType]:
        """Fetch all tags."""
        repo = TagRepository(db)
        tags = await repo.list_all()
        return [
            TagType(
                id=t.id,
                slug=t.slug,
                name=t.name,
                description=t.description,
            )
            for t in tags
        ]

    # -----------------------------------------------------------------------
    # User queries (admin-gated)
    # -----------------------------------------------------------------------

    @strawberry.field
    async def user(
        self,
        db: AsyncSession = strawberry.field(description="Database session"),
        principal = strawberry.field(description="Current principal"),
    ) -> Optional[UserType]:
        """Fetch current authenticated user (self view, limited fields)."""
        # Retrieve from principal
        if isinstance(principal, dict) and principal.get("sub"):
            repo = AdminService(db)
            user = await repo.get_user(principal["sub"])
            if not user:
                return None
            return UserType(
                id=user.id,
                email=user.email,
                username=user.username,
                display_name=user.display_name,
                avatar_url=user.avatar_url,
                account_status=user.account_status,
                email_verified=user.email_verified,
                last_login_at=user.last_login_at,
                created_at=user.created_at,
                roles=[
                    RoleType(
                        id=r.id,
                        name=r.name,
                        description=r.description,
                        is_system=r.is_system,
                        permissions=[],  # Limited in self-view
                    )
                    for r in user.roles
                ],
            )
        return None

    @strawberry.field
    async def users(
        self,
        db: AsyncSession = strawberry.field(description="Database session"),
        principal = strawberry.field(description="Current principal"),
    ) -> list[UserType]:
        """Fetch all users (admin only)."""
        # Check admin permission
        if not principal or not getattr(principal, "has_permission", lambda x: False)("admin.view"):
            return []

        service = AdminService(db)
        users = await service.list_users()
        return [
            UserType(
                id=u.id,
                email=u.email,
                username=u.username,
                display_name=u.display_name,
                avatar_url=u.avatar_url,
                account_status=u.account_status,
                email_verified=u.email_verified,
                last_login_at=u.last_login_at,
                created_at=u.created_at,
                roles=[
                    RoleType(
                        id=r.id,
                        name=r.name,
                        description=r.description,
                        is_system=r.is_system,
                        permissions=[],
                    )
                    for r in u.roles
                ],
            )
            for u in users
        ]

    # -----------------------------------------------------------------------
    # Dashboard queries
    # -----------------------------------------------------------------------

    @strawberry.field
    async def dashboard_stats(
        self,
        db: AsyncSession = strawberry.field(description="Database session"),
        principal = strawberry.field(description="Current principal"),
    ) -> DashboardStatsType:
        """Fetch editorial dashboard statistics (editor+ only)."""
        # Check editor permission
        if not principal or not getattr(principal, "has_permission", lambda x: False)("content.view"):
            return DashboardStatsType(
                total_articles=0,
                draft_count=0,
                published_count=0,
                ai_assisted_count=0,
                average_read_time_minutes=None,
                total_word_count=0,
                authors_count=0,
            )

        repo = ArticleRepository(db)
        stats = await repo.get_dashboard_stats()
        return DashboardStatsType(
            total_articles=stats.get("total", 0),
            draft_count=stats.get("draft_count", 0),
            published_count=stats.get("published_count", 0),
            ai_assisted_count=stats.get("ai_assisted_count", 0),
            average_read_time_minutes=stats.get("avg_read_time"),
            total_word_count=stats.get("total_word_count", 0),
            authors_count=stats.get("authors_count", 0),
        )

    @strawberry.field
    async def recent_activity(
        self,
        limit: int = 20,
        db: AsyncSession = strawberry.field(description="Database session"),
        principal = strawberry.field(description="Current principal"),
    ) -> list[RecentActivityType]:
        """Fetch recent editorial activity (editor+ only)."""
        # Check editor permission
        if not principal or not getattr(principal, "has_permission", lambda x: False)("content.view"):
            return []

        repo = ArticleRepository(db)
        activity = await repo.get_recent_activity(limit)
        return [
            RecentActivityType(
                article_id=a.get("article_id", ""),
                article_title=a.get("article_title", ""),
                action=a.get("action", ""),
                actor_name=a.get("actor_name", ""),
                occurred_at=a.get("occurred_at"),
            )
            for a in activity
        ]
