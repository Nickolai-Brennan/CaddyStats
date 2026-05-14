# Engineering Standards and Governance

Last Updated: 2026-05-13

## Purpose

Define the baseline engineering rules, documentation ownership model, release governance, migration governance, naming conventions, branching strategy, commit standards, code review requirements, and production approval flow for CaddyStats.

This document is a Phase 0 governance artifact and applies across all repository domains unless a more specific approved document or ADR supersedes part of it.

---

## 1. Governance Principles

CaddyStats follows an architecture-first, data-first, and governance-aware delivery model.

All engineering work must align with these principles:

1. Documentation and architectural intent are defined before implementation for material changes.
2. Build order and dependency sequencing must be respected.
3. Production-impacting changes require validation, rollback awareness, and explicit approval.
4. Repository boundaries must remain clear across apps, services, packages, database, workers, AI, infrastructure, and documentation.
5. Security, provenance, and auditability are mandatory for protected, monetized, editorial, and AI-assisted features.
6. Documentation must reflect the current system state after meaningful changes are merged.
7. No workflow should allow unsupported claims, fabricated statistics, or unreviewed AI-authored production content.

---

## 2. Scope

This document governs:

- repository-wide engineering practices
- code and documentation change expectations
- branching and commit conventions
- pull request and review requirements
- release and deployment approvals
- database migration controls
- production change management expectations

This document applies to:

- `apps/`
- `services/`
- `packages/`
- `workers/`
- `database/`
- `infrastructure/`
- `ai/`
- `docs/`
- `scripts/`
- `tests/`
- `config/`
- GitHub workflows and repository governance assets

---

## 3. Engineering Standards

### 3.1 Architecture-First Delivery

For major work, teams must follow this order:

1. confirm alignment to product goals and constraints
2. confirm dependency order against the build plan
3. update relevant documentation and ADRs first where required
4. implement within approved architectural boundaries
5. validate through deterministic checks
6. update changelog and governance references

No dependent implementation should proceed when required upstream architecture, schema, interface, or governance decisions are unresolved.

### 3.2 Boundary Rules

Engineering work must preserve explicit boundaries:

- repositories own database access
- services own business logic
- APIs expose validated contracts
- frontend applications consume stable typed interfaces
- workers execute asynchronous or scheduled workloads
- AI systems must operate through grounded, auditable workflows
- documentation defines intent, constraints, and decision rationale

### 3.3 Quality Baseline

Every material change must aim to preserve or improve:

- correctness
- readability
- testability
- observability
- rollback safety
- least-privilege access
- deterministic validation
- documentation accuracy

### 3.4 Security Baseline

Protected or production-relevant changes must preserve:

- authentication and RBAC controls
- input validation and output sanitization
- secret protection and redaction in logs
- rate limiting where abuse is plausible
- audit logging for privileged or sensitive operations
- explicit approval for production-impacting changes

### 3.5 Data and Editorial Integrity

The platform must not publish or expose:

- fabricated statistics
- unsupported betting or projection claims
- AI-generated assertions without grounded sources or review where required
- content that bypasses provenance, editorial, or entitlement controls

---

## 4. Documentation Ownership

### 4.1 Ownership Model

Documentation ownership follows the owning engineering domain.

Default ownership mapping:

- `apps/` → frontend owner
- `services/` → backend owner
- `packages/` → shared platform owner or relevant consuming domain owner
- `workers/` → backend/platform owner
- `database/` → database owner
- `infrastructure/` → platform/DevOps owner
- `ai/` → AI systems owner
- `docs/` (including canonical, planning, and archived support material) → documentation owner with domain reviewer support
- `scripts/` → platform owner
- `tests/` → testing owner with affected domain reviewers
- `config/` → platform owner or system architecture owner

If a CODEOWNERS file is introduced later, that file becomes the operational reviewer source of truth while this document remains the governance policy.

### 4.2 Documentation Update Requirement

The owner of the changed domain is responsible for ensuring relevant docs are updated in the same pull request when the change affects:

- architecture
- public or internal API contracts
- database schemas or migration expectations
- environment variables or runtime behavior
- security controls
- deployment or operating procedures
- user-facing workflows
- AI behavior or editorial review requirements

### 4.3 Required Documentation Targets

When applicable, changes must update the closest relevant source first:

- core docs in `docs/core/`
- product docs in `docs/product/`
- architecture docs in `docs/architecture/`
- governance docs in `docs/governance/`
- ADRs in `docs/governance/adr/records/`
- roadmap, security, data, and compliance docs in their matching `docs/` subdirectories
- changelog in `docs/changelog.md`
- workflow/process docs in `docs/workflow.md`
- planning artifacts in `docs/planning/` only when the change is planning-specific

### 4.4 ADR Trigger Rule

An ADR is required when a change introduces or materially revises:

- service boundaries
- architectural patterns
- platform-wide technology choices
- database strategy
- caching strategy
- observability standards
- AI grounding or safety controls
- rendering model changes
- search/indexing strategy
- worker orchestration model
- production deployment topology

### 4.5 Changelog Requirement

Every merged material change must add or update an entry in:

- `docs/changelog.md`

Exceptions may be allowed for trivial, purely internal, or non-behavioral noise changes, but the default expectation is to log meaningful work.

---

## 5. Release Governance

### 5.1 Release Objectives

Release governance exists to ensure that deployed changes are:

- reviewed
- validated
- reversible
- observable
- documented
- approved by the correct owners

### 5.2 Release Classes

Releases should be classified as one of:

- **Patch**: bug fixes, low-risk maintenance, documentation fixes, or non-breaking internal improvements
- **Minor**: backward-compatible features or meaningful capability additions
- **Major**: breaking changes to APIs, schemas, workflows, contracts, or operational expectations

### 5.3 Release Readiness Requirements

A change is not release-ready unless all applicable items are complete:

- relevant documentation updated
- changelog updated
- tests added or updated
- CI passing
- build artifacts validated
- migration impact reviewed when applicable
- environment/config changes documented
- rollback path defined
- affected owners have approved the change

### 5.4 Environment Promotion Expectations

The default promotion flow is:

1. development
2. test/integration
3. staging
4. production

Changes with infrastructure, schema, auth, AI, SEO, or billing impact should not skip staging unless an emergency procedure is invoked.

### 5.5 Release Checklist

Each production-bound release should include:

- release summary
- scope of affected domains
- linked PRs or change set references
- migration notes
- environment variable/config changes
- rollout notes
- smoke test plan
- rollback plan
- approver record

---

## 6. Migration Governance

### 6.1 General Rule

All database schema changes must be applied through approved migrations.

Direct manual production DDL is prohibited except during an emergency procedure with documented justification and follow-up reconciliation.

### 6.2 Migration Standards

Every migration must be:

- source-controlled
- reviewed
- environment-safe
- deterministic
- reversible where feasible
- accompanied by validation guidance for risky operations

### 6.3 Migration Metadata Expectations

Every migration should clearly communicate:

- purpose
- affected schemas, tables, views, indexes, functions, or triggers
- backward-compatibility risk
- rollback or mitigation plan
- data backfill requirements if any
- operational sequencing requirements if any

### 6.4 Immutable History

Applied migration history must be treated as immutable outside local development reset scenarios.

Do not rewrite, replace, or silently modify historical migrations that may already exist in shared or deployed environments.

### 6.5 Expand/Contract Preference

For higher-risk schema evolution, prefer an expand/contract model:

1. add compatible structures first
2. dual-write or backfill if required
3. migrate reads and writes safely
4. remove deprecated structures only after validation

### 6.6 Migration Review Requirements

Schema-impacting changes must include review of:

- index strategy
- query behavior
- lock risk
- data integrity
- materialized view impact
- seed/test compatibility
- downgrade or mitigation path

### 6.7 Production Migration Controls

Production migrations require:

- successful lower-environment validation
- backup/PITR readiness where applicable
- runtime risk acknowledgment
- explicit deploy approval
- post-migration verification steps
- rollback or recovery plan

Large backfills should be separated from schema changes where practical.

---

## 7. Naming Conventions

### 7.1 General Rule

Names must be explicit, descriptive, and domain-oriented.

Avoid unclear abbreviations unless they are widely understood and already standardized in the codebase.

### 7.2 Documentation Naming

Documentation files should use `kebab-case` unless a numbered or special convention is intentionally required.

Examples:

- `project-overview.md`
- `vision-and-goals.md`
- `engineering-standards-and-governance.md`

ADRs must use:

- `ADR-###-short-topic-name.md`

Example:

- `ADR-011-release-governance.md`

### 7.3 Python Naming

Use Python conventions:

- files/modules: `snake_case.py`
- classes: `PascalCase`
- functions: `snake_case`
- variables: `snake_case`
- constants: `UPPER_SNAKE_CASE`

### 7.4 TypeScript and React Naming

Use TypeScript and React conventions:

- React components: `PascalCase.tsx`
- hooks: `useFeatureName.ts`
- utility modules: consistent repo-wide convention, preferably descriptive and stable
- types/interfaces: `PascalCase`
- constants: `UPPER_SNAKE_CASE` where appropriate

### 7.5 Database Naming

Use database naming conventions consistently:

- schemas: `snake_case`
- tables: `snake_case`
- columns: `snake_case`
- indexes: descriptive stable names
- foreign keys/constraints: explicit names where supported
- materialized views: clear prefixes such as `mv_` when standardized
- triggers/functions: descriptive and domain-scoped names

### 7.6 Branch and Script Naming

Use concise, readable names:

- branch suffixes in lowercase with hyphens
- scripts in descriptive `kebab-case` or established repo convention
- avoid vague names such as `stuff`, `misc`, `temp`, or `new`

---

## 8. Branching Strategy

### 8.1 Primary Model

CaddyStats uses a protected trunk-style workflow centered on `master`.

### 8.2 Branch Types

Short-lived branches should use one of these prefixes:

- `feature/`
- `fix/`
- `docs/`
- `chore/`
- `refactor/`
- `test/`
- `migration/`
- `hotfix/`

Examples:

- `feature/player-stats-endpoint`
- `docs/engineering-governance`
- `migration/auth-schema-baseline`

### 8.3 Branch Rules

- do not push directly to protected branches
- open a PR for all production-bound changes
- keep branches focused and short-lived
- rebase or merge from `master` frequently enough to avoid long-lived drift
- do not combine unrelated concerns in a single branch unless tightly coupled

### 8.4 Hotfix Rule

Hotfixes may move faster than standard work, but must still:

- be reviewed when feasible
- be documented
- be logged in the changelog
- be reconciled back into the normal branch history

---

## 9. Commit Standards

### 9.1 Commit Format

Use a conventional commit-style format:

- `feat:`
- `fix:`
- `docs:`
- `refactor:`
- `test:`
- `chore:`
- `build:`
- `ci:`
- `perf:`

Preferred format:

`type(scope): concise summary`

Examples:

- `feat(api): add tournament leaderboard endpoint`
- `fix(database): correct index naming for player stats`
- `docs(governance): define release and review standards`

### 9.2 Commit Expectations

Commits should be:

- logically grouped
- reviewable
- reversible where practical
- free of unrelated noise
- meaningful in history

### 9.3 Prohibited Commit Quality

Avoid:

- unclear messages such as `update stuff`
- giant mixed-purpose commits when separable
- temporary debug artifacts
- known-broken commits in shared branches unless part of an approved emergency response
- committing secrets, credentials, or local-only environment data

---

## 10. Code Review Requirements

### 10.1 Pull Request Minimum Requirements

Each PR should include:

- clear title
- concise summary
- affected domains
- linked task, phase, or planning context where applicable
- validation evidence
- risk notes
- screenshots for UI changes where relevant
- migration notes for database changes where relevant
- rollout notes for production-impacting changes where relevant

### 10.2 Approval Requirements

Minimum review thresholds:

- **1 approval** for standard low-risk changes
- **2 approvals** for high-impact changes affecting:
  - authentication or authorization
  - billing, subscriptions, or entitlements
  - production infrastructure
  - database schema or migration strategy
  - AI grounding, moderation, or safety
  - security-sensitive configuration
  - public API contracts with broad downstream impact

### 10.3 Specialist Review Requirements

The appropriate domain reviewer must review changes in these areas:

- database changes → database owner
- backend/API contracts → backend or API owner
- frontend/SEO/public rendering → frontend owner
- infrastructure/deployment/workflows → platform or DevOps owner
- AI systems/editorial safety → AI/editorial owner
- security-relevant changes → designated security-aware reviewer when available

### 10.4 Review Checklist

Reviewers should verify:

- scope matches the stated objective
- architecture boundaries are respected
- documentation has been updated where required
- changelog has been updated where required
- tests are present and appropriate
- naming and structural conventions are followed
- security expectations are preserved
- migration and rollback implications are understood
- no unsupported data or AI claims are introduced

### 10.5 Merge Conditions

A PR may be merged only when:

- required CI checks pass
- required approvals are present
- blocking review comments are resolved
- required docs are updated
- merge conflicts are resolved
- the branch is in a releasable state for its intended scope

---

## 11. Production Approval Flow

### 11.1 Standard Flow

The standard production approval flow is:

1. work is merged through approved PR review
2. CI passes and artifacts are validated
3. release scope is reviewed
4. staging validation is completed where applicable
5. production approvers review risk and readiness
6. deploy is executed
7. post-deploy verification is completed
8. rollback is initiated if acceptance criteria fail

### 11.2 Required Pre-Production Checks

Before a production deployment, confirm as applicable:

- application health checks pass
- migrations were validated
- environment/config changes are ready
- observability is in place
- smoke tests are defined
- rollback/runbook steps are available
- changelog and release notes are complete

### 11.3 Required Production Approvers

At minimum, production approval should include:

- engineering owner for the affected scope
- domain owner for the highest-risk changed subsystem
- platform/deployment owner for infrastructure or production runtime changes

For especially sensitive releases, include additional approval from relevant security, database, billing, or editorial/AI owners.

### 11.4 Staging Validation

Changes should be validated in staging before production when they affect:

- database schema
- deployment topology
- API contracts
- user authentication
- billing and subscriptions
- AI workflows
- editorial publishing flows
- cache behavior
- SEO or route rendering

### 11.5 Post-Deploy Validation

After production deployment, verify:

- service health endpoints
- error rates and logs
- migration completion state
- key business workflows
- privileged/admin workflows if affected
- frontend/public page health if affected
- rollback criteria status

### 11.6 Emergency Change Procedure

During an emergency, the team may accelerate approval and deployment, but must still:

- record the reason for urgency
- capture who approved the change
- log the mitigation or hotfix
- complete post-incident documentation
- reconcile any bypassed standard process after stabilization

---

## 12. Enforcement and Exceptions

### 12.1 Default Enforcement

These standards are the default operating rules for repository work.

Tooling, PR templates, CI checks, CODEOWNERS, and deployment gates should progressively enforce these standards where practical.

### 12.2 Exception Handling

Exceptions are allowed only when:

- the reason is documented
- the risk is acknowledged
- the appropriate owner approves the exception
- follow-up remediation is tracked if the exception creates debt

### 12.3 Conflict Resolution

If this document conflicts with a later approved ADR or a more specific domain-level governance document, use:

1. approved ADR
2. more specific approved domain governance document
3. this repository-wide governance document

---

## 13. Related Documents

- `docs/workflow.md`
- `docs/changelog.md`
- `docs/planning/Master Task List Consolidated.md`
- `docs/governance/adr/records/`

---

## 14. Maintenance Rule

When updating this document:

- preserve repository-wide applicability
- prefer clear policy language over implementation detail
- update related workflow or ADR references if governance meaning changes
- add a changelog entry for material revisions
