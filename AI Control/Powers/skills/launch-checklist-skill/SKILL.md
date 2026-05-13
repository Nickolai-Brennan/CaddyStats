---
name: launch-checklist-skill
description: |
  Generates and evaluates pre-launch readiness checklists covering security, performance,
  accessibility, SEO, monitoring, observability, and go-live operational steps. Use this
  skill when a user is preparing to launch a product, feature, or service; needs a release
  checklist; wants to verify launch readiness; or is conducting a pre-flight review.
  Common phrasings: "are we ready to launch?", "create a launch checklist", "pre-launch
  review", "what do I need before going live?", "release readiness check", "launch prep
  list", "pre-production checklist", "go-live checklist". Do NOT use when the user wants
  to write deployment scripts or CI/CD pipelines (that's infrastructure work), perform
  ongoing post-launch monitoring (use a monitoring/alerting skill), or conduct a security
  audit of code (use code-review-skill for code-level review).
---

# Launch Checklist Skill

## Overview

The Launch Checklist Skill generates tailored pre-launch readiness checklists and evaluates
current launch status against standard criteria. It covers security hardening, performance
validation, accessibility, SEO basics, monitoring setup, rollback plans, legal/compliance
items, and operational go-live steps. It adapts checklist depth to the product type
(web app, API, mobile, data pipeline) and launch scope (MVP, major feature, full product).

## When to Use / When NOT to Use

**Use this skill when:**

- Team is preparing for a product or feature launch and needs a structured checklist
- User wants to verify readiness across multiple dimensions before going live
- User needs a release review template or go/no-go decision framework
- User asks what they might have missed before shipping

**Do NOT use this skill when:**

- User wants to write deployment automation or CI/CD pipeline configuration
- User needs post-launch incident response runbooks (different skill domain)
- User wants a deep security audit of source code (use `code-review-skill`)
- User needs load testing scripts written (execution environment required)

## Inputs

- **Product type**: Web app, API service, mobile app, data pipeline, etc.
- **Launch scope**: New product, major feature, minor release, hotfix
- **Team context** _(optional)_: Size, stack, infrastructure (helps tailor depth)
- **Current status** _(optional)_: What's already done — to evaluate gaps

## Outputs

- **Readiness checklist**: Categorized checklist with priority levels (P0/P1/P2)
- **Gap analysis** _(if status provided)_: Items not yet addressed, with risk rating
- **Go/No-Go recommendation**: Clear recommendation with blocking vs. non-blocking items
- **Rollback plan template**: Steps to revert if launch goes wrong

## Workflow

1. Identify product type and launch scope from inputs.
2. Generate a categorized checklist tailored to the product type.
3. Mark each item P0 (launch blocker), P1 (should have), or P2 (nice to have).
4. If current status is provided, evaluate which items are incomplete.
5. Flag any P0 gaps as launch blockers; produce go/no-go recommendation.
6. Append a rollback plan template.

**Stop conditions:**

- Stop and ask if product type or launch scope is unclear — checklists differ significantly.
- Do not mark a launch as "ready" if any P0 items are unresolved.

## Edge Cases

- **Hotfix launch**: Streamlined checklist — skip low-priority items, focus on regression
  and rollback.
- **Soft launch / canary**: Flag monitoring and canary percentage as P0 items.
- **External API / third-party dependency**: Add dependency health check as P0.
- **Regulated industries (HIPAA, PCI, SOC2)**: Add compliance section; flag if audit
  evidence is required.

## Safety & Secrets

- Never log, commit, or include real credentials, API keys, or environment secrets in
  checklist documentation.
- Use placeholder values (`<YOUR_SECRET>`) in any configuration examples.
- Always include "Secrets rotation" and "Credentials audit" as checklist items.
- Warn if rollback plan is missing — a launch without a rollback plan is high risk.

## Checklist Categories

### P0 — Launch Blockers

- [ ] All critical and high security vulnerabilities resolved
- [ ] Secrets and credentials externalized to environment variables / secrets manager
- [ ] Authentication and authorization verified end-to-end
- [ ] Data backup and recovery tested
- [ ] Rollback plan documented and tested
- [ ] Error monitoring and alerting configured (PagerDuty, Sentry, etc.)
- [ ] SSL/TLS certificates valid and auto-renewing
- [ ] Production environment variables set correctly (not dev/staging values)

### P1 — Should Have Before Launch

- [ ] Performance tested under expected load
- [ ] Accessibility audit completed (WCAG 2.1 AA minimum)
- [ ] SEO basics: meta tags, sitemap, robots.txt, canonical URLs
- [ ] Legal review: privacy policy, terms of service, cookie consent
- [ ] User-facing error pages (404, 500) configured
- [ ] Rate limiting and DDoS protection enabled
- [ ] Logging structured and queryable in observability platform
- [ ] On-call rotation and escalation policy in place

### P2 — Nice to Have

- [ ] Performance budget documented and monitored
- [ ] A/B testing framework configured
- [ ] Feature flags for gradual rollout
- [ ] User feedback mechanism in place

## Examples

### Example 1: Web app MVP launch

**User prompt:** "We're launching our MVP next week — a React SPA with a Node.js API
and PostgreSQL on AWS. What do we need to check?"

**Expected output:**
Full categorized checklist adapted to React/Node/PostgreSQL/AWS: HTTPS via ACM, env
vars in AWS Secrets Manager, RDS backups enabled, CloudWatch alarms for error rate and
latency, WAF rules, Sentry for frontend errors, bundle size check, Lighthouse score,
database migrations tested, rollback via ECS task revision pinning.

### Example 2: API service launch evaluation

**User prompt:** "Here's what we've done so far: auth ✓, HTTPS ✓, logging ✓,
load test ✗, rollback plan ✗, monitoring ✗. Are we ready to launch?"

**Expected output:**

- **No-Go recommendation**: 3 P0 items unresolved — load test, rollback plan, monitoring.
- Gap analysis with risk description for each missing item.
- Suggested minimum steps to reach launch readiness within the timeline.

## Testing / Evals

See `evals/evals.json` for test prompts. Run 2–3 prompts and compare outputs against
`expected_output` descriptions.

## References

- [Automation Best Practices](../../references/automation-best-practices.md)
- [Repo Rules](../../instructions/repo-rules.md)
- [DevOps Core Principles](../../instructions/devops-core-principles.instructions.md)
- [Skill Registry](../skill-registry.md)
