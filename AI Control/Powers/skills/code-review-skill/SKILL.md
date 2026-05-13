---
name: code-review-skill
description: |
  Reviews code for correctness, security vulnerabilities, performance issues, readability,
  and adherence to best practices and team conventions. Use this skill when a user asks for
  a code review, PR review, feedback on code quality, a security audit of code, style or
  pattern improvements, or a second opinion on an implementation. Common phrasings: "review
  this code", "check my PR", "look at this function", "is this secure?", "any issues with
  this?", "code feedback please", "audit this module", "does this follow best practices?".
  Do NOT use when the user wants code written from scratch (no existing code to review),
  or when the request is purely about running/executing code, deploying, or testing
  infrastructure — this skill reads and critiques existing code only.
---

# Code Review Skill

## Overview

The Code Review Skill performs structured code reviews covering correctness, security,
performance, maintainability, and style. It provides actionable, prioritized feedback
with specific line-level suggestions and explanations. Reviews are scoped to the provided
code and context — this skill reads and critiques; it does not execute, deploy, or merge.

## When to Use / When NOT to Use

**Use this skill when:**

- User shares code and asks for review, feedback, or critique
- User wants a pull request reviewed before merging
- User asks if code is secure, performant, or follows best practices
- User wants to understand issues or anti-patterns in existing code
- User asks "is there a better way to write this?"

**Do NOT use this skill when:**

- No existing code is provided (use a code-generation skill instead)
- User wants the code executed or its output explained
- The request is about infrastructure, CI/CD pipelines, or deployment (not code logic)
- User needs full test suites written from scratch without code to review

## Inputs

- **Code**: The code to review (paste, file path, or PR diff)
- **Language/framework** _(optional)_: Inferred from code if not provided
- **Context** _(optional)_: What the code is supposed to do, team conventions, prior art
- **Focus areas** _(optional)_: Security, performance, style, correctness — defaults to all

## Outputs

- **Summary**: One-paragraph overall assessment (pass/needs-work/major-issues)
- **Findings**: Prioritized list — Critical, High, Medium, Low — each with:
  - Location (file/line or function name)
  - Issue description
  - Recommended fix or improvement
- **Positive observations**: What the code does well (don't skip this)
- **Suggested rewrites** _(optional)_: Inline code suggestions for key fixes

## Workflow

1. Read all provided code; identify language, framework, and apparent purpose.
2. If context is missing, infer intent from code and proceed; note any assumptions.
3. Check for correctness: logic errors, off-by-one errors, unhandled edge cases.
4. Check for security: injection, insecure deserialization, hardcoded secrets, improper
   auth, SSRF, XSS, CSRF, insecure dependencies.
5. Check for performance: N+1 queries, unnecessary allocations, blocking I/O, poor
   algorithmic complexity.
6. Check for maintainability: naming, complexity, duplication, test coverage signals.
7. Check style against inferred or stated conventions.
8. Produce a prioritized findings list; include at least one positive observation.

**Stop conditions:**

- Stop and ask if code is too large to review in one pass; request a scoped subset.
- Do not silently skip security findings — always surface them even if minor.

## Edge Cases

- **Hardcoded secrets found**: Flag immediately as Critical; do not reproduce the secret
  in the review output.
- **Very large diff**: Ask user to scope to the most important files or functions.
- **No context provided**: Infer from code; clearly state your interpretation.
- **Generated/boilerplate code**: Note if findings are in generated code vs user-written.
- **Conflicting conventions**: Ask which style guide or standard applies.

## Safety & Secrets

- Never log, commit, print, or reproduce real secrets, tokens, or credentials found in code.
- Flag hardcoded secrets as Critical findings — mask the value in the output.
- Do not suggest insecure patterns as "fixes."
- Warn if reviewed code contains dangerous operations (file deletion, DB drops, etc.).

## Examples

### Example 1: SQL injection vulnerability

**User prompt:** "Review this Python function that fetches user data from our database:
`def get_user(name): return db.execute(f'SELECT * FROM users WHERE name = {name}')`"

**Expected output:**

- **Critical — SQL Injection**: Direct string interpolation in SQL query allows SQL
  injection. Use parameterized queries: `db.execute('SELECT * FROM users WHERE name = ?', (name,))`.
- **Medium — No result handling**: Function returns raw cursor; handle empty results.
- **Low — Naming**: `get_user` implies single result; return one record or rename to
  `find_users`.
- **Positive**: Function is concise and has a clear single responsibility.

### Example 2: React component performance review

**User prompt:** "Can you review this React component? It re-renders constantly and I'm
not sure why." _(component code attached)_

**Expected output:**

- Identify missing `useMemo`/`useCallback` causing child re-renders
- Flag inline object/array literals as new references on each render
- Note missing keys in list rendering
- Suggest `React.memo` wrapping if appropriate
- Overall: medium-priority performance issues; no security concerns found

## Testing / Evals

See `evals/evals.json` for test prompts. Run 2–3 prompts and compare outputs against
`expected_output` descriptions.

## References

- [Coding Standards](../../instructions/coding-standards.md)
- [Security Rules](../../instructions/security-rules.md)
- [Testing Rules](../../instructions/testing-rules.md)
- [Performance Optimization](../../instructions/performance-optimization.instructions.md)
- [Skill Registry](../skill-registry.md)
