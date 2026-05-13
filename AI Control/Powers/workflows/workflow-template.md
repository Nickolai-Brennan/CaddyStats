# Workflow: <number>-<name>

## Overview

[One paragraph: what this workflow accomplishes, when to use it, what it produces.]

## Phase

<PROTOTYPE | MVP | PRODUCTION>

## Participants

| Agent              | Role                           |
| ------------------ | ------------------------------ |
| orchestrator-agent | Coordinates workflow execution |
| <agent-name>       | <role in this workflow>        |

## Inputs

- [Input 1 — be specific: file name and source workflow]
- [Input 2]

## Outputs

- [Output 1 — file name and format]
- [Output 2]

## Steps

### Step 1: <Name> (Agent: <agent-name>)

**Action**: [What the agent does — imperative, specific]
**Inputs**: [What it receives]
**Outputs**: [What it produces]
**Saves to**: `docs/agent-outputs/<agent-name>/`

### Step 2: <Name> (Agent: <agent-name>)

**Action**: [What the agent does]
**Inputs**: [What it receives]
**Outputs**: [What it produces]
**Saves to**: `docs/agent-outputs/<agent-name>/`

## Success Criteria

- [ ] [Criterion 1 — measurable]
- [ ] [Criterion 2]

## Error Handling

| Scenario       | Response                                      |
| -------------- | --------------------------------------------- |
| Missing input  | Escalate to orchestrator; halt until resolved |
| Agent failure  | Log error; notify orchestrator; retry or skip |
| Output invalid | Flag in output file; create follow-up task    |

## Safety Gates

- [ ] No secrets in any output files
- [ ] Confirmation required before destructive operations
- [ ] All outputs saved to correct output directory
