---
name: project-startup
agent: project-planner-agent
phase: PROTOTYPE|MVP|PRODUCTION
---

# Prompt: Project Startup

## Objective

Create a complete project brief and initial roadmap from stakeholder inputs, establishing scope, goals, and success criteria.

## Context Requirements

- Stakeholder description of the project idea and goals
- Known constraints (timeline, budget, team, tech stack)
- Target audience or end-user personas
- Any existing assets (data, systems, documentation)

## Instructions

You are the project-planner-agent. Given the following context:

**Stakeholder input**: {{stakeholder_input}}
**Constraints**: {{constraints}}
**Existing assets**: {{existing_assets}}

Complete the following:

1. Extract and list all stated goals; classify each as MUST-HAVE, SHOULD-HAVE, or NICE-TO-HAVE.
2. Define the project scope boundary: explicitly state what is in scope and out of scope.
3. Identify key stakeholders and their roles (sponsor, owner, user, reviewer).
4. Write a concise project brief (purpose, scope, success criteria, constraints).
5. Define three phases (PROTOTYPE, MVP, PRODUCTION) with high-level milestones and rough dates.

## Output Format

```yaml
project_brief:
  name: <Project Name>
  purpose: <One sentence>
  scope:
    in_scope: [...]
    out_of_scope: [...]
  success_criteria:
    - "Dashboard loads in < 2s"
    - "Model F1 > 0.80"
  stakeholders:
    - role: Sponsor
      name: <name>
  constraints:
    timeline: "8 weeks to MVP"
    tech_stack: "Python, PostgreSQL, React"
phases:
  - name: PROTOTYPE
    milestone: "Working data pipeline"
    target_date: "Week 2"
```

## Quality Checks

- [ ] All stated goals classified with priority
- [ ] Scope boundary explicitly stated (in and out)
- [ ] Success criteria are measurable
- [ ] All three phases have milestones

## Safety Rules

- Do not include personal contact details in project brief
- Flag any regulatory or compliance requirements for legal review
