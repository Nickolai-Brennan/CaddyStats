# Workflow: 08-testing-validation

## Overview

Plans the test strategy, defines test cases, sets coverage targets, and establishes acceptance criteria. Run after core build workflows (WF-05, WF-06, WF-07) are complete. Outputs feed QA execution and CI/CD gate configuration.

## Phase

MVP · PRODUCTION

## Participants

| Agent              | Role                                                                  |
| ------------------ | --------------------------------------------------------------------- |
| orchestrator-agent | Coordinates testing workflow and signs off on QA checklist            |
| testing-agent      | Designs test strategy, writes test cases, defines acceptance criteria |

## Inputs

- `openapi_spec.yaml` from WF-06
- `ddl_sql.sql` from WF-07
- `component_plan.md` from WF-05
- `model_spec.md` and `evaluation_plan.md` from WF-04 (if applicable)

## Outputs

- `test_plan.md`
- `test_cases.md`
- `qa_checklist.md`

## Steps

### Step 1: Test Strategy (Agent: testing-agent)

**Action**: Define test types (unit, integration, E2E, performance), tools, and coverage targets.
**Inputs**: All input artifacts.
**Outputs**: Test strategy section of `test_plan.md`
**Saves to**: `docs/agent-outputs/testing-agent/`

### Step 2: Test Case Authoring (Agent: testing-agent)

**Action**: Write test cases for each endpoint, component, and data pipeline stage with expected inputs and outputs.
**Inputs**: `openapi_spec.yaml`, `component_plan.md`
**Outputs**: `test_cases.md`
**Saves to**: `docs/agent-outputs/testing-agent/`

### Step 3: Acceptance Criteria (Agent: testing-agent)

**Action**: Define per-feature acceptance criteria aligned to project success metrics.
**Inputs**: `project_brief.md`, `evaluation_plan.md`
**Outputs**: Acceptance criteria section of `test_plan.md`
**Saves to**: `docs/agent-outputs/testing-agent/`

### Step 4: QA Checklist (Agent: testing-agent)

**Action**: Compile pre-release QA checklist covering functional, security, and performance checks.
**Inputs**: All prior step outputs.
**Outputs**: `qa_checklist.md`
**Saves to**: `docs/agent-outputs/testing-agent/`

## Success Criteria

- [ ] Test coverage target ≥ 80% stated in `test_plan.md`
- [ ] Every API endpoint has at least one positive and one negative test case
- [ ] `qa_checklist.md` is approved by orchestrator before launch

## Error Handling

| Scenario                                | Response                                        |
| --------------------------------------- | ----------------------------------------------- |
| Endpoint missing from spec              | Flag gap; request updated OpenAPI spec          |
| Acceptance criteria conflict with brief | Escalate to orchestrator for resolution         |
| Test tooling not specified              | Default to Jest (frontend) and pytest (backend) |

## Safety Gates

- [ ] No secrets in any output files
- [ ] Confirmation required before destructive operations
- [ ] All outputs saved to correct output directory
