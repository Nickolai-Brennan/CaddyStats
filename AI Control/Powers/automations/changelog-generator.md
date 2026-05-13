---
name: changelog-generator
schedule: "on release tag push"
trigger: webhook
agent: repo-maintenance-agent
---

# Automation: Changelog Generator

## Purpose

Generate a formatted changelog entry from all merged PRs and relevant commits since the last release tag, triggered automatically on each new release tag push.

## Schedule

- **Frequency**: On demand (every release)
- **Time**: Triggered by `push` event on tags matching `v*`
- **Trigger type**: Webhook (GitHub Actions — `on: push: tags: ['v*']`)

## Steps

1. Identify the previous release tag by listing tags sorted by date and selecting the one before the new tag.
2. Collect all merged PRs with merge commits between previous tag and new tag.
3. Classify each PR by label: `feat`, `fix`, `chore`, `docs`, `security`, `breaking`.
4. Group entries by classification; sort breaking changes to the top.
5. Write `CHANGELOG.md` entry in Keep a Changelog format and commit it to the release branch.

## Inputs

- New release tag (from webhook payload)
- Previous release tag (derived from git tag list)
- Merged PR list with labels (GitHub API)

## Outputs / Notifications

- Updated `CHANGELOG.md` with new version entry
- **Notification channel**: PR comment on the release PR with changelog preview

## Success Criteria

- [ ] All merged PRs since last tag included in changelog
- [ ] Breaking changes section present if any `breaking` labels exist
- [ ] `CHANGELOG.md` committed and pushed before release is published

## Error Handling

| Scenario              | Response                                                     |
| --------------------- | ------------------------------------------------------------ |
| No previous tag found | Treat all commits as new; label section as "Initial Release" |
| PR has no label       | Classify as `chore`; note in changelog                       |
| Commit push fails     | Log error; post changelog as PR comment instead              |

## Safety Rules

- Never commit or log secrets found during scan
- Never modify commits or rewrite history; append only to CHANGELOG.md
- Require human approval of the release PR before publishing the release
