"""Service layer for billing and entitlement operations."""

from __future__ import annotations

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.operations import (
    BillingEntitlementOut,
    BillingInvoiceOut,
    BillingPlanOut,
    BillingSubscriptionOut,
)


class BillingService:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def list_plans(self, public_only: bool = True) -> list[BillingPlanOut]:
        query = text(
            """
            SELECT
                id::text AS id,
                name,
                slug,
                description,
                price_monthly_cents,
                price_annual_cents,
                currency,
                COALESCE(features, '[]'::jsonb) AS features,
                trial_days,
                is_active,
                is_public
            FROM billing.plans
            WHERE is_active = TRUE
              AND (:public_only = FALSE OR is_public = TRUE)
            ORDER BY sort_order ASC, name ASC
            """
        )
        result = await self._db.execute(query, {"public_only": public_only})
        return [BillingPlanOut.model_validate(dict(row)) for row in result.mappings().all()]

    async def get_subscription(self, user_id: str) -> BillingSubscriptionOut | None:
        query = text(
            """
            SELECT
                id::text AS id,
                user_id::text AS user_id,
                plan_id::text AS plan_id,
                status,
                provider,
                billing_interval,
                current_period_start,
                current_period_end,
                cancel_at_period_end
            FROM billing.subscriptions
            WHERE user_id = :user_id::uuid
            ORDER BY created_at DESC
            LIMIT 1
            """
        )
        result = await self._db.execute(query, {"user_id": user_id})
        row = result.mappings().one_or_none()
        if row is None:
            return None
        return BillingSubscriptionOut.model_validate(dict(row))

    async def list_entitlements(self, user_id: str) -> list[BillingEntitlementOut]:
        query = text(
            """
            SELECT
                id::text AS id,
                user_id::text AS user_id,
                capability_key,
                scope,
                source,
                granted_at,
                expires_at,
                revoked_at
            FROM billing.entitlements
            WHERE user_id = :user_id::uuid
            ORDER BY granted_at DESC
            """
        )
        result = await self._db.execute(query, {"user_id": user_id})
        return [BillingEntitlementOut.model_validate(dict(row)) for row in result.mappings().all()]

    async def list_invoices(self, user_id: str, limit: int = 20) -> list[BillingInvoiceOut]:
        query = text(
            """
            SELECT
                id::text AS id,
                user_id::text AS user_id,
                amount_cents,
                currency,
                status,
                period_start,
                period_end,
                invoice_url,
                created_at
            FROM billing.invoice_records
            WHERE user_id = :user_id::uuid
            ORDER BY created_at DESC
            LIMIT :limit
            """
        )
        result = await self._db.execute(query, {"user_id": user_id, "limit": limit})
        return [BillingInvoiceOut.model_validate(dict(row)) for row in result.mappings().all()]
