---
name: zai-code-planning
description: Plan code implementation tasks in Z.ai. Use this skill before starting any multi-step code task (Type 3) — when the user says "build a feature", "build a", "implement X", "implement a", "set up a project", "add an API endpoint", "create an API", "refactor this module", "let's plan this out", or "plan the implementation". For document/report/chart planning (Type 1/2), the built-in Outline tool handles that — do NOT use this skill. Routes between detailed plans (code) and outline mode (documents) based on task type.
---

# Z.ai Code Planning

## Overview

Write comprehensive implementation plans with bite-sized tasks. Document everything needed: which files to touch for each task, code, testing, how to test it. DRY. YAGNI. TDD. Frequent commits.

**Announce at start:** "I'm using the code planning skill to create the implementation plan."

## When to Use

- Building a new feature or component (3+ files or steps)
- Refactoring existing code with a clear target state
- Setting up a new project (config, dependencies, structure)
- Implementing an API endpoint or data pipeline

## When NOT to Use

- The task is a document, report, or presentation — use the Outline tool instead (Type 1/2)
- The task is a single-line fix or trivial change — just do it
- The user said "just do it" or "skip planning" — respect that
- Data visualization (Type 2) — use the charts skill

## File Structure

Before defining tasks, map out which files will be created or modified and what each one is responsible for.

- Design units with clear boundaries and well-defined interfaces. Each file should have one clear responsibility.
- Files that change together should live together. Split by responsibility, not by technical layer.
- In existing codebases, follow established patterns. If a file has grown unwieldy, including a split in the plan is reasonable.

## Planning Process

### Step 1: Understand the Target

Write a one-sentence goal. If you can't, ask the user to clarify what "done" looks like.

**Good:** "Add a login page with email/password that stores sessions in cookies"
**Bad:** "Fix the auth stuff" (what auth? what's broken? what's the fix?)

### Step 2: List Files to Change

Write down every file you will create or modify. Include the full path.

```
Create: src/app/api/auth/route.ts
Modify: src/app/layout.tsx (add session provider)
Create: src/components/LoginForm.tsx
Modify: src/middleware.ts (add auth check)
```

### Step 3: Order the Steps

Steps should be ordered so each one is independently verifiable. Prefer this order:
1. Types and interfaces (if needed)
2. Backend / data layer
3. Frontend components that consume the data
4. Integration / wiring
5. Tests
6. Commit

### Step 4: Write the Plan — No Placeholders

Every step must contain the actual content needed. These are **plan failures** — never write them:
- "TBD", "TODO", "implement later", "fill in details"
- "Add appropriate error handling" / "add validation" / "handle edge cases"
- "Write tests for the above" (without actual test code)
- "Similar to Task N" (repeat the code — it may be read out of order)
- Steps that describe what to do without showing how (code blocks required for code steps)
- References to types, functions, or methods not defined in any task

Use the TodoWrite tool to create the task list. Each task should be specific enough that someone could execute it without guessing.

**Bad:** "Set up auth"
**Good:** "Create `src/app/api/auth/route.ts` with POST handler that validates email/password against the users table and returns a session cookie"

## Task Structure

````markdown
### Task N: [Component Name]

**Files:**
- Create: `exact/path/to/file.py`
- Modify: `exact/path/to/existing.py:123-145`
- Test: `tests/exact/path/to/test.py`

- [ ] **Step 1: Write the failing test**

```
def test_specific_behavior():
    result = function(input)
    assert result == expected
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/path/test.py::test_name -v`
Expected: FAIL with "function not defined"

- [ ] **Step 3: Write minimal implementation**

```
def function(input):
    return expected
```

- [ ] **Step 4: Run test to verify it passes**

- [ ] **Step 5: Commit**
````

## Plan Size Guide

| Task complexity | Plan detail |
|----------------|------------|
| Single function fix | No plan needed, just do it |
| 2-4 files | 3-5 todo items |
| Feature (5+ files) | 8-15 todo items with file paths |
| Full project setup | 15+ items, consider using subagents |

## Self-Review

After writing the complete plan, check it against the requirement. This is a checklist you run yourself — not a subagent dispatch.

**1. Requirement coverage:** Can you point to a task that implements each requirement? List any gaps.

**2. Placeholder scan:** Search for red flags — any of the patterns from the "No Placeholders" section. Fix them.

**3. Type consistency:** Do the types, method signatures, and property names match across tasks? A function called `clearLayers()` in Task 3 but `clearFullLayers()` in Task 7 is a bug.

If you find issues, fix them inline. If you find a requirement with no task, add the task.

## Execution and Updates

As you complete each task:
1. Mark it complete
2. If the plan needs to change (you discovered a dependency, a step is no longer needed), update the list
3. Don't let the plan go stale — if reality diverges, the plan should catch up

## Integration with Other Skills

- `zai-debugging` — if a step fails
- `sp-test-driven-development` — if you want tests before implementation
- `sp-subagent-driven-development` — if steps can run in parallel
- `zai-verify-before-claim` — before marking the final task complete