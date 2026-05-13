# Workflow: 10-launch-review

## Overview

Performs pre-launch readiness review, generates the changelog, cleans the repo, and produces a go/no-go recommendation. Run as the final workflow before any PROTOTYPE, MVP, or PRODUCTION release.

## Phase

MVP · PRODUCTION

## Participants

| Agent                  | Role                                                 |
| ---------------------- | ---------------------------------------------------- |
| orchestrator-agent     | Coordinates review; issues final go/no-go sign-off   |
| repo-maintenance-agent | Audits repo health and generates changelog           |
| marketing-agent        | Reviews launch messaging and external-facing content |

## Inputs

- All outputs from WF-00 through WF-09
- Previous release tag (for changelog diff)
- Launch messaging brief (if applicable)

## Outputs

- `launch_checklist.md`
- `changelog.md`
- `repo_health_report.md`
- `go_no_go_recommendation.md`

## Steps

### Step 1: Repo Health Audit (Agent: repo-maintenance-agent)

**Action**: Scan for stale branches, large files, secrets in history, and unresolved TODOs.
**Inputs**: Current repo state.
**Outputs**: `repo_health_report.md`
**Saves to**: `docs/agent-outputs/repo-maintenance-agent/`

### Step 2: Changelog Generation (Agent: repo-maintenance-agent)

**Action**: Compile changelog from merged PRs and commits since last release tag.
**Inputs**: Git log, previous release tag.
**Outputs**: `changelog.md`
**Saves to**: `docs/agent-outputs/repo-maintenance-agent/`

### Step 3: Launch Checklist (Agent: repo-maintenance-agent)

**Action**: Verify all upstream workflow outputs exist and meet success criteria; produce checklist.
**Inputs**: All prior workflow outputs.
**Outputs**: `launch_checklist.md`
**Saves to**: `docs/agent-outputs/repo-maintenance-agent/`

### Step 4: Marketing Review (Agent: marketing-agent)

**Action**: Review README, changelog, and launch messaging for accuracy and tone.
**Inputs**: `README.md`, `changelog.md`, launch messaging brief.
**Outputs**: Reviewed and approved content notes.
**Saves to**: `docs/agent-outputs/marketing-agent/`

### Step 5: Go / No-Go (Agent: orchestrator-agent)

**Action**: Aggregate all checklist results; issue go/no-go recommendation with reasoning.
**Inputs**: `launch_checklist.md`, `repo_health_report.md`, marketing review notes.
**Outputs**: `go_no_go_recommendation.md`
**Saves to**: `docs/agent-outputs/orchestrator-agent/`

## Success Criteria

- [ ] `launch_checklist.md` has zero blocking items
- [ ] `repo_health_report.md` shows no secrets in history
- [ ] `go_no_go_recommendation.md` is explicitly "GO" before release proceeds

## Error Handling

| Scenario                         | Response                                             |
| -------------------------------- | ---------------------------------------------------- |
| Blocking item found in checklist | Halt release; assign remediation task                |
| Secret detected in git history   | Halt immediately; initiate secret-rotation procedure |
| Marketing review fails           | Revise content; re-run step 4                        |

## Safety Gates

- [ ] No secrets in any output files
- [ ] Human approval required for go/no-go decision
- [ ] All outputs saved to correct output directory
