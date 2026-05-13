---
name: release-notes-generator
description: |
  Generates polished, user-facing release notes for product launches, version bumps,
  and feature announcements. Use this skill whenever a user says "write release notes",
  "draft an announcement for this release", "generate patch notes", "what should I
  tell users about this update?", or "write a product update email". Also activate
  when a user wants release copy for app store listings, blog posts, or in-app
  banners. This skill focuses on clear, benefit-oriented language for end users —
  not developer changelogs. Do NOT use for raw CHANGELOG.md entries (use
  changelog-writer) or internal dev docs.
---

# Release Notes Generator

Create compelling, benefit-oriented release notes that tell users what changed and
why it matters to them — not just what the engineering team did.

## When to Use

- Shipping a new version and need app store or in-app release notes
- Writing a "what's new" section for a product update email or blog post
- Announcing a feature publicly after it was shipped
- Creating a release summary for customer-facing docs

## When NOT to Use

- Internal changelogs for developers (use `changelog-writer`)
- API reference documentation
- Marketing copy for brand-new product launches (not version updates)

---

## Workflow

### Step 1 — Understand the Release

Collect:

1. **What changed:** Features added, bugs fixed, performance improvements, removed items
2. **Version / release name** (e.g., "v3.0", "Spring 2025 Update", "Hotfix 1.2.1")
3. **Audience:** Consumer app users, B2B customers, developers using your API?
4. **Tone:** Formal / friendly / playful / neutral
5. **Channel:** In-app dialog, email, app store listing, blog, social post

### Step 2 — Translate to User Benefits

For each change, ask: "What does this mean for the user?"

| Technical change                       | User benefit framing                                  |
| -------------------------------------- | ----------------------------------------------------- |
| Reduced dashboard load from 8s to 1.2s | Pages load up to 6× faster                            |
| Added TOTP 2FA                         | Keep your account safe with two-factor authentication |
| Deprecated mobile API v1               | Improved reliability for the mobile app               |
| Fixed null pointer in profile          | Profile page no longer crashes when bio is empty      |

Drop or minimize chores and internal refactors unless they have visible impact.

### Step 3 — Structure the Notes

Use a clear, scannable structure:

```
## What's New in [Version / Release Name]

### ✨ New Features
- **[Feature name]:** Short benefit description (1–2 sentences)

### 🐛 Bug Fixes
- Fixed [issue description] so that [user benefit]

### ⚡ Performance
- [Metric improvement] — e.g., "Reports export 3× faster"

### 🔒 Security
- [Plain-language security improvement]

### 📣 Coming Up
- [Optional teaser for next release]
```

Adapt headings and emoji to the brand tone. Remove empty sections.

### Step 4 — Tailor to Channel

| Channel           | Adjustments                                            |
| ----------------- | ------------------------------------------------------ |
| App store listing | ≤500 chars, scannable bullets, no markdown             |
| In-app dialog     | ≤200 words, conversational, highlight top 2–3 changes  |
| Email             | Subject line + intro sentence + bulleted list          |
| Blog              | Longer narrative with screenshots mentioned, SEO title |
| Social post       | 1–3 sentences, emoji OK, include version number        |

### Step 5 — Present and Refine

Show the draft and ask:

- "Does the tone match your brand?"
- "Are there features or fixes I should highlight more?"
- "Do you need a shorter version for the app store?"

---

## Output Format

Default: Markdown suitable for a "What's New" page or email body.

### App Store Template (≤500 chars)

```
v[VERSION] — [Month Year]
• [Benefit 1]
• [Benefit 2]
• [Benefit 3]
Bug fixes and performance improvements.
```

### In-App Dialog Template

```markdown
## What's New 🎉

**[Top feature]** — [One sentence benefit].
Plus: [Feature 2], [Fix 1], and [X] more improvements.
[See full notes →]
```

---

## Safety & Confirmation

- Never reveal security vulnerability details in release notes. Use: "Security improvements to protect your account."
- If a feature is still rolling out (e.g., A/B test), note: "rolling out to all users over the next [N] days."
- Confirm before finalizing any public-facing copy.
