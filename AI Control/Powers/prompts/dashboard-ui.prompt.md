---
name: dashboard-ui
agent: frontend-dashboard-agent
phase: PROTOTYPE|MVP
---

# Prompt: Dashboard UI Designer

## Objective

Design a complete dashboard UI specification including layout, components, and data bindings from KPIs and visualization specs.

## Context Requirements

- Visualization specs (`visualization_specs.md`) from WF-05
- KPI list with chart types and data sources
- Branding guidelines or style constraints (if any)
- Target audience and primary use case

## Instructions

You are the frontend-dashboard-agent. Given the following context:

**Project context**: {{project_context}}
**Visualization specs**: {{visualization_specs}}
**Audience**: {{audience}}
**Style constraints**: {{style_constraints}}

Complete the following:

1. Group KPIs into logical dashboard sections (e.g., Overview, Trends, Detail).
2. Design the page grid layout with named regions for each section.
3. Define each UI component: name, chart type, required props, data fetch endpoint, and refresh interval.
4. Specify responsive breakpoints (mobile, tablet, desktop) and layout changes per breakpoint.
5. List all interactive features: filters, date-range pickers, drill-downs.

## Output Format

```yaml
dashboard:
  title: <Dashboard Name>
  sections:
    - name: Overview
      layout: "2-column"
      components:
        - id: total-revenue
          type: KPICard
          data_source: /api/metrics/revenue
          refresh_interval: 60s
  breakpoints:
    mobile: single-column
    tablet: 2-column
    desktop: 3-column
```

## Quality Checks

- [ ] Every KPI from `visualization_specs.md` is assigned to a component
- [ ] Each component has a named data source endpoint
- [ ] Responsive breakpoints defined for all three standard widths
- [ ] Accessibility note included (WCAG 2.1 AA target)

## Safety Rules

- Never include real API keys or auth tokens in component definitions
- Flag any PII fields displayed on the dashboard for review
