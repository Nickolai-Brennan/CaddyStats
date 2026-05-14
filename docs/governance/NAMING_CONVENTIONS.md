# Naming Conventions

## Purpose

Document the naming rules used for canonical docs, architectural records, and cross-domain identifiers.

## Documentation files

- default documentation filenames should use `kebab-case.md`
- directories should use short, domain-oriented names such as `product`, `architecture`, `strategy`, and `governance`
- fixed deliverables requested by explicit task name may use uppercase or underscore-heavy filenames as a documented exception

## ADR files

- ADRs use `ADR-###-topic-slug.md`
- numbering is sequential and never reused
- the topic slug uses kebab-case

## Domain objects

- bounded contexts should use singular entity names in conceptual docs
- database tables should use pluralized, schema-qualified names where practical
- API fields and JSON keys should remain consistent with typed contracts and avoid leaking internal-only naming

## Events

- event names should use dotted lowercase namespaces such as `content.article_published`
- event names should describe a fact or explicit request, not an implementation detail

## Version labels

- release classes use `major`, `minor`, and `patch`
- docs may optionally record `Status` and `Last Updated` fields when the extra metadata improves governance clarity

## Environment and secret names

- environment variables should remain uppercase with underscores
- secret names should be descriptive but must not include values or provider-specific sensitive data in docs examples
