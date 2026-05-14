# Contributing to Caddy Stats

## Purpose

This repository follows an architecture-first, data-first workflow. Phase 1 work must keep bootstrap, CI, environment, security, and ownership baselines stable before deeper product implementation continues.

## Contributor workflow

1. Read `README.md`, `docs/workflow.md`, and the closest relevant docs under `docs/`.
2. Run `make setup` on a fresh clone.
3. Review `.env.example` and the overlays in `config/environments/` before adding or changing environment variables.
4. Make the smallest change that satisfies the task.
5. Run `make verify`, `make lint`, `make typecheck`, and `make test` before requesting review.
6. Update `docs/changelog.md` and any affected docs in the same change.

## Branch and PR expectations

- Use focused branches for one task or concern.
- Keep pull requests scoped, documented, and reviewable.
- Include migration, environment, and rollback notes when relevant.
- Do not merge code that introduces undocumented environment variables, workflow drift, or missing domain ownership documentation.

## Local bootstrap

- `make setup` bootstraps Node, Python, hooks, local env files, and baseline verification.
- `make dev` starts the Docker Compose stack.
- `make docker-validate` checks Compose configuration and image builds.

## Documentation responsibilities

Update the closest canonical doc when your change affects:

- environment variables or secrets handling
- CI/CD workflows or deployment behavior
- repo structure or ownership boundaries
- security posture, monitoring, or operational safeguards
- package boundaries or shared conventions

Always record meaningful changes in `docs/changelog.md`.
