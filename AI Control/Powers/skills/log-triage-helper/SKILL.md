---
name: log-triage-helper
description: |
  Triages, summarizes, and categorizes error logs to identify root causes, patterns,
  and critical issues. Use this skill whenever a user says "help me read these logs",
  "triage these errors", "what's wrong in my logs?", "summarize these stack traces",
  "find patterns in these errors", "which errors are most critical?", "parse this
  log file", or "what's causing all these 500 errors?". Also activate when a user
  pastes a wall of log output and asks what to do. Works with application logs,
  server logs, CI logs, and database logs. Do NOT use for writing log collection
  infrastructure, log retention policies, or live monitoring setup.
---

# Log Triage Helper

Cut through walls of log output to identify what's actually wrong, which errors
are critical, and what to investigate first.

## When to Use

- A service is throwing errors and you need to find the root cause quickly
- You have a large log dump and don't know where to start
- You want to identify patterns across many error events
- CI build failed and you need to find the actual failure in verbose output

## When NOT to Use

- Setting up log collection infrastructure (ELK, Datadog, etc.)
- Writing log rotation or retention policies
- Live monitoring alerting rules

---

## Workflow

### Step 1 — Receive Log Input

Accept:

- Pasted log text (any format: structured JSON, logfmt, plain text)
- A description of the error symptoms
- CI/CD output
- Stack traces

Ask:

1. What system generated these logs? (app server, database, build tool, etc.)
2. What time range do these logs cover?
3. Are you looking for a specific error, or a general triage?

### Step 2 — Parse and Classify Entries

Group log lines by:

| Category                      | What it means                                            |
| ----------------------------- | -------------------------------------------------------- |
| **ERROR / FATAL**             | Immediate attention required                             |
| **WARN**                      | Potential issue, not yet failing                         |
| **Exceptions / Stack traces** | Root cause candidates                                    |
| **Timeouts**                  | Performance or dependency issues                         |
| **Auth failures**             | Security or config issue                                 |
| **4xx errors**                | Client errors (usually not your bug, but volume matters) |
| **5xx errors**                | Server errors (your code or infrastructure)              |

### Step 3 — Identify Patterns

Count occurrences and identify:

- **Most frequent error** (by error message, ignoring dynamic values)
- **First occurrence** (often the root cause)
- **Error spikes** (timestamps where error rate surged)
- **Correlated errors** (multiple errors starting at the same time — look for common trigger)

Normalize error messages by removing dynamic values:

- "User ID 1234 not found" → "User ID {id} not found" → 47 occurrences

### Step 4 — Find the Root Cause

Work backwards from symptoms to cause:

1. Find the first error in the timeline
2. Look for the exception chain (caused by / wrapped by patterns)
3. Check if the error started after a deployment, config change, or traffic spike
4. Identify the component that originated the error (is it your code, a dependency, or infrastructure?)

### Step 5 — Produce the Triage Report

```markdown
## Log Triage Report

_Source: [System] | Time range: [Start] – [End] | Log lines analyzed: N_

### 🚨 Critical Errors (must investigate)

| Error                                 | Count | First seen | Likely cause            |
| ------------------------------------- | ----- | ---------- | ----------------------- |
| `NullPointerException in UserService` | 203   | 14:32:01   | Likely null user object |
| `Connection refused: postgres:5432`   | 47    | 14:31:58   | DB connection issue     |

### ⚠️ Warnings (monitor)

| Warning            | Count | Notes                   |
| ------------------ | ----- | ----------------------- |
| `Slow query: > 2s` | 89    | Performance degradation |

### 🔍 Root Cause Hypothesis

The postgres connection refused errors started at 14:31:58, 3 seconds before the NullPointerException
cascade. The DB connection failure is likely the root cause triggering downstream null objects.

### 🔧 Recommended Investigations

1. Check DB server health at 14:31:xx — disk space, CPU, connection count
2. Review recent deployments or config changes before 14:31
3. Check connection pool configuration in UserService

### 📋 Error Summary

- Total errors: N | Unique error types: N | Peak error rate: N/min at HH:MM
```

---

## Output Format

The triage report as shown above, in Markdown.

For CI logs: extract only failing step names, the first error line, and the first stack trace frame.

---

## Safety & Confirmation

- If logs contain PII (email addresses, IP addresses, user IDs), note that they're present and avoid echoing them back unnecessarily.
- Never suggest changes to production systems based solely on log analysis — recommend investigation first.
- Clearly label your root cause hypothesis as a "hypothesis" not a confirmed cause.
