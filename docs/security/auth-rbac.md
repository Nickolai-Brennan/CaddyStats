# Authentication, Authorization, and RBAC

## Purpose

This document defines the baseline authentication and authorization model for Caddy Stats, including role expectations, secrets handling, and logging/redaction rules.

## Authentication Model

## Primary approach

- JWT-based authentication for application sessions
- backend-issued tokens after successful login or verified external auth callback
- short-lived access tokens with revocable refresh/session controls
- server-side entitlement checks for premium features

## Account types

- **public**: unauthenticated visitor
- **member**: authenticated free user
- **subscriber**: authenticated paid user with premium entitlements
- **analyst**: internal user with data/model review capabilities
- **editor**: internal user with content workflow capabilities
- **admin**: internal user with operational and access-management capabilities
- **owner**: restricted break-glass administrative role for platform governance

## Authentication requirements

- all authenticated routes must verify token signature, expiry, and account status
- refresh/session revocation must be supported for compromised accounts
- privileged routes must require explicit backend authorization checks
- internal tools must not rely on client-only gating
- GraphQL playground or similar exploratory tooling must be disabled in production

## Authorization Model

Authorization is a combination of:

1. **role-based access control** for broad responsibility areas
2. **entitlements** for paid feature access
3. **resource state checks** for workflow actions such as publish, review, or override

Rules:

- premium access is never granted only by frontend state
- internal privileges are role-based, not subscription-based
- sensitive actions should check both role and action-specific permission
- owner/admin privileges should be narrowly assigned and auditable

## Baseline RBAC Matrix

| Capability | Public | Member | Subscriber | Analyst | Editor | Admin | Owner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| View public pages | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Save account preferences | No | Yes | Yes | Yes | Yes | Yes | Yes |
| View premium projections | No | Limited/No | Yes | Yes | As needed | Yes | Yes |
| View model-performance dashboards | No | No | Limited summary only if productized | Yes | Limited | Yes | Yes |
| Create article drafts | No | No | No | No | Yes | Yes | Yes |
| Review/publish articles | No | No | No | No | Yes, by workflow policy | Yes | Yes |
| Use AI editorial assist | No | No | No | Optional product feature only | Yes | Yes | Yes |
| Manage users and roles | No | No | No | No | No | Yes | Yes |
| Manage subscriptions and overrides | No | No | No | No | No | Yes | Yes |
| Manage provider/admin settings | No | No | No | Limited diagnostics only | No | Yes | Yes |
| View audit logs | No | No | No | Scoped | Scoped | Yes | Yes |

## Permission Families

Suggested permission families:

- `content.read`, `content.write`, `content.review`, `content.publish`
- `stats.read_public`, `stats.read_internal`
- `projection.view_premium`, `projection.review_internal`
- `model.review`, `model.compare`, `model.override_visibility`
- `subscription.read`, `subscription.manage`
- `user.read`, `user.manage`, `role.assign`
- `audit.read`, `audit.export`
- `admin.settings`

## Secrets Handling Policy

- secrets must be stored in environment variables or managed secret stores
- `.env.example` may document required variables, but real values must never be committed
- secrets must never appear in frontend bundles, client logs, screenshots, or analytics payloads
- provider credentials should be scoped per environment and rotated on compromise or role change
- production access to secrets should be limited to required services and a minimal set of operators

## Logging and Redaction Policy

### Never log

- raw passwords
- JWT signing secrets or refresh tokens
- provider API keys
- payment credentials
- full prompt payloads when they include sensitive internal context
- full personal or billing payloads when summaries are sufficient

### Redaction requirements

- token-like values should be masked in application logs
- user identifiers in audit logs should prefer internal IDs over sensitive profile fields
- provider payloads should be summarized when full raw bodies are not operationally required
- failed auth events should preserve forensic value without exposing credentials

### Audit logging expectations

Audit logs are required for:

- login, logout, and suspicious auth events
- role and permission changes
- subscription overrides and entitlement changes
- content publish/unpublish and review actions
- AI-assisted generation, review, and rejection actions
- sensitive admin configuration changes

## Operational Security Guidance

- enforce HTTPS in production
- rate-limit auth, AI, and expensive analytics endpoints
- sanitize rich content inputs and escape rendered output where appropriate
- separate public, internal, and administrative routes logically
- require explicit review paths for high-risk AI-assisted betting or performance claims
- keep operational access on a least-privilege basis

## Incident Response Expectations

- compromised credentials trigger token/session revocation and secret rotation as appropriate
- suspicious admin activity should be traceable through audit logs
- premium entitlement disputes should be diagnosable from billing and access events
- security-sensitive decisions should be documented through ADRs or operational runbooks when they affect platform architecture
