# Docs Style Guide

## Purpose

Define how Caddy Stats documentation should be structured, written, consolidated, and maintained.

## 1. Documentation Locations

### Canonical docs

Canonical project docs live under `docs/` and define the current source of truth for product, architecture, governance, roadmap, security, compliance, and operating expectations.

### Planning docs

Planning artifacts belong in `docs/planning/`. They guide execution sequencing and task tracking, but they do not replace canonical product or architecture documents by default.

### Legacy docs

Historical source material belongs in `docs/legacy/support/`. Keep it for provenance and migration context only.

## 2. Writing Standards

- prefer direct, specific language over marketing filler
- write for product, engineering, operations, and editorial readers together when the audience is shared
- distinguish verified current state from future intent or assumptions
- keep long docs scannable with descriptive headings, bullets, and tables where they add value
- use repository-relative paths when pointing readers to related files

## 3. Required Depth

Every durable doc should answer:

1. what the document governs or explains
2. why the topic matters to the platform
3. which system objects, workflows, or decisions it affects
4. which adjacent docs should be read with it
5. what constraints, trade-offs, or operating rules matter most

Short summary docs are acceptable only when they clearly act as an entry point to a deeper companion reference.

## 4. Content Rules

- do not invent statistics, providers, or operational guarantees
- do not present aspirational architecture as already implemented without saying so
- keep build-order and dependency constraints explicit when they matter
- document trade-offs and boundaries, not just desired outcomes
- make canonical-versus-legacy status explicit whenever older source material still exists

## 5. Consolidation Rules

- do not create new top-level documentation directories outside `docs/`
- when two docs cover the same topic, either merge them or define a clear summary/detail split
- record unresolved overlap in `docs/governance/DOCUMENTATION_CONSOLIDATION_AUDIT.md`
- update all impacted references when a doc moves or is renamed
- keep `docs/changelog.md` current whenever meaningful docs are added, removed, moved, or materially expanded

## 6. Structure Conventions

- use a single H1 at the top of each file
- prefer short H2 and H3 sections with descriptive labels
- add section intros only when they clarify scope or usage
- use tables for comparisons, ownership maps, or audit lists when they improve scanability

## 7. Maintenance Expectations

- update the closest relevant canonical doc in the same change when behavior or policy changes
- update ADR references when the change is architectural
- preserve legacy docs only when they still provide provenance or migration value
- remove or archive duplicate docs once a canonical replacement exists

## 8. Exception Handling

If a task explicitly requires a fixed filename or external format that differs from the default structure, fulfill the requirement and record the exception in the nearest governance doc.
