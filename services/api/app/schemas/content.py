"""Pydantic schemas — content domain."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Tag
# ---------------------------------------------------------------------------

class TagOut(BaseModel):
    id: str
    slug: str
    name: str
    description: str | None = None

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Author
# ---------------------------------------------------------------------------

class AuthorOut(BaseModel):
    id: str
    slug: str
    display_name: str
    bio: str | None = None
    avatar_url: str | None = None
    twitter_handle: str | None = None

    model_config = {"from_attributes": True}


class TemplateOut(BaseModel):
    id: str
    slug: str
    name: str
    description: str | None = None
    block_schema: dict | None = None
    metadata_defaults: dict | None = None
    is_active: bool

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Article block
# ---------------------------------------------------------------------------

class ArticleBlockOut(BaseModel):
    id: str
    block_type: str
    order_index: int
    content: dict | None = None

    model_config = {"from_attributes": True}


class ArticleBlockIn(BaseModel):
    block_type: str = Field(max_length=64)
    order_index: int = Field(ge=0)
    content: dict | None = None


# ---------------------------------------------------------------------------
# Article
# ---------------------------------------------------------------------------

class ArticleListOut(BaseModel):
    id: str
    slug: str
    title: str
    summary: str | None = None
    status: str
    publish_at: datetime | None = None
    word_count: int | None = None
    read_time_minutes: int | None = None
    ai_assisted: bool
    author: AuthorOut
    tags: list[TagOut] = []
    updated_at: datetime

    model_config = {"from_attributes": True}


class ArticleOut(ArticleListOut):
    canonical_url: str | None = None
    seo_title: str | None = None
    seo_description: str | None = None
    og_image_url: str | None = None
    schema_org_type: str | None = None
    tournament_id: str | None = None
    course_id: str | None = None
    player_id: str | None = None
    blocks: list[ArticleBlockOut] = []
    created_at: datetime

    model_config = {"from_attributes": True}


class ArticleCreateIn(BaseModel):
    author_id: str
    template_id: str | None = None
    slug: str = Field(max_length=255, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    title: str = Field(max_length=512)
    summary: str | None = None
    status: str = Field(default="draft")
    seo_title: str | None = Field(default=None, max_length=512)
    seo_description: str | None = Field(default=None, max_length=512)
    og_image_url: str | None = None
    tournament_id: str | None = None
    course_id: str | None = None
    player_id: str | None = None
    tag_ids: list[str] = []
    blocks: list[ArticleBlockIn] = []


class ArticleUpdateIn(BaseModel):
    title: str | None = Field(default=None, max_length=512)
    summary: str | None = None
    status: str | None = None
    seo_title: str | None = Field(default=None, max_length=512)
    seo_description: str | None = Field(default=None, max_length=512)
    og_image_url: str | None = None
    tag_ids: list[str] | None = None
    blocks: list[ArticleBlockIn] | None = None


# ---------------------------------------------------------------------------
# Query params
# ---------------------------------------------------------------------------

class ArticleQueryParams(BaseModel):
    status: str | None = None
    author_slug: str | None = None
    tag_slug: str | None = None
    q: str | None = Field(default=None, description="Title/summary full-text search")
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)
