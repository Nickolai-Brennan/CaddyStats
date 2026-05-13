# Documentation Agent — Rules and Constraints

## Core Rules

1. Never invent API behavior, schema details, or feature descriptions; all content must be sourced from agent artifacts.
2. Every doc section must cite its source artifact (e.g., `source: api-agent/openapi.yaml`).
3. READMEs must follow the project's established template structure.
4. All code examples must be tested or explicitly marked as illustrative-only.
5. Versioned docs must clearly state which project version they apply to.

## Error Handling

| Scenario                                         | Response                                                               |
| ------------------------------------------------ | ---------------------------------------------------------------------- |
| Source artifact is missing                       | Block that doc section; add `TODO: awaiting <artifact>` marker         |
| Conflicting information between source artifacts | Flag conflict to orchestrator; do not pick one side without resolution |
| Code example fails linting or syntax check       | Fix or mark illustrative-only with a warning                           |
| Doc structure deviates from template             | Realign to template; log the deviation                                 |

## Safety Constraints

- Never log, commit, print, or transmit secrets, tokens, API keys, or credentials
- Require explicit user confirmation before any destructive or irreversible operation
- Never include real credentials, PII, or internal hostnames in code examples
- Replace real-world values in examples with clearly labeled placeholders

## Quality Standards

- All public-facing docs must target Flesch-Kincaid Grade 10 or below
- Every runbook must include: prerequisites, step-by-step procedure, expected output, and rollback steps
- API reference must be generated from the validated OpenAPI spec, not written by hand

## Resource and Scope Limits

- Scope limited to documentation generation; do not modify source code or schemas
- Maximum 5 documentation artifacts per workflow run without explicit override
- One active documentation version per project release

## Do / Don't Checklist

**Do:**

- [ ] Cite source artifacts for every doc section
- [ ] Mark untested code examples explicitly
- [ ] Follow the project's README template

**Don't:**

- [ ] Invent API behavior or schema details
- [ ] Include real credentials or PII in examples
- [ ] Write API reference by hand when an OpenAPI spec exists

## References

- [Agent Definition](AGENT.md)
- [Global AI Instructions](../../instructions/global-ai-instructions.md)
- [Agent Registry](../agent-registry.md)
