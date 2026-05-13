# Workflow: 05-dashboard-build

## Overview

Designs and specifies the analytics or operational dashboard UI. Produces visualization specs, component plans, and page layouts that frontend-dashboard-agent can implement. Run after WF-03 (and WF-04 if model outputs are displayed).

## Phase

PROTOTYPE · MVP

## Participants

| Agent                     | Role                                                     |
| ------------------------- | -------------------------------------------------------- |
| orchestrator-agent        | Coordinates design tasks and validates completeness      |
| stats-visualization-agent | Defines chart types, data mappings, and visual hierarchy |
| frontend-dashboard-agent  | Translates specs into component and layout plans         |

## Inputs

- `key_insights.md` from WF-03
- `project_brief.md` from WF-00 (audience and goals)
- Branding / style guide (if available)

## Outputs

- `visualization_specs.md`
- `component_plan.md`
- `page_layout.md`

## Steps

### Step 1: KPI and Metric Selection (Agent: stats-visualization-agent)

**Action**: Identify the top 5–10 KPIs to display; map each to a chart type and data source.
**Inputs**: `key_insights.md`, project goals.
**Outputs**: KPI list with chart-type mappings.
**Saves to**: `docs/agent-outputs/stats-visualization-agent/`

### Step 2: Visualization Specs (Agent: stats-visualization-agent)

**Action**: Write detailed spec for each chart: type, axes, filters, color encoding, and refresh rate.
**Inputs**: KPI list.
**Outputs**: `visualization_specs.md`
**Saves to**: `docs/agent-outputs/stats-visualization-agent/`

### Step 3: Component Plan (Agent: frontend-dashboard-agent)

**Action**: Map visualization specs to reusable UI components; note state, props, and data fetch strategy.
**Inputs**: `visualization_specs.md`
**Outputs**: `component_plan.md`
**Saves to**: `docs/agent-outputs/frontend-dashboard-agent/`

### Step 4: Page Layout (Agent: frontend-dashboard-agent)

**Action**: Design grid layout, navigation, responsive breakpoints, and interaction patterns.
**Inputs**: `component_plan.md`
**Outputs**: `page_layout.md`
**Saves to**: `docs/agent-outputs/frontend-dashboard-agent/`

## Success Criteria

- [ ] Every KPI has a chart spec with defined data source and refresh rate
- [ ] `component_plan.md` covers all components without gaps
- [ ] Layout is responsive and accessible (WCAG 2.1 AA noted)

## Error Handling

| Scenario                        | Response                                                |
| ------------------------------- | ------------------------------------------------------- |
| Data source missing for a KPI   | Flag in visualization_specs; mark as blocked            |
| Component library not specified | Default to plain HTML/CSS; note for implementation team |
| Conflicting layout requirements | Escalate to orchestrator for stakeholder decision       |

## Safety Gates

- [ ] No secrets in any output files
- [ ] Confirmation required before destructive operations
- [ ] All outputs saved to correct output directory
