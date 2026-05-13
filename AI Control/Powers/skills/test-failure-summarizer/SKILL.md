---
name: test-failure-summarizer
description: |
  Analyzes test failure output and produces a clear summary: what failed, why, how
  to fix it, and whether it's a flaky test or a real regression. Use this skill
  whenever a user says "my tests are failing", "help me understand these test
  failures", "summarize this test output", "why is this test failing?",
  "analyze these failing tests", "are these flaky tests?", "my CI is red — help",
  or "what broke in my test suite?". Also activate when a user pastes test output,
  stack traces, or CI logs and asks for help. Works with pytest, Jest, RSpec, JUnit,
  and generic test runner output. Do NOT use for writing new tests (use test-plan-writer)
  or writing application code to fix the underlying bug.
---

# Test Failure Summarizer

Turn walls of red test output into a clear summary of what failed, what caused it,
and what to do next.

## When to Use

- CI just failed and you need to find the real issue fast
- A bunch of tests are failing and you need to triage them
- You're unsure if a failure is a real bug or a flaky test
- You want to understand a confusing stack trace

## When NOT to Use

- Writing new tests (use `test-plan-writer`)
- Writing application code to fix the bug (separate task)
- Setting up test infrastructure

---

## Workflow

### Step 1 — Receive Test Output

Accept:

- Pasted test runner output (any framework)
- CI/CD log output
- A description of the failures

Identify the test framework from the output format:

- `FAILED test_file.py::test_name` → pytest
- `✕ test name` → Jest
- `1) Context: behavior` → RSpec
- `FAIL: testMethodName` → JUnit

### Step 2 — Extract Failing Tests

Parse and list:

1. Test file and test name
2. Failure message (first line of the assertion error)
3. Line number of failure
4. Whether the failure is in the test or in application code

Group failures by:

- **Same error message** (one root cause may explain multiple failures)
- **Same file / component** (localized issue)

### Step 3 — Classify Each Failure

| Type                  | Signals                                                         |
| --------------------- | --------------------------------------------------------------- |
| **Real regression**   | New failure on unchanged test, passes on older commit           |
| **Test bug**          | Test was always wrong (wrong assertion, wrong setup)            |
| **Environment issue** | Passes locally, fails in CI (network, missing env var, OS diff) |
| **Flaky test**        | Intermittently passes/fails, often timing-related               |
| **Dependency change** | External dep changed behavior                                   |

Look for flakiness signals:

- Timeout errors
- Race conditions in async tests
- Order-dependent tests
- Random data generation without seeds

### Step 4 — Produce the Failure Summary

```markdown
## Test Failure Summary

_Framework: [pytest/Jest/etc.] | Total failures: N | Analyzed: [Date]_

### Overview

[2–3 sentence summary: N tests failed, likely caused by X, affects Y component]

### Failure Groups

#### Group 1 — [Common cause] (N tests)

**Failure type:** Real regression / Flaky / Test bug / Environment
**Tests:**

- `test_file.py::test_name` — line 42
- `test_file.py::test_name_2` — line 67

**Error:**
```

AssertionError: Expected 200, got 500

```

**Likely cause:** [One-sentence explanation]
**Suggested fix:** [Specific actionable suggestion]

---

#### Group 2 — [Common cause] (N tests)
...

### Triage Summary
| Failure | Priority | Action |
|---------|----------|--------|
| [Group 1] | P0 | Fix immediately — regression in auth |
| [Group 2] | P2 | Investigate flakiness — add retry or fix timing |

### Suspected Root Cause
[Best hypothesis for what caused the overall failure, if one root cause ties them together]
```

### Step 5 — Identify Quick Wins

Flag any:

- Tests that can be unblocked by updating a fixture or mock
- Obvious assertion bugs (e.g., asserting wrong expected value)
- Tests that should be skipped or marked as expected failures

---

## Output Format

The failure summary as shown above in Markdown. Suitable for GitHub PR comments or team chat.

---

## Safety & Confirmation

- Clearly label your root cause analysis as a hypothesis ("likely caused by" / "possibly related to").
- Don't recommend marking tests as `skip` or `xfail` as the default — only suggest this after other options.
- For flaky tests, recommend fixing the root cause (e.g., proper async waiting) before adding retry logic.
