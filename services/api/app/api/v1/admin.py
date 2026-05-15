"""API routes — admin operations."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.dependencies.auth import require_permission
from app.schemas.operations import AdminEventOut, AdminRoleAssignmentIn, AdminRoleAssignmentOut, AdminUserOut
from app.services.admin import AdminService

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get(
    "/users",
    response_model=list[AdminUserOut],
    dependencies=[Depends(require_permission("user.manage"))],
)
async def list_users(
    db: Annotated[AsyncSession, Depends(get_db_session)],
    limit: int = Query(default=100, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    q: str | None = Query(default=None),
) -> list[AdminUserOut]:
    return await AdminService(db).list_users(limit=limit, offset=offset, q=q)


@router.post(
    "/users/roles",
    response_model=AdminRoleAssignmentOut,
    dependencies=[Depends(require_permission("user.manage"))],
)
async def assign_role(
    payload: AdminRoleAssignmentIn,
    db: Annotated[AsyncSession, Depends(get_db_session)],
) -> AdminRoleAssignmentOut:
    result = await AdminService(db).assign_role(payload.user_id, payload.role_name)
    await db.commit()
    return result


@router.get(
    "/billing/events",
    response_model=list[AdminEventOut],
    dependencies=[Depends(require_permission("billing.manage"))],
)
async def list_billing_events(
    db: Annotated[AsyncSession, Depends(get_db_session)],
    limit: int = Query(default=100, ge=1, le=500),
) -> list[AdminEventOut]:
    return await AdminService(db).list_billing_events(limit=limit)
