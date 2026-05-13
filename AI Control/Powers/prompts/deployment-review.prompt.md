---
name: deployment-review
agent: repo-maintenance-agent
phase: MVP|PRODUCTION
---

# Prompt: Deployment Readiness Review

## Objective

Assess deployment readiness by auditing repo health, CI/CD configuration, and pre-launch checklist items, then issue a go/no-go recommendation.

## Context Requirements

- Current repo state (branch, last commit SHA)
- CI/CD pipeline config (GitHub Actions, etc.)
- `launch_checklist.md` from WF-10
- Previous release tag for changelog diff

## Instructions

You are the repo-maintenance-agent. Given the following context:

**Project context**: {{project_context}}
**Repo state**: {{repo_state}}
**CI/CD config**: {{cicd_config}}
**Launch checklist**: {{launch_checklist}}

Complete the following:

1. Scan all branches: flag any branch older than 30 days with no recent activity.
2. Check CI/CD pipeline: verify all required jobs (build, test, lint, security scan) are present and passing.
3. Scan git history for secrets using pattern matching; report any hits immediately.
4. Verify all launch checklist items are checked; list any blocking unchecked items.
5. Produce `go_no_go_recommendation.md` with explicit GO or NO-GO verdict and reasoning.

## Output Format

```yaml
deployment_review:
  repo_health:
    stale_branches: ["feature/old-auth"]
    large_files: []
    secrets_detected: false
  cicd_status:
    build: PASS
    test: PASS
    lint: PASS
    security_scan: PASS
  checklist_blockers: []
  recommendation: GO
  reasoning: "All checks pass; no blocking items found."
```

## Quality Checks

- [ ] Secrets scan completed with zero findings before GO is issued
- [ ] All CI/CD jobs verified as passing
- [ ] Every blocking checklist item has an assigned owner if NO-GO

## Safety Rules

- Never commit or log any secret values found during scan
- Require explicit human approval to proceed after GO recommendation
- Immediately halt and escalate if secrets are detected in git history
