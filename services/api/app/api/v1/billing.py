"""API routes — billing domain."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.dependencies.auth import get_current_user
from app.models.auth import User
from app.schemas.operations import (
    BillingEntitlementOut,
    BillingInvoiceOut,
    BillingPlanOut,
    BillingSubscriptionOut,
)
from app.services.billing import BillingService

router = APIRouter(prefix="/billing", tags=["billing"])


@router.get("/plans", response_model=list[BillingPlanOut])
async def list_plans(
    db: Annotated[AsyncSession, Depends(get_db_session)],
    public_only: bool = Query(default=True),
) -> list[BillingPlanOut]:
    return await BillingService(db).list_plans(public_only=public_only)


@router.get("/me/subscription", response_model=BillingSubscriptionOut | None)
async def get_my_subscription(
    db: Annotated[AsyncSession, Depends(get_db_session)],
    user: Annotated[User, Depends(get_current_user)],
) -> BillingSubscriptionOut | None:
    return await BillingService(db).get_subscription(str(user.id))


@router.get("/me/entitlements", response_model=list[BillingEntitlementOut])
async def get_my_entitlements(
    db: Annotated[AsyncSession, Depends(get_db_session)],
    user: Annotated[User, Depends(get_current_user)],
) -> list[BillingEntitlementOut]:
    return await BillingService(db).list_entitlements(str(user.id))


@router.get("/me/invoices", response_model=list[BillingInvoiceOut])
async def get_my_invoices(
    db: Annotated[AsyncSession, Depends(get_db_session)],
    user: Annotated[User, Depends(get_current_user)],
    limit: int = Query(default=20, ge=1, le=100),
) -> list[BillingInvoiceOut]:
    return await BillingService(db).list_invoices(str(user.id), limit=limit)
