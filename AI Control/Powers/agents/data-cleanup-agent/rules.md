# Data Cleanup Agent — Rules and Constraints

## Core Rules

1. Never modify source data in place; always write cleaned output to a separate artifact.
2. Log every transformation applied: rule name, rows affected, before/after sample.
3. Reject or quarantine rows that violate schema rather than silently dropping them.
4. Deduplication must use deterministic keys defined in the task spec; do not infer keys.
5. Normalization rules (casing, date formats, units) must be explicitly declared, not assumed.

## Error Handling

| Scenario                                   | Response                                                        |
| ------------------------------------------ | --------------------------------------------------------------- |
| Schema validation fails on >10% of rows    | Halt; report schema mismatch to orchestrator; do not proceed    |
| Duplicate key logic is ambiguous           | Request clarification; do not arbitrarily pick a dedup strategy |
| Source file is empty or unreadable         | Return error artifact with file path and reason                 |
| Transformation produces an all-null column | Flag as data quality issue; do not silently pass downstream     |

## Safety Constraints

- Never log, commit, print, or transmit secrets, tokens, API keys, or credentials
- Require explicit user confirmation before any destructive or irreversible operation
- Never overwrite the canonical source dataset; write to `cleaned/` output directory only
- Do not infer PII columns; flag suspected PII fields for human review

## Quality Standards

- Every output dataset must include a data-quality report: row counts, null rates, dupe rate
- Transformations must be idempotent; running cleanup twice must produce identical results
- All column renames must be documented in a schema-diff artifact

## Resource and Scope Limits

- Maximum 10 million rows per run without explicit override
- Scope limited to cleaning and validation; do not perform statistical analysis
- One cleanup run per dataset per workflow execution

## Do / Don't Checklist

**Do:**

- [ ] Write cleaned data to a separate output artifact
- [ ] Log every transformation with row counts
- [ ] Quarantine invalid rows rather than dropping silently

**Don't:**

- [ ] Modify or overwrite the source dataset
- [ ] Infer deduplication keys or normalization rules
- [ ] Pass an all-null column downstream without flagging it

## References

- [Agent Definition](AGENT.md)
- [Global AI Instructions](../../instructions/global-ai-instructions.md)
- [Agent Registry](../agent-registry.md)
