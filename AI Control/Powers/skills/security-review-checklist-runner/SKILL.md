---
name: security-review-checklist-runner
description: |
  Runs a structured security review checklist against code, API designs, or
  architecture documents, identifying potential vulnerabilities and producing a
  prioritized remediation plan. Use this skill whenever a user says "do a security
  review", "check this code for security issues", "run a security checklist",
  "is this API secure?", "review this design for vulnerabilities", "do a threat
  model", "what are the security risks here?", or "is this code safe?" Also activate
  when someone shares code, an API spec, or an architecture diagram and asks for a
  security perspective. Do NOT use for dependency CVE audits (use
  dependency-audit-assistant) or compliance certification preparation.
---

# Security Review Checklist Runner

Systematically check code, APIs, and designs against a security checklist to surface
vulnerabilities before they reach production.

## When to Use

- Pre-launch security review for a new feature
- Code review security perspective for a PR
- Threat modeling an API or architecture design
- Security check when inheriting unfamiliar code

## When NOT to Use

- Dependency CVE scanning (use `dependency-audit-assistant`)
- Penetration testing (requires live system access — this is static analysis)
- Compliance certification (SOC2, PCI-DSS) — point to specialized tools

---

## Workflow

### Step 1 — Receive Input

Accept:

- Code files or snippets
- API endpoint descriptions or OpenAPI specs
- Architecture diagrams or system descriptions
- PRs / diffs for review

Ask: "What type of review? (Web API / Auth flow / Data handling / File uploads / General code)"

### Step 2 — Select Relevant Checklist

Apply the appropriate OWASP-based checklist for the input type:

#### Web API Security Checklist

- [ ] Authentication required on all non-public endpoints
- [ ] Authorization checked at the resource level (not just route)
- [ ] Input validation on all user-supplied data
- [ ] Rate limiting and throttling in place
- [ ] HTTPS enforced; no sensitive data in query strings
- [ ] CORS configured restrictively (not `*` in production)
- [ ] SQL injection protection (parameterized queries / ORM)
- [ ] Output encoding to prevent XSS
- [ ] Sensitive data (passwords, tokens) never logged
- [ ] Error messages don't leak internal details to clients

#### Authentication / Auth Flow Checklist

- [ ] Passwords hashed with bcrypt/argon2 (not MD5/SHA1)
- [ ] Brute force protection (rate limiting on auth endpoints)
- [ ] Secure session management (httpOnly, Secure, SameSite cookies)
- [ ] JWT tokens validated (signature, expiry, audience)
- [ ] Token revocation mechanism exists
- [ ] MFA available for privileged accounts
- [ ] Password reset flows protected against account enumeration

#### Data Handling Checklist

- [ ] PII identified and minimized
- [ ] Data encrypted at rest and in transit
- [ ] Database credentials stored in environment variables (not code)
- [ ] Audit logging for data access and mutations
- [ ] Data retention policies defined

#### File Upload Checklist

- [ ] File type validated (not just extension — check MIME type)
- [ ] File size limits enforced
- [ ] Files stored outside webroot (not directly served)
- [ ] Virus/malware scanning for uploaded files
- [ ] File names sanitized before storage

### Step 3 — Assess Each Item

For each checklist item, mark:

- ✅ **Pass** — implemented correctly
- ❌ **Fail** — issue found (with specific code reference)
- ⚠️ **Warning** — partial or unclear implementation
- ℹ️ **N/A** — not applicable to this context

### Step 4 — Produce the Report

```markdown
## Security Review Report — [Feature/File Name]

_Date: [YYYY-MM-DD] | Reviewer: AI | Scope: [What was reviewed]_

### Summary

- ❌ Critical: N | ⚠️ High: N | 🔶 Medium: N | ℹ️ Low: N

### Critical Findings

#### ❌ SQL Injection Risk

**Location:** `src/api/users.js:42`
**Issue:** Raw string concatenation in SQL query
**Code:** `db.query("SELECT * FROM users WHERE id=" + req.params.id)`
**Fix:** Use parameterized queries: `db.query("SELECT * FROM users WHERE id=$1", [req.params.id])`
**Priority:** Patch before next release

### Checklist Results

| Item               | Status | Notes                           |
| ------------------ | ------ | ------------------------------- |
| Input validation   | ❌     | See SQL injection finding above |
| Auth on all routes | ✅     | Middleware applied globally     |

...

### Remediation Plan

1. [Critical] Fix SQL injection in users endpoint
2. [High] Add rate limiting to /auth/login
3. [Medium] Restrict CORS from \* to allowed origins
```

---

## Output Format

Markdown report as shown above, suitable for GitHub PR comments, Notion, or Confluence.

---

## Safety & Confirmation

- This is a **static analysis** review — live exploitation or active testing is out of scope.
- Never suggest storing findings in an insecure location.
- Flag Critical and High findings immediately with clear urgency signals.
- Always recommend consulting a professional security engineer for Critical findings before going live.
