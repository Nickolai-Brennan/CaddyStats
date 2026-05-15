"""Strawberry GraphQL mutations — editorial, admin, and AI workflows."""

from __future__ import annotations

from typing import Optional

import strawberry
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.auth import get_current_principal
from app.graphql.types import (
    AIWorkflowReviewInput,
    ArticleBlockInput,
    ArticleBlockType,
    ArticleCreateInput,
    ArticleListType,
    ArticleType,
    ArticleUpdateInput,
    AuthorCreateInput,
    AuthorType,
    AuthorUpdateInput,
    UserType,
)
from app.repositories.content import ArticleRepository, AuthorRepository
from app.repositories.auth import UserRepository
from app.services.content import ContentService
from app.services.admin import AdminService
from app.services.ai import AIService
from app.schemas.content import ArticleBlockIn, ArticleCreateIn, ArticleUpdateIn, AuthorOut
from app.models.auth import User


@strawberry.type
class Mutation:
    """Root mutation type for editorial operations, admin tasks, and AI workflows."""

    # -----------------------------------------------------------------------
    # Article mutations
    # -----------------------------------------------------------------------

    @strawberry.mutation
    async def create_article(
        self,
        input: ArticleCreateInput,
        db: AsyncSession = strawberry.field(description="Database session"),
        principal = strawberry.field(description="Current principal"),
    ) -> ArticleType:
        """Create new article (editor+ only)."""
        # Check permission
        if not principal or not getattr(principal, "has_permission", lambda x: False)("content.write"):
            raise PermissionError("Insufficient permissions to create article")

        service = ContentService(db)
        blocks = [
            ArticleBlockIn(
                block_type=b.block_type,
                order_index=b.order_index,
                content=b.content,
            )
            for b in input.blocks
        ]
        create_input = ArticleCreateIn(
            author_id=input.author_id,
            template_id=input.template_id,
            slug=input.slug,
            title=input.title,
            summary=input.summary,
            status=input.status,
            seo_title=input.seo_title,
            seo_description=input.seo_description,
            og_image_url=input.og_image_url,
            tournament_id=input.tournament_id,
            course_id=input.course_id,
            player_id=input.player_id,
            tag_ids=input.tag_ids,
            blocks=blocks,
        )

        article = await service.create_article(create_input)

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
            template=None,
            blocks=[
                ArticleBlockInputType(
                    id=b.id,
                    block_type=b.block_type,
                    order_index=b.order_index,
                    content=b.content,
                )
                for b in article.blocks
            ],
            tags=[],
        )

    @strawberry.mutation
    async def update_article(
        self,
        article_id: str,
        input: ArticleUpdateInput,
        db: AsyncSession = strawberry.field(description="Database session"),
        principal = strawberry.field(description="Current principal"),
    ) -> ArticleType:
        """Update article (editor+ only)."""
        # Check permission
        if not principal or not getattr(principal, "has_permission", lambda x: False)("content.write"):
            raise PermissionError("Insufficient permissions to update article")

        service = ContentService(db)
        blocks = None
        if input.blocks:
            blocks = [
                ArticleBlockIn(
                    block_type=b.block_type,
                    order_index=b.order_index,
                    content=b.content,
                )
                for b in input.blocks
            ]

        update_input = ArticleUpdateIn(
            title=input.title,
            summary=input.summary,
            status=input.status,
            seo_title=input.seo_title,
            seo_description=input.seo_description,
            og_image_url=input.og_image_url,
            tag_ids=input.tag_ids,
            blocks=blocks,
        )

        article = await service.update_article(article_id, update_input)

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
            template=None,
            blocks=[],
            tags=[],
        )

    @strawberry.mutation
    async def delete_article(
        self,
        article_id: str,
        db: AsyncSession = strawberry.field(description="Database session"),
        principal = strawberry.field(description="Current principal"),
    ) -> bool:
        """Delete article (editor+ only)."""
        # Check permission
        if not principal or not getattr(principal, "has_permission", lambda x: False)("content.delete"):
            raise PermissionError("Insufficient permissions to delete article")

        service = ContentService(db)
        await service.delete_article(article_id)
        return True

    # -----------------------------------------------------------------------
    # Author mutations
    # -----------------------------------------------------------------------

    @strawberry.mutation
    async def create_author(
        self,
        input: AuthorCreateInput,
        db: AsyncSession = strawberry.field(description="Database session"),
        principal = strawberry.field(description="Current principal"),
    ) -> AuthorType:
        """Create new author (editor+ only)."""
        # Check permission
        if not principal or not getattr(principal, "has_permission", lambda x: False)("content.write"):
            raise PermissionError("Insufficient permissions to create author")

        repo = AuthorRepository(db)
        author = await repo.create(
            display_name=input.display_name,
            slug=input.slug,
            bio=input.bio,
            avatar_url=input.avatar_url,
            twitter_handle=input.twitter_handle,
        )
        await db.commit()

        return AuthorType(
            id=author.id,
            slug=author.slug,
            display_name=author.display_name,
            bio=author.bio,
            avatar_url=author.avatar_url,
            twitter_handle=author.twitter_handle,
        )

    @strawberry.mutation
    async def update_author(
        self,
        author_id: str,
        input: AuthorUpdateInput,
        db: AsyncSession = strawberry.field(description="Database session"),
        principal = strawberry.field(description="Current principal"),
    ) -> AuthorType:
        """Update author (editor+ only)."""
        # Check permission
        if not principal or not getattr(principal, "has_permission", lambda x: False)("content.write"):
            raise PermissionError("Insufficient permissions to update author")

        repo = AuthorRepository(db)
        author = await repo.get_by_id(author_id)
        if not author:
            raise ValueError("Author not found")

        # Update fields
        if input.display_name:
            author.display_name = input.display_name
        if input.bio is not None:
            author.bio = input.bio
        if input.avatar_url is not None:
            author.avatar_url = input.avatar_url
        if input.twitter_handle is not None:
            author.twitter_handle = input.twitter_handle

        db.add(author)
        await db.commit()

        return AuthorType(
            id=author.id,
            slug=author.slug,
            display_name=author.display_name,
            bio=author.bio,
            avatar_url=author.avatar_url,
            twitter_handle=author.twitter_handle,
        )

    # -----------------------------------------------------------------------
    # Admin mutations
    # -----------------------------------------------------------------------

    @strawberry.mutation
    async def assign_user_role(
        self,
        user_id: str,
        role_name: str,
        db: AsyncSession = strawberry.field(description="Database session"),
        principal = strawberry.field(description="Current principal"),
    ) -> UserType:
        """Assign role to user (admin only)."""
        # Check permission
        if not principal or not getattr(principal, "has_permission", lambda x: False)("admin.write"):
            raise PermissionError("Insufficient permissions to assign roles")

        service = AdminService(db)
        await service.assign_role(user_id, role_name)
        user = await service.get_user(user_id)

        if not user:
            raise ValueError("User not found")

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
            roles=[],  # Could load roles if needed
        )

    # -----------------------------------------------------------------------
    # AI workflow mutations
    # -----------------------------------------------------------------------

    @strawberry.mutation
    async def review_ai_workflow(
        self,
        workflow_id: str,
        input: AIWorkflowReviewInput,
        db: AsyncSession = strawberry.field(description="Database session"),
        principal = strawberry.field(description="Current principal"),
    ) -> bool:
        """Review and approve/reject AI-generated content (editor+ only)."""
        # Check permission
        if not principal or not getattr(principal, "has_permission", lambda x: False)("ai.review"):
            raise PermissionError("Insufficient permissions to review AI workflows")

        service = AIService(db)
        user_id = getattr(principal, "sub", None)
        await service.review_workflow(workflow_id, input.status, input.review_notes, user_id)
        return True
