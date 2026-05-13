---
name: documentation-builder
agent: documentation-agent
phase: MVP|PRODUCTION
---

# Prompt: Documentation Builder

## Objective

Generate complete technical documentation (README, API reference, architecture doc, runbook) from existing project artifacts.

## Context Requirements

- `openapi_spec.yaml` from WF-06
- `erd_description.md` from WF-07
- `service_layer_design.md` from WF-06
- `project_brief.md` from WF-00

## Instructions

You are the documentation-agent. Given the following context:

**Project context**: {{project_context}}
**OpenAPI spec**: {{openapi_spec}}
**ERD description**: {{erd_description}}
**Deployment environment**: {{deployment_environment}}

Complete the following:

1. Write `README.md`: project purpose, prerequisites, installation (≤5 steps), usage examples, and contributing guide.
2. Generate `api_reference.md`: one section per endpoint with method, path, parameters, request example, response example, and error codes.
3. Write `architecture_doc.md`: system components, data flow narrative, integration points, and textual component diagram.
4. Write `runbook.md`: deployment steps, rollback procedure, monitoring checks, and response playbooks for top 3 failure scenarios.

## Output Format

```markdown
# README.md

## Quick Start

1. Clone the repo: `git clone <repo-url>`
2. Install dependencies: `npm install`
3. Configure environment: copy `.env.example` to `.env`
4. Start the server: `npm start`
5. Open `http://localhost:3000`
```

## Quality Checks

- [ ] README setup completes in ≤5 steps on a clean machine
- [ ] Every API endpoint documented with request and response examples
- [ ] Runbook includes rollback steps for every deployment action
- [ ] No placeholder text (`[TODO]`, `[TBD]`) in final output

## Safety Rules

- Never include real credentials, tokens, or connection strings in documentation
- Use `.env.example` patterns for all environment variable references
