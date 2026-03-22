---
name: tracking-project-context
description: Maintains persistent understanding of a codebase and task progress across sessions. Use when starting work on an existing project, resuming tasks, or when the user mentions continuing work, updating progress, or reviewing a codebase.
---

# Project Context Tracking

## When to use this skill
- User says: "continue project", "resume work", "tiếp tục", "làm tiếp"
- Starting work on an existing repo
- After completing a task (to update progress)
- When unclear about current project state

---

## Workflow

### 1. Initialize / Resume Context

- [ ] Check if `docs/project-context.md` exists
- [ ] If exists → read and summarize current state
- [ ] If not → create initial context

---

### 2. Explore Codebase

- [ ] Identify project type (web, backend, CLI, AI, etc.)
- [ ] Locate key entry points (e.g., `main.py`, `app.tsx`)
- [ ] Map important directories (src/, api/, components/, etc.)
- [ ] Detect frameworks/libraries used
- [ ] Summarize architecture in ≤10 bullet points

---

### 3. Track Current Work

- [ ] Identify current feature/task in progress
- [ ] Extract TODOs from code/comments if present
- [ ] Ask user if unclear: "What are we currently trying to complete?"

---

### 4. Update Persistent Context

Update `docs/project-context.md`:

```markdown
# Project Context

## Overview
[Short description of project]

## Tech Stack
- [frameworks, languages]

## Architecture
- [key components]

## Current Tasks
- [ ] Task 1
- [ ] Task 2

## In Progress
- Current focus: [task]

## Completed
- [x] Task done

## Next Steps
- [next logical actions]

## Notes
- [important constraints/decisions]
```

### 5. End-of-Task Update (MANDATORY)

After ANY meaningful work:
- Update completed tasks
- Move finished items → Completed
- Set next task
- Save file

---

## Instructions

### Context Priority
1. `docs/project-context.md` (source of truth)
2. Actual codebase
3. User input

### Behavior Rules
- NEVER start implementation before understanding context
- ALWAYS read context file first if it exists
- ALWAYS update context after work
- KEEP summaries concise and structured
- DO NOT duplicate information unnecessarily (DRY)

### If Context Missing or Outdated
- Reconstruct from codebase
- Ask user only if critical ambiguity exists

### Validation Loop

Before starting any task:
1. Read `project-context.md`
2. Confirm current task
3. Validate against codebase
4. Proceed
