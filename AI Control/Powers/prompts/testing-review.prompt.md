---
name: testing-review
agent: testing-agent
phase: MVP|PRODUCTION
---

# Prompt: Testing Review

## Objective

Plan a complete test strategy, generate test cases for all major features, and produce a pre-release QA checklist.

## Context Requirements

- `openapi_spec.yaml` from WF-06
- `component_plan.md` from WF-05
- `model_spec.md` from WF-04 (if applicable)
- Acceptance criteria from `project_brief.md`

## Instructions

You are the testing-agent. Given the following context:

**Project context**: {{project_context}}
**OpenAPI spec**: {{openapi_spec}}
**Component plan**: {{component_plan}}
**Acceptance criteria**: {{acceptance_criteria}}

Complete the following:

1. Define test strategy: test types to run (unit, integration, E2E, load), tooling, and coverage targets (≥80%).
2. Write test cases for every API endpoint: at least one happy-path and one error-path per endpoint.
3. Write test cases for each UI component: render test, interaction test, and data-binding test.
4. Define performance thresholds: p95 API response time, dashboard load time, and concurrent-user target.
5. Compile `qa_checklist.md`: functional, security, accessibility, and performance checks.

## Output Format

```yaml
test_plan:
  coverage_target: 80%
  tools:
    unit: pytest
    integration: pytest + httpx
    e2e: Playwright
    load: k6
  test_cases:
    - id: TC-001
      type: integration
      endpoint: "GET /api/users"
      scenario: happy_path
      input: "valid auth token"
      expected: "200 + list of users"
    - id: TC-002
      type: integration
      endpoint: "GET /api/users"
      scenario: error_path
      input: "missing auth token"
      expected: "401 Unauthorized"
qa_checklist:
  - item: "All endpoints return correct status codes"
    status: pending
```

## Quality Checks

- [ ] Every endpoint has both happy-path and error-path test cases
- [ ] Performance thresholds defined with numeric values
- [ ] QA checklist covers functional, security, and accessibility

## Safety Rules

- Never use real production data in test cases
- Flag any test that requires elevated permissions for security review
