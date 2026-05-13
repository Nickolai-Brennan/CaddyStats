---
name: accessibility-checker
description: |
  Reviews UI code, components, and HTML for WCAG 2.1 accessibility issues and
  produces a prioritized remediation list with fixes. Use this skill whenever a
  user says "check this for accessibility", "is this component accessible?",
  "WCAG audit this code", "fix the a11y issues here", "review for screen reader
  support", "check color contrast", "make this keyboard navigable", or "audit
  this form for accessibility". Also activate when someone says "my accessibility
  test is failing" or pastes HTML/JSX and asks if it's accessible. Do NOT use for
  full automated accessibility testing tool setup (axe-core, Lighthouse) or legal
  ADA compliance certification.
---

# Accessibility Checker

Review HTML, JSX, and CSS against WCAG 2.1 AA standards and produce a
prioritized, actionable list of issues with exact code-level fixes.

## When to Use

- Pre-launch accessibility review of a component or page
- Reviewing a PR for a11y regressions
- Fixing screen-reader or keyboard navigation issues
- Checking color contrast ratios against WCAG standards

## When NOT to Use

- Setting up automated a11y testing tools (axe-core, jest-axe, Playwright)
- Full WCAG 2.2 or WCAG 3.0 AAA compliance audits
- Legal accessibility compliance certifications

---

## Workflow

### Step 1 — Receive the Code

Accept:

- HTML snippets or full component files
- JSX/TSX React components
- CSS with color values to check
- A description of a UI pattern to review

Ask: "Do you want a quick scan for critical issues, or a thorough WCAG 2.1 AA review?"

### Step 2 — Run the Checklist

Check against these WCAG success criteria:

#### Perceivable

- [ ] **1.1.1** All non-text content has alt text (`<img alt="...">`, `aria-label`, `aria-labelledby`)
- [ ] **1.3.1** Info conveyed by structure/color alone also conveyed semantically
- [ ] **1.3.2** Reading order makes sense without CSS
- [ ] **1.4.1** Color is not the only way to convey information
- [ ] **1.4.3** Text color contrast ≥ 4.5:1 (or 3:1 for large text ≥18pt)
- [ ] **1.4.4** Text resizes up to 200% without horizontal scroll
- [ ] **1.4.11** UI component contrast ≥ 3:1 vs. adjacent colors

#### Operable

- [ ] **2.1.1** All functionality available via keyboard
- [ ] **2.1.2** No keyboard trap
- [ ] **2.4.3** Focus order is logical and matches visual order
- [ ] **2.4.6** Headings and labels are descriptive
- [ ] **2.4.7** Keyboard focus is visible (not `outline: none`)
- [ ] **2.5.3** Labels match visible text (no mismatch between `aria-label` and visible label)

#### Understandable

- [ ] **3.2.2** Form submission doesn't change context unexpectedly
- [ ] **3.3.1** Input errors are identified and described in text
- [ ] **3.3.2** Form labels and instructions are provided

#### Robust

- [ ] **4.1.1** Valid HTML (no duplicate IDs, proper nesting)
- [ ] **4.1.2** All UI components have name, role, and value exposed
- [ ] **4.1.3** Status messages announced without focus (via `role="status"` or `aria-live`)

### Step 3 — Check Color Contrast

For any color pairs provided, calculate the contrast ratio:

**Formula:** L1 + 0.05 / L2 + 0.05 (where L1 is lighter, L2 is darker relative luminance)

| Text type                        | Required ratio |
| -------------------------------- | -------------- |
| Normal text (<18pt / <14pt bold) | 4.5:1          |
| Large text (≥18pt or ≥14pt bold) | 3:1            |
| UI components (borders, icons)   | 3:1            |

Common failures:

- Light gray text on white: `#767676` on `#FFFFFF` = 4.48:1 ❌ (barely fails)
- Use `#757575` on `#FFFFFF` = 4.60:1 ✅

### Step 4 — Produce the Audit Report

```markdown
## Accessibility Audit Report

_Date: [YYYY-MM-DD] | Standard: WCAG 2.1 AA | Scope: [Component name]_

### Critical Issues (must fix before launch)

#### ❌ Missing alt text on images

**Location:** `<img src="hero.jpg">` (line 12)
**WCAG:** 1.1.1 Non-text content
**Fix:**
\`\`\`html
<img src="hero.jpg" alt="Team members collaborating at a whiteboard">

<!-- For decorative images: -->
<img src="divider.svg" alt="" role="presentation">
\`\`\`

#### ❌ Insufficient color contrast

**Location:** `.hint-text { color: #9CA3AF; }` on white background
**Ratio:** 2.85:1 (required: 4.5:1)
**Fix:** Change to `color: #6B7280` (4.54:1 ✅) or darken further.

### High Priority Issues

#### ⚠️ No visible focus indicator

**Location:** `button { outline: none; }`
**WCAG:** 2.4.7 Focus Visible
**Fix:**
\`\`\`css
button:focus-visible {
outline: 2px solid #2563EB;
outline-offset: 2px;
}
\`\`\`

### Medium Priority

#### ℹ️ Form field missing associated label

**Location:** `<input type="email" placeholder="Email">` (line 34)
**WCAG:** 1.3.1, 3.3.2
**Fix:**
\`\`\`html
<label for="email">Email address</label>
<input id="email" type="email" placeholder="alice@example.com">
\`\`\`

### Passed ✅

- Heading hierarchy is correct (h1 → h2 → h3)
- Buttons use `<button>` element (not `<div>`)
- Form submit is keyboard accessible

### Summary

| Severity | Count |
| -------- | ----- |
| Critical | 2     |
| High     | 1     |
| Medium   | 1     |
| Passed   | 3     |
```

---

## Common Quick Fixes Reference

| Issue            | Fix                                                               |
| ---------------- | ----------------------------------------------------------------- |
| `<div onClick>`  | Replace with `<button type="button">`                             |
| `outline: none`  | Use `outline: none` only on `:focus` + add `:focus-visible` style |
| Icon-only button | Add `aria-label="Close dialog"`                                   |
| Empty link       | Add `aria-label` or meaningful text content                       |
| `<img>` no alt   | Add `alt=""` for decorative, descriptive text for informational   |
| Modal focus trap | Use `focus-trap` library or `inert` attribute                     |
| Toast/snackbar   | Add `role="status"` or `aria-live="polite"`                       |
| Loading state    | Add `aria-busy="true"` to the loading container                   |

---

## Output Format

Audit report Markdown as shown above, with issues grouped by severity.

---

## Safety & Confirmation

- Distinguish critical (breaks functionality for disabled users) from advisory (best practice) issues.
- Don't mark `aria-label` additions as required if visible label text already exists — that's a different pattern.
- Note that this is a code-level review; full a11y testing requires testing with actual screen readers (NVDA, VoiceOver, JAWS).
