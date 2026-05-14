# Documentation Consolidation Audit

## Purpose

Record the documentation overlaps that remain in the repository after consolidation into the single `docs/` tree, so future cleanup can trim or merge them deliberately.

## Consolidation outcome

This repository now uses one documentation root:

- canonical docs live under `docs/`
- planning artifacts live under `docs/planning/`
- archived legacy support material lives under `docs/legacy/support/`

This split removes the previous `Support/docs/` and top-level `Planning/` contradictions while preserving historical context.

## Remaining trim candidates

| Overlapping docs | Why they overlap | Recommended trim direction |
| --- | --- | --- |
| `docs/architecture/SYSTEM_ARCHITECTURE_OVERVIEW.md` and `docs/architecture/system-overview.md` | both describe platform architecture; one is summary-level and one is detailed | keep the summary/detail split only if both stay intentionally cross-linked; otherwise merge into one canonical architecture overview |
| `docs/architecture/DOMAIN_MODEL.md` and `docs/architecture/domain-model.md` | both cover domain contexts and core entities | keep `DOMAIN_MODEL.md` as the executive map and `domain-model.md` as the detailed reference, or merge if readers continue to confuse them |
| `docs/product/VISION_AND_GOALS.md` and `docs/product/vision.md` | both define product vision, goals, and strategic framing | prefer one canonical product-vision doc unless the detailed file continues to serve a distinct planning audience |
| `docs/core/PROJECT_OVERVIEW.md` and `docs/legacy/support/00-root/project-overview.md` | both explain the platform at a high level | keep the canonical docs/core version and archive the legacy file unless it still provides unique historical value |
| `docs/planning/Stack Environments & Connectivity.md` and `docs/legacy/support/DevOps/caddystats_stack_environments.md` | near-duplicate environment-planning content | keep the `docs/planning/` version as the active planning file and retire the archived duplicate when safe |
| `docs/product/PRODUCT_BRIEF.md` and `docs/legacy/support/00-root/product-requirements-doc.md` | both frame product scope, requirements, and intent | merge any missing durable requirements into canonical product docs, then keep the older file as historical source only |

## Contradictions resolved in this pass

- removed split guidance between `docs/`, `Support/docs/`, and `Planning/`
- moved workflow guidance to `docs/workflow.md`
- moved ADR source files under `docs/governance/adr/records/`
- merged changelog history into `docs/changelog.md`
- updated repo and template references to the consolidated docs tree

## Follow-up checks

When adding or updating docs, verify:

1. the file belongs in the right docs tier
2. no older file already covers the same topic
3. summary docs explicitly point to their deeper companion reference
4. moved files have updated inbound references
