# Workflow: 09-documentation

## Overview

Generates READMEs, API references, architecture docs, and onboarding guides from existing artifacts. Run after build workflows are stable. Outputs are committed to the repo and reviewed before launch.

## Phase

MVP · PRODUCTION

## Participants

| Agent               | Role                                                   |
| ------------------- | ------------------------------------------------------ |
| orchestrator-agent  | Coordinates documentation tasks and validates coverage |
| documentation-agent | Authors all documentation artifacts                    |

## Inputs

- `openapi_spec.yaml` from WF-06
- `erd_description.md` from WF-07
- `model_spec.md` from WF-04 (if applicable)
- `page_layout.md` from WF-05

## Outputs

- `README.md`
- `api_reference.md`
- `runbook.md`
- `architecture_doc.md`

## Steps

### Step 1: README (Agent: documentation-agent)

**Action**: Write project README covering purpose, setup, usage, and contributing guidelines.
**Inputs**: `project_brief.md`, repo structure.
**Outputs**: `README.md`
**Saves to**: `docs/agent-outputs/documentation-agent/`

### Step 2: API Reference (Agent: documentation-agent)

**Action**: Generate human-readable API reference from `openapi_spec.yaml`.
**Inputs**: `openapi_spec.yaml`
**Outputs**: `api_reference.md`
**Saves to**: `docs/agent-outputs/documentation-agent/`

### Step 3: Architecture Doc (Agent: documentation-agent)

**Action**: Describe system components, data flows, and integration points with a textual architecture diagram.
**Inputs**: `erd_description.md`, `service_layer_design.md`, `page_layout.md`
**Outputs**: `architecture_doc.md`
**Saves to**: `docs/agent-outputs/documentation-agent/`

### Step 4: Runbook (Agent: documentation-agent)

**Action**: Write operational runbook covering deployment, rollback, monitoring, and common failure responses.
**Inputs**: `migration_strategy.md`, `qa_checklist.md`
**Outputs**: `runbook.md`
**Saves to**: `docs/agent-outputs/documentation-agent/`

## Success Criteria

- [ ] `README.md` covers setup in five steps or fewer
- [ ] `api_reference.md` documents every endpoint with example request/response
- [ ] `runbook.md` includes rollback steps for every deployment action

## Error Handling

| Scenario                          | Response                                                  |
| --------------------------------- | --------------------------------------------------------- |
| `openapi_spec.yaml` not available | Generate placeholder; mark as draft pending spec          |
| Architecture unclear              | Request clarification from orchestrator before proceeding |
| Runbook gap identified            | Add "TBD" section and create a follow-up task             |

## Safety Gates

- [ ] No secrets in any output files
- [ ] Confirmation required before destructive operations
- [ ] All outputs saved to correct output directory
