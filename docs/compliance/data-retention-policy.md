# Data Retention Policy

Last Updated: 2026-05-13

## Purpose

This policy defines baseline retention windows, deletion workflows, and hold controls for operational, compliance, provenance, and audit records.

## Retention Principles

- retain only data needed for product operation, legal obligations, security, and auditability
- preserve records required to reproduce material claims, model outputs, and privileged actions
- apply least-retention defaults where legal or contractual obligations do not require longer storage
- enforce deletion or anonymization through documented operational procedures

## Data Classes and Baseline Windows

- authentication and security logs: 12 months minimum
- API and operational logs: 6 months minimum unless incident review extends retention
- billing and subscription records: 7 years minimum
- editorial versions and publication history: 24 months minimum
- stat provenance and normalization lineage: 24 months minimum
- AI grounding and output audit records: 24 months minimum
- model run metadata and evaluation records: 24 months minimum
- support tickets and account communications: 24 months minimum

## Holds and Exceptions

Do not purge data when:

- a legal hold is active
- an incident investigation is open
- a regulatory or contractual preservation requirement applies

## Deletion and Anonymization Controls

- use scheduled, repeatable purge jobs
- log purge job execution and outcomes
- prefer anonymization where identity removal preserves analytical utility
- validate downstream dependencies before destructive purges

## Policy Dependencies

This policy informs:

- `docs/data/stat-grounding-policy.md`
- `docs/compliance/privacy-policy.md`
- `docs/compliance/operational-compliance-policy.md`
