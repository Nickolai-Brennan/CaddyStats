"""SQLAlchemy ORM models — content schema."""

from __future__ import annotations

from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, SmallInteger, String, Text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class Author(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "authors"
    __table_args__ = {"schema": "content"}

    user_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False), ForeignKey("auth.users.id", ondelete="SET NULL")
    )
    slug: Mapped[str] = mapped_column(String(128), nullable=False, unique=True)
    display_name: Mapped[str] = mapped_column(String(128), nullable=False)
    bio: Mapped[str | None] = mapped_column(Text)
    avatar_url: Mapped[str | None] = mapped_column(Text)
    twitter_handle: Mapped[str | None] = mapped_column(String(64))

    articles: Mapped[list[Article]] = relationship(back_populates="author", lazy="noload")


class Tag(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "tags"
    __table_args__ = {"schema": "content"}

    slug: Mapped[str] = mapped_column(String(128), nullable=False, unique=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)


class Template(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "templates"
    __table_args__ = {"schema": "content"}

    slug: Mapped[str] = mapped_column(String(128), nullable=False, unique=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    block_schema: Mapped[dict | None] = mapped_column(JSONB)
    metadata_defaults: Mapped[dict | None] = mapped_column(JSONB)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="TRUE")


class Article(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "articles"
    __table_args__ = {"schema": "content"}

    author_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("content.authors.id", ondelete="RESTRICT"), nullable=False
    )
    template_id: Mapped[str | None] = mapped_column(
        UUID(as_uuid=False), ForeignKey("content.templates.id", ondelete="SET NULL")
    )
    slug: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    title: Mapped[str] = mapped_column(String(512), nullable=False)
    summary: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(String(32), nullable=False, server_default="'draft'")
    publish_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    unpublish_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    # SEO
    canonical_url: Mapped[str | None] = mapped_column(Text)
    seo_title: Mapped[str | None] = mapped_column(String(512))
    seo_description: Mapped[str | None] = mapped_column(String(512))
    og_image_url: Mapped[str | None] = mapped_column(Text)
    schema_org_type: Mapped[str | None] = mapped_column(String(64))

    # Golf entity links (enforced at app layer — cross-schema)
    tournament_id: Mapped[str | None] = mapped_column(UUID(as_uuid=False))
    course_id: Mapped[str | None] = mapped_column(UUID(as_uuid=False))
    player_id: Mapped[str | None] = mapped_column(UUID(as_uuid=False))

    # Metadata
    word_count: Mapped[int | None] = mapped_column(Integer)
    read_time_minutes: Mapped[int | None] = mapped_column(SmallInteger)
    ai_assisted: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="FALSE")
    review_notes: Mapped[str | None] = mapped_column(Text)

    author: Mapped[Author] = relationship(back_populates="articles", lazy="joined")
    template: Mapped[Template | None] = relationship(lazy="joined")
    blocks: Mapped[list[ArticleBlock]] = relationship(
        back_populates="article",
        order_by="ArticleBlock.order_index",
        lazy="selectin",
        cascade="all, delete-orphan",
    )
    article_tags: Mapped[list[ArticleTag]] = relationship(
        back_populates="article", lazy="selectin", cascade="all, delete-orphan"
    )

    @property
    def tags(self) -> list[Tag]:
        return [at.tag for at in self.article_tags if at.tag is not None]


class ArticleBlock(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "article_blocks"
    __table_args__ = {"schema": "content"}

    article_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("content.articles.id", ondelete="CASCADE"), nullable=False
    )
    block_type: Mapped[str] = mapped_column(String(64), nullable=False)
    order_index: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    content: Mapped[dict | None] = mapped_column(JSONB)

    article: Mapped[Article] = relationship(back_populates="blocks", lazy="noload")


class ArticleTag(Base):
    __tablename__ = "article_tags"
    __table_args__ = {"schema": "content"}

    article_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("content.articles.id", ondelete="CASCADE"), primary_key=True
    )
    tag_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("content.tags.id", ondelete="CASCADE"), primary_key=True
    )

    article: Mapped[Article] = relationship(back_populates="article_tags", lazy="noload")
    tag: Mapped[Tag] = relationship(lazy="joined")
