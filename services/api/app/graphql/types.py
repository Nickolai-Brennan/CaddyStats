"""Strawberry GraphQL types — editorial, admin, and dashboard domain."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

import strawberry


# ---------------------------------------------------------------------------
# Content domain
# ---------------------------------------------------------------------------


@strawberry.type
class TagType:
    """Golf tag (e.g., equipment, technique, course management)."""

    id: str
    slug: str
    name: str
    description: Optional[str] = None


@strawberry.type
class AuthorType:
    """Editorial author."""

    id: str
    slug: str
    display_name: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    twitter_handle: Optional[str] = None


@strawberry.type
class TemplateType:
    """Article template for structured content blocks."""

    id: str
    slug: str
    name: str
    description: Optional[str] = None
    block_schema: Optional[dict] = None
    metadata_defaults: Optional[dict] = None
    is_active: bool


@strawberry.type
class ArticleBlockType:
    """Nested article block (text, image, quote, data, etc.)."""

    id: str
    block_type: str
    order_index: int
    content: Optional[dict] = None


@strawberry.type
class ArticleType:
    """Editorial article with full metadata and nested blocks."""

    id: str
    slug: str
    title: str
    summary: Optional[str] = None
    status: str
    canonical_url: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    og_image_url: Optional[str] = None
    schema_org_type: Optional[str] = None
    tournament_id: Optional[str] = None
    course_id: Optional[str] = None
    player_id: Optional[str] = None
    word_count: Optional[int] = None
    read_time_minutes: Optional[int] = None
    ai_assisted: bool
    review_notes: Optional[str] = None
    publish_at: Optional[datetime] = None
    unpublish_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    author: AuthorType
    template: Optional[TemplateType] = None
    blocks: list[ArticleBlockType]
    tags: list[TagType]


@strawberry.type
class ArticleListType:
    """Paginated article list for dashboard/discovery."""

    id: str
    slug: str
    title: str
    summary: Optional[str] = None
    status: str
    publish_at: Optional[datetime] = None
    word_count: Optional[int] = None
    read_time_minutes: Optional[int] = None
    ai_assisted: bool
    author: AuthorType
    tags: list[TagType]
    updated_at: datetime


# ---------------------------------------------------------------------------
# Auth domain (admin-gated)
# ---------------------------------------------------------------------------


@strawberry.type
class PermissionType:
    """Access control permission (admin only)."""

    id: str
    key: str
    description: Optional[str] = None


@strawberry.type
class RoleType:
    """User role (admin only)."""

    id: str
    name: str
    description: Optional[str] = None
    is_system: bool
    permissions: list[PermissionType]


@strawberry.type
class UserType:
    """User account (admin only; self-visible limited fields)."""

    id: str
    email: str
    username: Optional[str] = None
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    account_status: str
    email_verified: bool
    last_login_at: Optional[datetime] = None
    created_at: datetime
    roles: list[RoleType]


# ---------------------------------------------------------------------------
# Billing domain
# ---------------------------------------------------------------------------


@strawberry.type
class BillingPlanType:
    """Subscription plan (public)."""

    id: str
    slug: str
    name: str
    description: Optional[str] = None
    price_usd_cents: int
    billing_period_days: int
    features: dict


@strawberry.type
class EntitlementType:
    """Feature entitlement for a user."""

    id: str
    user_id: str
    feature_key: str
    expires_at: Optional[datetime] = None
    granted_at: datetime


@strawberry.type
class SubscriptionType:
    """Active user subscription."""

    id: str
    user_id: str
    plan: BillingPlanType
    started_at: datetime
    renews_at: Optional[datetime] = None
    canceled_at: Optional[datetime] = None
    entitlements: list[EntitlementType]


# ---------------------------------------------------------------------------
# AI workflows domain
# ---------------------------------------------------------------------------


@strawberry.type
class AIPromptVersionType:
    """Versioned AI prompt for editorial workflows."""

    id: str
    version: int
    prompt_text: str
    use_case: str
    model_name: str
    created_at: datetime


@strawberry.type
class AIOutputLogType:
    """Logged AI-generated output for editorial review."""

    id: str
    workflow_id: str
    prompt_version_id: str
    input_context: dict
    output_text: str
    model_tokens_used: int
    generated_at: datetime
    status: str


@strawberry.type
class AIWorkflowType:
    """Editorial AI workflow status and history."""

    id: str
    article_id: Optional[str] = None
    workflow_type: str
    status: str
    input_params: dict
    output_logs: list[AIOutputLogType]
    prompt_versions: list[AIPromptVersionType]
    review_notes: Optional[str] = None
    reviewed_at: Optional[datetime] = None
    reviewed_by_user_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime


# ---------------------------------------------------------------------------
# Dashboard aggregates
# ---------------------------------------------------------------------------


@strawberry.type
class DashboardStatsType:
    """Editorial dashboard summary statistics."""

    total_articles: int
    draft_count: int
    published_count: int
    ai_assisted_count: int
    average_read_time_minutes: Optional[float]
    total_word_count: int
    authors_count: int


@strawberry.type
class RecentActivityType:
    """Recent editorial activity for dashboard."""

    article_id: str
    article_title: str
    action: str
    actor_name: str
    occurred_at: datetime


# ---------------------------------------------------------------------------
# Input types for mutations
# ---------------------------------------------------------------------------


@strawberry.input
class ArticleBlockInput:
    """Input for creating/updating article block."""

    block_type: str
    order_index: int
    content: Optional[dict] = None


@strawberry.input
class ArticleCreateInput:
    """Input for creating article."""

    author_id: str
    slug: str
    title: str
    summary: Optional[str] = None
    status: str = "draft"
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    og_image_url: Optional[str] = None
    template_id: Optional[str] = None
    tournament_id: Optional[str] = None
    course_id: Optional[str] = None
    player_id: Optional[str] = None
    tag_ids: list[str] = strawberry.field(default_factory=list)
    blocks: list[ArticleBlockInput] = strawberry.field(default_factory=list)


@strawberry.input
class ArticleUpdateInput:
    """Input for updating article."""

    title: Optional[str] = None
    summary: Optional[str] = None
    status: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    og_image_url: Optional[str] = None
    tag_ids: Optional[list[str]] = None
    blocks: Optional[list[ArticleBlockInput]] = None


@strawberry.input
class AuthorCreateInput:
    """Input for creating author."""

    display_name: str
    slug: str
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    twitter_handle: Optional[str] = None


@strawberry.input
class AuthorUpdateInput:
    """Input for updating author."""

    display_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    twitter_handle: Optional[str] = None


@strawberry.input
class AIWorkflowReviewInput:
    """Input for reviewing AI workflow output."""

    status: str
    review_notes: Optional[str] = None
