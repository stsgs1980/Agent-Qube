# Subagent-Driven Development (GLM Condensed)

Execute plan by dispatching one fresh subagent per task, with two-stage review after each.

## Process

1. Read plan once, extract all tasks with full text, create TodoWrite
2. For each task:
   a. Dispatch implementer subagent (general-purpose)
   b. If implementer asks questions, answer and re-dispatch
   c. Dispatch spec compliance reviewer subagent
   d. If issues found, implementer fixes, re-review
   e. Dispatch code quality reviewer subagent
   f. If issues found, implementer fixes, re-review
   g. Mark task complete
3. After all tasks: dispatch final code reviewer
4. Use finishing-a-development-branch skill

## Subagent Dispatch Format (Z.ai)

```text
Task(
  subagent_type: "general-purpose",
  description: "...",
  prompt: """..."""
)
```markdown

## Implementer Status Handling

- **DONE**: proceed to spec review
- **DONE_WITH_CONCERNS**: review concerns, proceed if minor
- **NEEDS_CONTEXT**: provide missing info, re-dispatch
- **BLOCKED**: assess - more context? more capable model? break into pieces? escalate?

## Key Rules

- Do NOT pause between tasks - execute continuously
- Do NOT dispatch multiple implementers in parallel (conflicts)
- Do NOT make subagent read the plan file - paste full text instead
- Do NOT skip reviews
- Spec compliance review BEFORE code quality review