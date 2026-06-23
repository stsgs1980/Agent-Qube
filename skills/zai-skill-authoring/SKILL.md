---
name: zai-skill-authoring
description: Write and iterate on Z.ai skills. Use when the user says "create a skill", "write a skill", "new skill", "improve this skill", "fix the skill trigger", "skill isn't working", or "debug a skill". Combines Z.ai skill-creator progressive disclosure with Superpowers' test-driven approach and concrete examples.
---

# Z.ai Skill Authoring

## Overview

**Writing skills IS Test-Driven Development applied to process documentation.**

A **skill** is a Markdown reference guide with YAML frontmatter. Skills help the model find and apply effective approaches.

**Skills are:** Reusable techniques, patterns, tools, reference guides
**Skills are NOT:** Narratives about how you solved a problem once

**Core principle:** If you didn't watch the model fail without the skill, you don't know if the skill teaches the right thing.

## Core Principles

1. **One skill, one job** — if a skill does two unrelated things, split it
2. **Progressive disclosure** — YAML description (<100 words) triggers loading; SKILL.md body (<500 lines) provides instructions; references/ holds detail
3. **Imperative tone** — "run the test" not "the test should be run"
4. **Examples over rules** — show what good output looks like rather than listing 20 restrictions
5. **Explain why, not just what** — the model follows instructions better when it understands the reason

## SKILL.md Structure

**Frontmatter (YAML) — two required fields:**

```yaml
---
name: skill-name-with-hyphens
description: Use when [specific triggering conditions and symptoms]
---
```

- `name`: Letters, numbers, and hyphens only (no parentheses, special chars)
- `description`: Third-person, describes ONLY when to use (NOT what it does)
  - Start with "Use when..." to focus on triggering conditions
  - Include specific symptoms, situations, and contexts
  - **NEVER summarize the skill's process or workflow in the description**
  - Keep under 500 characters if possible

**Why description = triggers only:** Testing revealed that when a description summarizes the skill's workflow, the model may follow the description instead of reading the full skill content. A description saying "code review between tasks" caused one review instead of two. When changed to just "Use when executing plans with independent tasks" (no workflow summary), the model correctly followed the full flowchart.

```yaml
# BAD: Summarizes workflow - model may follow this instead of reading skill
description: Use when executing plans - dispatches subagent per task with code review

# BAD: Too much process detail
description: Use for TDD - write test first, watch it fail, write minimal code

# GOOD: Just triggering conditions, no workflow summary
description: Use when executing implementation plans with independent tasks
```

**Body structure:**

```markdown
# Skill Name
One paragraph overview with core principle.

## When to Use
## When NOT to Use  (prevents over-triggering)
## Core Pattern / Process
## Examples (Input/Output pairs)
## Common Mistakes
```

Keep under 200 lines for simple skills. For complex skills, use references/ files: "See references/api-patterns.md for the full schema."

## Skill File Structure

```text
skill-name/
  SKILL.md          # Required. Frontmatter + instructions.
  references/       # Optional. Detailed docs loaded on demand.
  scripts/          # Optional. Deterministic/repetitive tasks.
  assets/           # Optional. Templates, fonts, icons.
```

**Separate files for:**
1. Heavy reference (100+ lines) — API docs, comprehensive syntax
2. Reusable tools — Scripts, utilities, templates

**Keep inline:** Principles, code patterns (<50 lines), everything else

## Description Optimization for Z.ai

The `description` field is the primary trigger mechanism. Include:
- What the skill does
- When it should activate (specific phrases in quotes for substring matching)
- Edge cases where it should or shouldn't fire
- Synonyms and related phrases

Make the description slightly "pushy" — GLM tends to under-trigger skills.

**Bad:** "A skill for making charts"
**Good:** "Create charts, graphs, and data visualizations. Use whenever the user mentions charts, plots, graphs, dashboards, data visualization, 'show me the data', or wants to compare numbers visually — even if they don't explicitly say 'chart'."

**Keyword coverage:** Use words the model would search for:
- Error messages: "Hook timed out", "race condition"
- Symptoms: "flaky", "hanging", "zombie"
- Synonyms: "timeout/hang/freeze", "cleanup/teardown"
- Tools: Actual commands, library names

## Writing a New Skill

### 1. Define the Trigger (YAML Frontmatter)

The `description` field is the primary trigger mechanism. Include:
- What the skill does
- When it should activate (specific phrases in quotes for substring matching)
- Edge cases where it should or shouldn't fire
- Synonyms and related phrases

Make the description slightly "pushy" — GLM tends to under-trigger skills.

### 2. Write the Body (SKILL.md)

Start with a brief overview (2-3 sentences). Then structure instructions:
```
# Skill Name
One paragraph overview.

## When to Use
## When NOT to Use  (prevents over-triggering)
## Core Pattern / Process
## Examples (Input/Output pairs)
## Common Pitfalls
```

Keep under 200 lines for simple skills. For complex skills, use references/ files.

### 3. Test the Skill

Run a test prompt WITHOUT the skill loaded. Document the baseline behavior.
Then run the same prompt WITH skill. Model should now comply.

### 4. Iterate Based on Results

If under-triggers: add more trigger phrases. If over-triggers: add "When NOT to Use" section.

## TDD for Skills: RED-GREEN-REFACTOR

### RED: Write Failing Test (Baseline)

Run a test prompt WITHOUT the skill loaded. Document exact behavior:
- What choices did the model make?
- What rationalizations did it use (verbatim)?
- Which pressures triggered failures?

### GREEN: Write Minimal Skill

Write skill that addresses those specific rationalizations. Don't add extra content for hypothetical cases.

Run same prompt WITH skill. Model should now comply.

### REFACTOR: Close Loopholes

Model found new rationalization? Add explicit counter. Re-test until bulletproof.

**Testing methodology:** See `sp-writing-skills/references/testing-skills-with-subagents.md` for complete testing methodology.

## Bulletproofing Against Rationalization

Skills that enforce discipline need to resist rationalization. The model is smart and will find loopholes under pressure.

### Close Every Loophole Explicitly

Don't just state the rule — forbid specific workarounds:

**Bad:**
```markdown
Write code before test? Delete it.
```

**Good:**
```markdown
Write code before test? Delete it. Start over.

**No exceptions:**
- Don't keep it as "reference"
- Don't "adapt" it while writing tests
- Don't look at it
- Delete means delete
```

### Build Rationalization Table

Capture rationalizations from baseline testing:

```markdown
| Excuse | Reality |
|--------|---------|
| "Too simple to test" | Simple code breaks. Test takes 30 seconds. |
| "I'll test after" | Tests passing immediately prove nothing. |
| "Tests after achieve same goals" | Tests-after = "what does this do?" Tests-first = "what should this do?" |
```

### Create Red Flags List

```markdown
## Red Flags - STOP

- Code before test
- "I already manually tested it"
- "Tests after achieve the same purpose"
- "It's about spirit not ritual"

**All of these mean: Start over.**
```

### Address "Spirit vs Letter" Arguments

Add foundational principle early:
```markdown
**Violating the letter of the rules is violating the spirit of the rules.**
```

## When to Create a Skill

**Create when:**
- Technique wasn't intuitively obvious
- You'd reference this again across projects
- Pattern applies broadly (not project-specific)

**Don't create for:**
- One-off solutions
- Standard practices well-documented elsewhere
- Project-specific conventions

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Skill is 800+ lines | Split into SKILL.md + references/ |
| No "When NOT to Use" | Add one — prevents false triggers |
| Description is too vague | Include specific user phrases in quotes |
| Description summarizes workflow | Remove workflow, keep only trigger conditions |
| All rules, no examples | Add 2-3 Input/Output pairs |
| Skill competes with built-in | Check the built-in skill list first; extend rather than replace |
| No rationalization prevention | Add table + red flags for discipline skills |

## Integration with Superpowers TDD

For code-heavy skills (like debugging or testing), combine with:
- `sp-test-driven-development` — write evals as test cases
- `zai-verify-before-claim` — verify the skill actually works before declaring it done
- `sp-writing-skills` — for detailed skill-writing methodology (if you need deeper guidance)

## Cross-Referencing Other Skills

Use skill name only, with explicit requirement markers:
- **Good:** `**REQUIRED SUB-SKILL:** Use sp-test-driven-development`
- **Good:** `**REQUIRED BACKGROUND:** You MUST understand sp-systematic-debugging`
- **Bad:** `See skills/testing/test-driven-development` (unclear if required)
- **Bad:** `@skills/testing/test-driven-development/SKILL.md` (force-loads, burns context)

## Token Efficiency

Getting-started and frequently-referenced skills load into EVERY conversation. Every token counts.

**Targets:** frequently-loaded skills <200 words total; other skills <500 words.

**Techniques:**
- Move details to separate files
- Use cross-references instead of repeating content
- One excellent example, not many mediocre ones
- Don't explain what's obvious from command