# Workflow: 00-project-intake

## Overview

Captures project requirements, defines scope, stakeholders, deliverables, and success criteria. Use this as the mandatory entry point for every new project. Produces the project brief, roadmap, milestones, and risk register that all downstream workflows consume.

## Phase

PROTOTYPE · MVP · PRODUCTION

## Participants

| Agent                 | Role                                               |
| --------------------- | -------------------------------------------------- |
| orchestrator-agent    | Coordinates workflow execution and gates each step |
| project-planner-agent | Elicits requirements, writes brief, builds roadmap |

## Inputs

- Stakeholder description and project idea (free text)
- Any existing constraints (budget, timeline, tech stack)

## Outputs

- `project_brief.md`
- `roadmap.md`
- `milestones.md`
- `risk_register.md`

## Steps

### Step 1: Requirements Elicitation (Agent: project-planner-agent)

**Action**: Interview stakeholders to extract goals, scope, personas, and constraints.
**Inputs**: Raw stakeholder notes or prompt responses.
**Outputs**: Structured requirements list.
**Saves to**: `docs/agent-outputs/project-planner-agent/`

### Step 2: Project Brief Draft (Agent: project-planner-agent)

**Action**: Compile requirements into a signed-off project brief.
**Inputs**: Structured requirements list.
**Outputs**: `project_brief.md`
**Saves to**: `docs/agent-outputs/project-planner-agent/`

### Step 3: Roadmap and Milestones (Agent: project-planner-agent)

**Action**: Generate phased roadmap (PROTOTYPE → MVP → PRODUCTION) with milestone dates.
**Inputs**: `project_brief.md`
**Outputs**: `roadmap.md`, `milestones.md`
**Saves to**: `docs/agent-outputs/project-planner-agent/`

### Step 4: Risk Register (Agent: project-planner-agent)

**Action**: Identify top risks, assign likelihood/impact scores, and define mitigations.
**Inputs**: `project_brief.md`, `roadmap.md`
**Outputs**: `risk_register.md`
**Saves to**: `docs/agent-outputs/project-planner-agent/`

### Step 5: Orchestrator Sign-off (Agent: orchestrator-agent)

**Action**: Review outputs for completeness; gate release to WF-01.
**Inputs**: All four output files.
**Outputs**: Workflow completion status.

## Success Criteria

- [ ] `project_brief.md` contains goals, scope, stakeholders, and success criteria
- [ ] `roadmap.md` covers all three phases with dates
- [ ] `risk_register.md` lists at least three risks with mitigations
- [ ] Orchestrator has approved all outputs

## Error Handling

| Scenario                  | Response                                          |
| ------------------------- | ------------------------------------------------- |
| Missing stakeholder input | Halt; request input from project owner            |
| Conflicting requirements  | Flag to orchestrator; schedule resolution meeting |
| Agent failure             | Log error; notify orchestrator; retry step        |

## Safety Gates

- [ ] No secrets in any output files
- [ ] Confirmation required before destructive operations
- [ ] All outputs saved to correct output directory
