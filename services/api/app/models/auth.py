"""SQLAlchemy ORM models — auth schema."""

from __future__ import annotations

from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class Role(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "roles"
    __table_args__ = {"schema": "auth"}

    name: Mapped[str] = mapped_column(String(64), nullable=False, unique=True)
    description: Mapped[str | None] = mapped_column(Text)
    is_system: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="FALSE")

    permissions: Mapped[list[Permission]] = relationship(
        secondary="auth.role_permissions", back_populates="roles", lazy="selectin"
    )
    users: Mapped[list[User]] = relationship(
        secondary="auth.role_assignments", back_populates="roles", lazy="noload"
    )


class Permission(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "permissions"
    __table_args__ = {"schema": "auth"}

    key: Mapped[str] = mapped_column(String(128), nullable=False, unique=True)
    description: Mapped[str | None] = mapped_column(Text)

    roles: Mapped[list[Role]] = relationship(
        secondary="auth.role_permissions", back_populates="permissions", lazy="noload"
    )


class RolePermission(Base):
    __tablename__ = "role_permissions"
    __table_args__ = (
        UniqueConstraint("role_id", "permission_id"),
        {"schema": "auth"},
    )

    role_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("auth.roles.id", ondelete="CASCADE"), primary_key=True
    )
    permission_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("auth.permissions.id", ondelete="CASCADE"), primary_key=True
    )


class User(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "users"
    __table_args__ = {"schema": "auth"}

    email: Mapped[str] = mapped_column(String(320), nullable=False, unique=True)
    username: Mapped[str | None] = mapped_column(String(64), unique=True)
    display_name: Mapped[str | None] = mapped_column(String(128))
    password_hash: Mapped[str | None] = mapped_column(String(255))
    auth_provider: Mapped[str] = mapped_column(String(32), nullable=False, server_default="'email'")
    auth_provider_id: Mapped[str | None] = mapped_column(String(255))
    account_status: Mapped[str] = mapped_column(String(32), nullable=False, server_default="'active'")
    email_verified: Mapped[bool] = mapped_column(Boolean, nullable=False, server_default="FALSE")
    avatar_url: Mapped[str | None] = mapped_column(Text)
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    roles: Mapped[list[Role]] = relationship(
        secondary="auth.role_assignments", back_populates="users", lazy="selectin"
    )
    sessions: Mapped[list[Session]] = relationship(
        back_populates="user", cascade="all, delete-orphan", lazy="noload"
    )

    @property
    def permission_keys(self) -> set[str]:
        keys: set[str] = set()
        for role in self.roles:
            for perm in role.permissions:
                keys.add(perm.key)
        return keys

    def has_permission(self, key: str) -> bool:
        return key in self.permission_keys

    def has_role(self, name: str) -> bool:
        return any(r.name == name for r in self.roles)


class RoleAssignment(Base, TimestampMixin):
    __tablename__ = "role_assignments"
    __table_args__ = (
        UniqueConstraint("user_id", "role_id"),
        {"schema": "auth"},
    )

    user_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("auth.users.id", ondelete="CASCADE"), primary_key=True
    )
    role_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("auth.roles.id", ondelete="CASCADE"), primary_key=True
    )
    granted_by: Mapped[str | None] = mapped_column(UUID(as_uuid=False))


class Session(Base, UUIDPrimaryKeyMixin):
    __tablename__ = "sessions"
    __table_args__ = {"schema": "auth"}

    user_id: Mapped[str] = mapped_column(
        UUID(as_uuid=False), ForeignKey("auth.users.id", ondelete="CASCADE"), nullable=False
    )
    token_hash: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    refresh_token_hash: Mapped[str | None] = mapped_column(String(255), unique=True)
    ip_address: Mapped[str | None] = mapped_column(String(45))
    user_agent: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    user: Mapped[User] = relationship(back_populates="sessions", lazy="noload")
