# Using Skills (GLM Condensed)

<SUBAGENT-STOP>
If you were dispatched as a subagent, skip this skill.
</SUBAGENT-STOP>

<EXTREMELY-IMPORTANT>
If a skill might apply to your task, you MUST invoke it. No exceptions.
User instructions always take priority over skills.
</EXTREMELY-IMPORTANT>

## How to Access Skills

Use `Skill(command="skill-name")`. The skill name is the directory name (e.g., `brainstorming`, `test-driven-development`).

## Tool Mapping

Z.ai uses the same tool names as Claude Code for most tools: Read, Write, Edit, Bash, Grep, Glob, Skill, Task, TodoWrite, TodoRead.

Key differences:
- **Task**: use `subagent_type` parameter (e.g., `"general-purpose"`, `"Explore"`)
- **Web**: use `Skill(command="web-search")` or `Skill(command="web-reader")`
- **No EnterPlanMode/ExitPlanMode**: use brainstorming/writing-plans skills directly
- **Bash**: no background execution; set longer timeout for long commands
- See `references/zcode-tools.md` for full mapping

## The Rule

Invoke relevant skills BEFORE any response. Even 1% chance = invoke it.

Flow: User message -> Check if skill applies -> If yes: invoke Skill, announce, follow instructions -> If no: respond directly

## Skill Priority

1. Process skills first (brainstorming, debugging) - HOW to approach
2. Implementation skills second (TDD, patterns) - guide execution

## Skill Types

- **Rigid** (TDD, debugging): Follow exactly
- **Flexible** (patterns): Adapt to context