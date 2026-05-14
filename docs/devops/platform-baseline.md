# Platform Baseline

## Purpose

Capture the initial infrastructure, monitoring, security, and scalability baseline for Phase 1 repository setup work.

## Infrastructure and Docker baseline

- Docker Compose remains the local orchestration entrypoint.
- API and web images must build in CI before deployment workflows advance.
- Compose files must stay configuration-valid for both development and test stacks.

## Monitoring baseline

- Preserve placeholders for Sentry, Grafana, Prometheus, and OTEL endpoints in the shared environment contract.
- Treat observability configuration as environment-managed, not code-embedded.
- Add metrics, tracing, and alert routing incrementally as backend and worker services expand.

## Security baseline defaults

- JWT, app secrets, and provider secrets stay in environment variables or managed secret stores.
- Default production posture disables GraphQL playground, enables security headers, and keeps CSP in enforce mode.
- Auth, AI, and expensive analytics endpoints are expected to adopt rate limiting.
- Secret scanning, dependency review, and docs/architecture enforcement belong in GitHub workflows.

## Branch protection and repository safeguards

- Protect `main` and `develop` with required PR review and required status checks.
- Require CI, docs-check, architecture-drift, and dependency-review before merge.
- Use CODEOWNERS to route review by domain boundary.

## Web security planning

- CORS should allow only documented origins per environment.
- CSP planning must distinguish report-only rollout from enforced production rules.
- Rich content and AI-assisted editorial flows must stay compatible with sanitization and output escaping rules.

## Scalability preparation

- Reserve `workers/` for isolated queue-backed workloads.
- Keep analytics utilities reusable through `packages/analytics`.
- Keep AI prompt, grounding, and evaluation assets isolated under `ai/`.
- Preserve editorial support for multi-author collaboration through clear service, package, and documentation boundaries.
