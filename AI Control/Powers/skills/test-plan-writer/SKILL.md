---
name: test-plan-writer
description: |
  Writes comprehensive test plans for features, APIs, systems, and user flows.
  Covers functional, edge case, regression, performance, and negative testing.
  Use this skill whenever a user says "write a test plan", "what should I test for
  this feature?", "create test cases for this", "help me plan my QA", "write test
  scenarios for this API", "what are the edge cases I should test?", or "draft a
  test plan for this user story". Also activate when a user shares a feature
  description, PRD, or API spec and asks what to test. Do NOT use for writing
  actual test code (use a code generation skill) or running automated tests.
---

# Test Plan Writer

Design comprehensive test plans that cover the happy path, edge cases, negative
tests, and regression risks — before a line of test code is written.

## When to Use

- Planning QA for a new feature before development
- Reviewing a PR and thinking through what needs testing
- Creating a regression test suite for an existing feature
- Designing API test coverage
- Performance or load test planning

## When NOT to Use

- Writing the actual test code (this skill produces the plan, not the code)
- Running tests or interpreting test results (use `test-failure-summarizer`)
- General QA process improvement

---

## Workflow

### Step 1 — Understand What's Being Tested

Collect from the user:

1. **Feature or system description:** What does it do?
2. **User flows:** Who uses this and how?
3. **Tech context:** API, UI, backend service, CLI tool?
4. **Existing coverage:** Any tests already exist? What's covered?
5. **Risk level:** What's the impact of a bug? (low-stakes vs. payment/data/auth flows)

### Step 2 — Define Test Scope

Identify the testing layers needed:

| Layer                    | When to include                                     |
| ------------------------ | --------------------------------------------------- |
| **Unit tests**           | Functions with complex logic, edge cases            |
| **Integration tests**    | DB interactions, service-to-service calls           |
| **API / contract tests** | Every endpoint's request/response contract          |
| **End-to-end (E2E)**     | Critical user journeys                              |
| **Negative tests**       | Invalid inputs, unauthorized access, missing fields |
| **Performance tests**    | High-traffic paths, heavy data operations           |

### Step 3 — Generate Test Cases

For each area, produce test cases with:

- **ID:** TC-001, TC-002, etc.
- **Description:** What is being tested
- **Preconditions:** Setup required
- **Input:** Exact input data
- **Expected output:** Exact expected result
- **Type:** Happy path / Edge case / Negative / Performance

### Step 4 — Produce the Test Plan

```markdown
# Test Plan — [Feature Name]

**Date:** [YYYY-MM-DD]
**Author:** [Name / AI]
**Scope:** [What is in scope]
**Out of scope:** [What is not being tested]
**Risk level:** [Low / Medium / High]

---

## Test Environment

- [ ] Development / Staging / Production (check the appropriate env)
- **Required data:** [Seeded users, specific DB state, etc.]
- **Dependencies:** [External services, third-party APIs]

## Test Scenarios

### 1. Happy Path — [Main Flow Name]

| ID     | Test Case                               | Input                           | Expected Result         | Priority |
| ------ | --------------------------------------- | ------------------------------- | ----------------------- | -------- |
| TC-001 | Successful login with valid credentials | email: valid, password: correct | Returns 200 + JWT token | P0       |
| TC-002 | ...                                     | ...                             | ...                     | ...      |

### 2. Edge Cases

| ID     | Test Case                             | Input             | Expected Result                | Priority |
| ------ | ------------------------------------- | ----------------- | ------------------------------ | -------- |
| TC-010 | Login with email containing uppercase | EMAIL@EXAMPLE.COM | Should work (case-insensitive) | P1       |

### 3. Negative / Error Cases

| ID     | Test Case                      | Input                       | Expected Result                           | Priority |
| ------ | ------------------------------ | --------------------------- | ----------------------------------------- | -------- |
| TC-020 | Login with wrong password      | valid email, wrong password | Returns 401, generic error (no info leak) | P0       |
| TC-021 | Login with missing email field | no email, valid password    | Returns 400 with field validation error   | P1       |

### 4. Security Tests

| ID     | Test Case                   | Input                       | Expected Result                    | Priority |
| ------ | --------------------------- | --------------------------- | ---------------------------------- | -------- |
| TC-030 | SQL injection in login form | `' OR 1=1--` in email field | Should return 400, no data exposed | P0       |

### 5. Performance Tests (if applicable)

| Scenario                  | Load                    | Acceptable threshold |
| ------------------------- | ----------------------- | -------------------- |
| Login endpoint under load | 100 concurrent requests | <500ms p99           |

## Regression Risk Areas

- [Area 1 that might break from this change]
- [Area 2]

## Test Execution Checklist

- [ ] All P0 test cases pass
- [ ] All P1 test cases pass or risk accepted
- [ ] No regression in [related feature]
- [ ] Performance thresholds met
```

---

## Output Format

A Markdown test plan document as shown above, ready to paste into Notion, Jira, or GitHub.

Optional: A condensed checklist version for use in PR descriptions.

---

## Safety & Confirmation

- For authentication and payment flows, always include security and negative test cases.
- Flag any scenario where a test could cause side effects in production (email sends, payments, data deletion).
- Mark tests that require specific seeded data with clear "Preconditions" to avoid flaky test setups.
