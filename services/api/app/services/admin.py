"""Service layer for admin operations."""

from __future__ import annotations

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.auth import UserRepository
from app.schemas.operations import AdminEventOut, AdminRoleAssignmentOut, AdminUserOut


class AdminService:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db
        self._users = UserRepository(db)

    async def list_users(self, limit: int = 100, offset: int = 0, q: str | None = None) -> list[AdminUserOut]:
        query = text(
            """
            SELECT
                u.id::text AS id,
                u.email,
                u.username,
                u.display_name,
                u.account_status,
                COALESCE(array_agg(r.name) FILTER (WHERE r.name IS NOT NULL), ARRAY[]::text[]) AS roles
            FROM auth.users u
            LEFT JOIN auth.role_assignments ra ON ra.user_id = u.id
            LEFT JOIN auth.roles r ON r.id = ra.role_id
            WHERE (:q IS NULL OR u.email ILIKE :q_like OR COALESCE(u.display_name, '') ILIKE :q_like)
            GROUP BY u.id, u.email, u.username, u.display_name, u.account_status
            ORDER BY u.created_at DESC
            LIMIT :limit OFFSET :offset
            """
        )
        params = {
            "limit": limit,
            "offset": offset,
            "q": q,
            "q_like": f"%{q}%" if q else None,
        }
        result = await self._db.execute(query, params)
        return [AdminUserOut.model_validate(dict(row)) for row in result.mappings().all()]

    async def assign_role(self, user_id: str, role_name: str) -> AdminRoleAssignmentOut:
        await self._users.assign_role(user_id=user_id, role_name=role_name)
        return AdminRoleAssignmentOut(user_id=user_id, role_name=role_name, status="assigned")

    async def list_billing_events(self, limit: int = 100) -> list[AdminEventOut]:
        query = text(
            """
            SELECT
                id::text AS id,
                event_type,
                provider,
                created_at,
                processed_at,
                processing_error
            FROM billing.billing_events
            ORDER BY created_at DESC
            LIMIT :limit
            """
        )
        result = await self._db.execute(query, {"limit": limit})
        return [AdminEventOut.model_validate(dict(row)) for row in result.mappings().all()]
