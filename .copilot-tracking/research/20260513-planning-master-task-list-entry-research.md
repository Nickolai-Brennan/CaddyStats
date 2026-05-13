<!-- markdownlint-disable-file -->

# Research: Planning Master Task List Entry

**Task Source**: `Planning/Master Task List Consolidated.md`
**Task**: Create a `.copilot-tracking` task entry that mirrors the consolidated Planning master task list and preserves source links to the Planning folder task artifacts.
**Research Date**: 2026-05-13

## Objective

Compile the repository evidence needed to create a new `.copilot-tracking` task entry that follows the existing implementation-tracking format while using the consolidated Planning master task list as the canonical scope source.

## Repository Evidence

### 1. Existing `.copilot-tracking` Format

- `.copilot-tracking/plans/20260513-phase0-vision-foundation-plan.instructions.md` (Lines 1-81)
  - Confirms plan files use `applyTo` frontmatter, an overview/objectives section, research and standards references, grouped implementation phases, dependencies, and success criteria.

- `.copilot-tracking/details/20260513-phase0-vision-foundation-details.md` (Lines 1-151)
  - Confirms details files expand each checklist task with files, success criteria, research references, and dependencies.

- `.copilot-tracking/changes/20260513-phase0-vision-foundation-changes.md` (Lines 1-19)
  - Confirms changes files start with `<!-- markdownlint-disable-file -->`, link back to the related plan, and initialize Added/Modified/Removed sections.

- `.copilot-tracking/prompts/implement-phase0-vision-foundation.prompt.md` (Lines 1-46)
  - Confirms prompt files reference the implementation instructions and the matching plan/details/changes files.

### 2. Canonical Planning Scope

- `Planning/Master Task List Consolidated.md` (Lines 15-165)
  - Provides the deduplicated cross-phase execution checklist that already merges task scope across Phase 0 through Phase 12 and Phase X.
  - Supplies the canonical task wording that should be mirrored into the new `.copilot-tracking` entry.

- `Planning/Master Task List Consolidated.md` (Lines 169-212)
  - Documents the supporting scope notes, deduplication rule, and maintenance rule that should remain referenced in the task entry.

### 3. Phase-Level Source Planning Files

- `Planning/Master Task List Phase 0.md`
- `Planning/Master Task List Phase 1.md`
- `Planning/Master Task List Phase 2.md`
- `Planning/Master Task List Phase 3.md`
- `Planning/Master Task List Phase 4.md`
- `Planning/Master Task List Phase 5.md`
- `Planning/Master Task List Phase 6.md`
- `Planning/Master Task List Phase 7.md`
- `Planning/Master Task List Phase 8.md`
- `Planning/Master Task List Phase 9.md`
- `Planning/Master Task List Phase 10.md`
- `Planning/Master Task List Phase 11.md`
- `Planning/Master Task List Phase 12.md`
- `Planning/Master Task List Phase X.md`

These files remain the underlying source artifacts for the canonical consolidated master list and should be referenced as supporting context in the task entry.

### 4. Standards Reference

- `AI Control/Powers/instructions/task-implementation.instructions.md` (Lines 1-203)
  - Defines the required relationship between prompt, plan, details, and changes files.
  - Requires the changes file to exist up front and to be updated during implementation.

## Recommended Entry Structure

Create one complete `.copilot-tracking` entry set using a single slug and matching file names across:

- `.copilot-tracking/research/`
- `.copilot-tracking/details/`
- `.copilot-tracking/plans/`
- `.copilot-tracking/changes/`
- `.copilot-tracking/prompts/`

The plan should mirror the canonical task bullets from `Planning/Master Task List Consolidated.md`, grouped by phase. The details file should preserve traceability back to the consolidated file and corresponding phase-specific Planning files.

## Constraints

- Preserve `Planning/Master Task List Consolidated.md` as the canonical task source.
- Follow the existing `.copilot-tracking` naming and section format.
- Keep the new entry focused on tracking scope creation only; do not alter the Planning task wording beyond minor normalization for checklist formatting.
