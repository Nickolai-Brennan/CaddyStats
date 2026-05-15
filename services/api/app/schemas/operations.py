"""Pydantic schemas for operational API domains (AI, billing, admin, stats ops)."""

from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class StatsOverviewOut(BaseModel):
    active_players: int
    active_tournaments: int
    publishable_projections: int
    open_markets: int


class AIWorkflowRunIn(BaseModel):
    workflow_name: str = Field(min_length=3, max_length=64)
    prompt_version_id: str | None = None
    input_summary: dict = Field(default_factory=dict)
    model_identifier: str = Field(default="gpt-5.3-codex", min_length=2, max_length=128)


class AIWorkflowRunOut(BaseModel):
    workflow_id: str
    workflow_name: str
    status: str
    created_at: datetime


class AIWorkflowStatusOut(BaseModel):
    workflow_id: str
    workflow_name: str
    grounding_status: str
    output_status: str
    reviewer_state: str
    model_identifier: str
    created_at: datetime


class BillingPlanOut(BaseModel):
    id: str
    name: str
    slug: str
    description: str | None = None
    price_monthly_cents: int
    price_annual_cents: int
    currency: str
    features: list[str] = Field(default_factory=list)
    trial_days: int
    is_active: bool
    is_public: bool


class BillingSubscriptionOut(BaseModel):
    id: str
    user_id: str
    plan_id: str
    status: str
    provider: str
    billing_interval: str
    current_period_start: datetime | None = None
    current_period_end: datetime | None = None
    cancel_at_period_end: bool


class BillingEntitlementOut(BaseModel):
    id: str
    user_id: str
    capability_key: str
    scope: str | None = None
    source: str
    granted_at: datetime
    expires_at: datetime | None = None
    revoked_at: datetime | None = None


class BillingInvoiceOut(BaseModel):
    id: str
    user_id: str
    amount_cents: int
    currency: str
    status: str
    period_start: datetime | None = None
    period_end: datetime | None = None
    invoice_url: str | None = None
    created_at: datetime


class AdminUserOut(BaseModel):
    id: str
    email: str
    username: str | None = None
    display_name: str | None = None
    account_status: str
    roles: list[str] = Field(default_factory=list)


class AdminRoleAssignmentIn(BaseModel):
    user_id: str
    role_name: str


class AdminRoleAssignmentOut(BaseModel):
    user_id: str
    role_name: str
    status: str


class AdminEventOut(BaseModel):
    id: str
    event_type: str
    provider: str
    created_at: datetime
    processed_at: datetime | None = None
    processing_error: str | None = None
