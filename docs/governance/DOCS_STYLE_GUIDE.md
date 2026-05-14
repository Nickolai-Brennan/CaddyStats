# Docs Style Guide

## Purpose

Define how canonical documentation in this repository should be written, structured, and maintained.

## Canonical location

- canonical docs live under `docs/`
- `Support/docs/` is legacy reference material unless explicitly migrated
- planning artifacts stay in `Planning/` and should not become the canonical product or architecture source by default

## Writing standards

- prefer direct, specific language over marketing filler
- write for product, engineering, and operational readers together
- describe the current or intended system state clearly
- distinguish verified facts from assumptions or future intent
- use headings and bullets to keep long docs skimmable

## Required qualities

Every durable doc should answer:

1. what the document governs or explains
2. why it exists
3. which system objects or workflows it affects
4. which adjacent docs it should be read with

## Content rules

- do not invent statistics, providers, or operational guarantees
- do not present aspirational architecture as already implemented without saying so
- keep build-order and dependency constraints explicit when they matter
- document trade-offs, not just desired outcomes

## Structure conventions

- use a single H1 at the top of each file
- prefer short sections with descriptive H2 and H3 headings
- use tables only when they improve scanability
- use relative repository paths in references

## Maintenance expectations

- update the closest relevant canonical doc in the same change when behavior or policy changes
- add or update ADR references when the change is architectural
- log meaningful documentation changes in `docs/changelog.md`

## Exception handling

If a task explicitly requires a fixed filename or format that differs from the default naming pattern, fulfill the task and record the exception in the relevant governance docs.
