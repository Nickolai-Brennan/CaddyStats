Phase 10 — Admin Systems

Phase Objective

Build the internal administration system for Caddy Stats, including user management, roles, subscriptions, content oversight, AI audit review, data operations, feature flags, system health, and platform governance controls.


---

10.1 Admin Architecture

App Location

apps/admin/

Purpose

The admin app manages:

users

roles and permissions

subscriptions

editorial oversight

AI audit logs

data ingestion monitoring

model runs

feature flags

system health

platform settings



---

10.2 Admin Folder Structure

apps/admin/
│
├── public/
├── src/
│   ├── api/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── layouts/
│   ├── pages/
│   ├── routes/
│   ├── state/
│   ├── styles/
│   ├── types/
│   └── utils/
│
├── vite.config.ts
├── tsconfig.json
└── package.json


---

10.3 Admin Feature Modules

src/features/
├── dashboard/
├── users/
├── roles/
├── subscriptions/
├── content/
├── ai-audit/
├── ingestion/
├── analytics-models/
├── feature-flags/
├── system-health/
├── audit-logs/
├── billing/
└── settings/


---

10.4 Admin Routes

/admin
/admin/users
/admin/users/:userId
/admin/roles
/admin/subscriptions
/admin/content
/admin/content/:articleId
/admin/ai-audit
/admin/ingestion
/admin/models
/admin/feature-flags
/admin/system-health
/admin/audit-logs
/admin/billing
/admin/settings


---

10.5 Admin Permissions

Required Roles

super_admin
admin
editor_admin
data_admin
billing_admin
support_admin
readonly_admin

Permission Examples

admin:access
users:read
users:update
roles:manage
subscriptions:manage
content:review
ai_audit:read
ingestion:manage
models:trigger
feature_flags:update
billing:refund
system_health:read


---

10.6 User Management

src/features/users/
├── UserListPage.tsx
├── UserDetailPage.tsx
├── UserStatusBadge.tsx
├── UserRoleEditor.tsx
├── UserSubscriptionPanel.tsx
├── UserAuditTrail.tsx
└── UserSearchFilters.tsx

Required Capabilities

view users

search users

filter by role/status/subscription

suspend users

assign roles

reset MFA/session state

view audit trail

view subscription status



---

10.7 Role & Permission Management

src/features/roles/
├── RoleListPage.tsx
├── RoleEditor.tsx
├── PermissionMatrix.tsx
├── PermissionGroup.tsx
└── RoleAuditTrail.tsx

Requirements

role list

permission matrix

role assignment history

protected super_admin role

no self-demotion without secondary admin



---

10.8 Subscription Admin

src/features/subscriptions/
├── SubscriptionListPage.tsx
├── SubscriptionDetailPage.tsx
├── PlanBadge.tsx
├── ManualAccessGrant.tsx
├── SubscriptionHistory.tsx
└── CancellationReasonPanel.tsx

Requirements

view plan status

view payment status

grant temporary access

revoke access

inspect cancellation reasons

sync billing provider state

audit all admin changes



---

10.9 Billing Admin

src/features/billing/
├── BillingDashboard.tsx
├── InvoiceList.tsx
├── RefundPanel.tsx
├── PaymentFailurePanel.tsx
├── RevenueSummary.tsx
└── BillingSyncStatus.tsx

Rules

never store raw card data

billing actions require elevated permission

refunds require audit reason

provider webhooks are source of truth



---

10.10 Content Oversight

src/features/content/
├── ContentQueuePage.tsx
├── ArticleReviewPanel.tsx
├── SeoQualityPanel.tsx
├── PublishStatusBadge.tsx
├── ContentAuditTrail.tsx
└── ForceUnpublishDialog.tsx

Capabilities

view all articles

filter by workflow state

inspect SEO readiness

inspect AI-generated blocks

force unpublish

lock article editing

view revision history



---

10.11 AI Audit Admin

src/features/ai-audit/
├── AiGenerationList.tsx
├── AiGenerationDetail.tsx
├── ValidationStatusBadge.tsx
├── GroundingSourceViewer.tsx
├── HallucinationFlagList.tsx
├── TokenUsageTable.tsx
└── ModelCostSummary.tsx

Capabilities

inspect AI generations

view prompts and versions

view grounding sources

view validation failures

view hallucination flags

monitor token cost

filter by model/domain/user



---

10.12 Data Ingestion Admin

src/features/ingestion/
├── IngestionDashboard.tsx
├── IngestionJobTable.tsx
├── SourceStatusPanel.tsx
├── IngestionFailureDetail.tsx
├── RetryJobButton.tsx
└── SourceMappingEditor.tsx

Capabilities

view ingestion jobs

inspect source payloads

retry failed jobs

disable source

inspect mapping rules

track last successful ingestion

view stale data warnings



---

10.13 Analytics Model Admin

src/features/analytics-models/
├── ModelRunDashboard.tsx
├── ModelVersionTable.tsx
├── ProjectionRunDetail.tsx
├── SimulationRunDetail.tsx
├── TriggerModelRunButton.tsx
└── ModelPerformancePanel.tsx

Capabilities

view model versions

inspect projection runs

inspect simulation outputs

compare model performance

trigger recalculation

rollback active model version

view stale projection warnings



---

10.14 Feature Flags Admin

src/features/feature-flags/
├── FeatureFlagList.tsx
├── FeatureFlagEditor.tsx
├── EnvironmentToggle.tsx
├── RolloutPercentageSlider.tsx
└── FeatureFlagAuditTrail.tsx

Required Flags

premium_dashboard_enabled

ai_editor_assist_enabled

betting_edges_enabled

public_projections_enabled

new_rankings_model_enabled

editor_workflow_enabled



---

10.15 System Health Dashboard

src/features/system-health/
├── SystemHealthDashboard.tsx
├── ApiStatusCard.tsx
├── DatabaseStatusCard.tsx
├── RedisStatusCard.tsx
├── WorkerQueueCard.tsx
├── AiCostCard.tsx
├── CacheHitRateCard.tsx
└── DeploymentStatusCard.tsx

Required Metrics

API latency

error rate

database status

Redis status

worker queue depth

failed jobs

AI token usage

cache hit rate

latest deployment

backup status



---

10.16 Audit Logs

src/features/audit-logs/
├── AuditLogTable.tsx
├── AuditLogFilters.tsx
├── AuditLogDetailDrawer.tsx
└── ExportAuditLogsButton.tsx

Required Events

login

failed login

role change

subscription change

article publish/unpublish

AI generation

model recalculation

feature flag update

billing action

admin setting change



---

10.17 Admin API Endpoints

REST

GET    /api/v1/admin/health
GET    /api/v1/admin/users
GET    /api/v1/admin/users/{user_id}
PATCH  /api/v1/admin/users/{user_id}
GET    /api/v1/admin/subscriptions
PATCH  /api/v1/admin/subscriptions/{subscription_id}
GET    /api/v1/admin/ingestion/jobs
POST   /api/v1/admin/ingestion/jobs/{job_id}/retry
GET    /api/v1/admin/models/runs
POST   /api/v1/admin/models/run
GET    /api/v1/admin/audit-logs
GET    /api/v1/admin/system-health

GraphQL

Use GraphQL for:

content review

workflow state inspection

AI generation detail

role/permission matrix

admin dashboard composition



---

10.18 Admin Table Standards

Required Table Features

server-side pagination

sorting

filtering

column visibility

CSV export where authorized

audit-safe row actions

loading/empty/error states



---

10.19 Admin Security

Required Controls

admin route protection

RBAC on every admin endpoint

MFA-ready user model

audit logs for all mutations

elevated permissions for billing and roles

IP allowlist support for sensitive routes

no GraphQL playground in production

CSRF strategy for cookie-based auth if used



---

10.20 Admin Observability

Required Signals

admin login activity

failed admin access attempts

permission denied events

billing action events

model trigger events

feature flag changes

high-risk mutations



---

10.21 Admin Testing

apps/admin/src/tests/
├── users.test.tsx
├── roles.test.tsx
├── subscriptions.test.tsx
├── content-review.test.tsx
├── ai-audit.test.tsx
├── ingestion.test.tsx
├── system-health.test.tsx
└── feature-flags.test.tsx

Required Backend Tests

services/api/tests/admin/
├── test_admin_users.py
├── test_admin_roles.py
├── test_admin_subscriptions.py
├── test_admin_ai_audit.py
├── test_admin_ingestion.py
├── test_admin_models.py
├── test_admin_feature_flags.py
└── test_admin_audit_logs.py


---

10.22 Admin Documentation

docs/admin/
├── admin-overview.md
├── user-management.md
├── role-management.md
├── subscription-admin.md
├── content-oversight.md
├── ai-audit.md
├── ingestion-admin.md
├── model-admin.md
├── feature-flags.md
└── audit-logs.md


---

Phase 10 Validation Checklist

Architecture

[ ] Admin app scaffolded

[ ] Feature modules created

[ ] Admin routing configured

[ ] Admin layout implemented


Security

[ ] Admin RBAC enforced

[ ] High-risk actions audited

[ ] Billing actions permission-gated

[ ] Role mutation safeguards added


Users

[ ] User list implemented

[ ] User detail implemented

[ ] Role editor implemented

[ ] Subscription panel implemented


Content

[ ] Content review queue implemented

[ ] SEO readiness visible

[ ] AI-generated blocks inspectable

[ ] Force unpublish flow audited


AI

[ ] AI generation logs visible

[ ] Prompt versions visible

[ ] Grounding sources visible

[ ] Hallucination flags visible


Data

[ ] Ingestion jobs visible

[ ] Failed jobs retryable

[ ] Model runs inspectable

[ ] Feature flags editable


System

[ ] Health dashboard implemented

[ ] Audit logs searchable

[ ] Admin metrics emitted



---

Phase 10 Exit Condition

Phase 10 is complete only when:

Admin app is operational

User and role management are secure

Subscription and billing admin tools exist

Content oversight is centralized

AI audit tools are available

Ingestion and model runs are manageable

Feature flags are editable

System health is visible

All admin mutations are audited

RBAC protects every admin route and endpoint


Only after completion may Phase 11 Integrations begin.
