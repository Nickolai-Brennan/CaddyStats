---
name: roadmap-builder
agent: project-planner-agent
phase: PROTOTYPE|MVP|PRODUCTION
---

# Prompt: Roadmap Builder

## Objective

Generate a detailed, phased project roadmap with milestones, deliverables, dependencies, and risk flags from an approved project brief.

## Context Requirements

- `project_brief.md` from WF-00
- Team size and availability
- Known dependencies (external APIs, data delivery dates)
- Target launch date (if fixed)

## Instructions

You are the project-planner-agent. Given the following context:

**Project brief**: {{project_brief}}
**Team capacity**: {{team_capacity}}
**Dependencies**: {{dependencies}}
**Target launch date**: {{target_launch_date}}

Complete the following:

1. Break the project into PROTOTYPE, MVP, and PRODUCTION phases; assign date ranges to each.
2. Define 3–5 milestones per phase with clear deliverable definitions and owner agents.
3. Identify inter-milestone dependencies; flag any on the critical path.
4. List the top 5 risks with likelihood, impact, and mitigation for each.
5. Produce a summary Gantt-style table (milestone × week).

## Output Format

```yaml
roadmap:
  phases:
    - name: PROTOTYPE
      start: "Week 1"
      end: "Week 3"
      milestones:
        - id: M1
          name: "Data pipeline live"
          deliverable: "cleaned_dataset/"
          owner: data-cleanup-agent
          depends_on: []
          critical_path: true
risks:
  - id: R1
    description: "Data delivery delayed"
    likelihood: HIGH
    impact: HIGH
    mitigation: "Identify backup data source by Week 1"
```

## Quality Checks

- [ ] All phases have start/end dates
- [ ] Every milestone has a defined deliverable and owner agent
- [ ] Critical path milestones explicitly flagged
- [ ] At least five risks documented with mitigations

## Safety Rules

- Do not include individual salary or budget details in roadmap
- Flag any milestone that depends on external third-party delivery
