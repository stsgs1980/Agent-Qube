---
name: zai-debugging
description: Systematic debugging for Z.ai sandbox. Use this skill whenever code fails at runtime, "tests are failing", "tests fail unexpectedly", a build step errors out, or the user says "fix this bug", "debug", "why is this broken", "it doesn't work", or similar. Applies to Type 3 (code) and Type 4 (data processing) tasks. Do NOT use for document generation issues (Type 1/2) — those have their own skill chains.
---

# Z.ai Systematic Debugging

## Overview

Random fixes waste time and create new bugs. Quick patches mask underlying issues.

**Core principle:** ALWAYS find root cause before attempting fixes. Symptom fixes are failure.

**Violating the letter of this process is violating the spirit of debugging.**

## The Iron Law

```text
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

If you haven't completed Phase 1, you cannot propose fixes.

## When to Use

Use for ANY technical issue in code:
- Test failures, build failures, runtime errors
- Bugs, unexpected behavior, performance problems
- Integration issues, dependency problems

**Use this ESPECIALLY when:**
- Under time pressure (emergencies make guessing tempting)
- "Just one quick fix" seems obvious
- You've already tried multiple fixes
- Previous fix didn't work

## The Four Phases

You MUST complete each phase before proceeding to the next.

### Phase 1: Root Cause Investigation

**BEFORE attempting ANY fix:**

1. **Read Error Messages Carefully**
   - Don't skip past errors or warnings
   - Read stack traces completely — note line numbers, file paths, error codes
   - They often contain the exact solution

2. **Reproduce Consistently**
   - Run the failing command or test again to get a fresh error message
   - Copy the exact error text — file path, line number, error type
   - Check if the error is a symptom or the cause:
     - `TypeError: X is not a function` — usually a cause (wrong import, missing export)
     - `Unexpected token` — usually a cause (syntax error)
     - `Test timed out` — usually a symptom (investigate what it was waiting for)

   If the error message is unclear, add one diagnostic print/log, re-run, and read the new output. Don't add five prints at once.

3. **Check Recent Changes**
   - What changed that could cause this? Git diff, recent commits
   - New dependencies, config changes, environmental differences

4. **Trace Data Flow**

   **WHEN error is deep in call stack:**
   - Where does bad value originate?
   - What called this with bad value?
   - Keep tracing up until you find the source
   - Fix at source, not at symptom

   See `sp-systematic-debugging/references/root-cause-tracing.md` for the complete backward tracing technique.

### Phase 2: Pattern Analysis

**Find the pattern before fixing:**

1. **Find Working Examples** — locate similar working code in same codebase
2. **Compare Against References** — read reference implementation COMPLETELY before applying
3. **Identify Differences** — list every difference between working and broken; don't assume "that can't matter"
4. **Understand Dependencies** — what other components, settings, config, environment does this need?

**Bad:** Reading all 20 files in the project looking for "the problem"
**Good:** `pytest tests/test_auth.py::test_login_invalid_password -v` — run the narrowest failing test

### Phase 3: Hypothesis and Testing

**Scientific method:**

1. **Form Single Hypothesis** — "I think X is the root cause because Y". Write it as a one-line comment above your fix. Be specific.
2. **Test Minimally** — make the SMALLEST possible change to test hypothesis. One variable at a time.
3. **Verify Before Continuing** — Did it work? Yes → Phase 4. Didn't work? Form NEW hypothesis. DON'T add more fixes on top.

**Bad:** Adding `try/catch` around everything to suppress the error
**Good:** "Hypothesis: `fetchUser()` returns `null` when the user doesn't exist, but the caller assumes it always returns an object. Fix: add a null check."

### Phase 4: Fix and Verify

1. **Create Failing Test Case** — simplest possible reproduction. Use `sp-test-driven-development` for proper failing tests.
2. **Implement Single Fix** — address the root cause. ONE change at a time. No "while I'm here" improvements.
3. **Verify Fix** — test passes? No other tests broken? Issue actually resolved?
4. **If Fix Doesn't Work** — STOP. If < 3 fixes tried: return to Phase 1. If >= 3: question the architecture.

After a successful fix, commit with a message that includes the root cause:

**Bad:** `git commit -m "fixed bug"`
**Good:** `git commit -m "fix(auth): handle null user in session lookup"`

## If 3+ Fixes Failed: Question Architecture

**Pattern indicating architectural problem:**
- Each fix reveals new shared state/coupling/problem in different place
- Fixes require "massive refactoring" to implement
- Each fix creates new symptoms elsewhere

**STOP and question fundamentals.** This is NOT a failed hypothesis — this is a wrong architecture.

## Common Z.ai Pitfalls

| Situation | What to check |
|-----------|--------------|
| Module not found | Check `package.json` dependencies, run `npm install` |
| Permission denied | Use `/tmp/` for temporary files, check file modes |
| Port already in use | `lsof -i :3000` then kill or use a different port |
| Git operation fails | Check if inside a worktree, run `git status` |
| Timeout in sandbox | Z.ai has a 10-minute bash timeout; long tasks need backgrounding |
| Font/image missing | Check absolute paths; Z.ai fonts are under `/usr/share/fonts/` |

## Red Flags - STOP and Follow Process

If you catch yourself thinking:
- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "Add multiple changes, run tests"
- "It's probably X, let me fix that"
- "I don't fully understand but this might work"
- **"One more fix attempt" (when already tried 2+)**

**ALL of these mean: STOP. Return to Phase 1.**

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Issue is simple, don't need process" | Simple issues have root causes too. Process is fast for simple bugs. |
| "Emergency, no time for process" | Systematic debugging is FASTER than guess-and-check thrashing. |
| "Just try this first, then investigate" | First fix sets the pattern. Do it right from the start. |
| "I'll write test after confirming fix works" | Untested fixes don't stick. Test first proves it. |
| "Multiple fixes at once saves time" | Can't isolate what worked. Causes new bugs. |
| "I see the problem, let me fix it" | Seeing symptoms != understanding root cause. |

## Quick Reference

| Phase | Key Activities | Success Criteria |
|-------|---------------|------------------|
| **1. Root Cause** | Read errors, reproduce, check changes, gather evidence | Understand WHAT and WHY |
| **2. Pattern** | Find working examples, compare | Identify differences |
| **3. Hypothesis** | Form theory, test minimally | Confirmed or new hypothesis |
| **4. Implementation** | Create test, fix, verify | Bug resolved, tests pass |

## Supporting Techniques

Available in `sp-systematic-debugging/references/`:
- **`root-cause-tracing.md`** — Trace bugs backward through call stack
- **`defense-in-depth.md`** — Add validation at multiple layers
- **`condition-based-waiting.md`** — Replace arbitrary timeouts with condition polling

**Related skills:**
- `sp-test-driven-development` — For creating failing test case (Phase 4)
- `zai-verify-before-claim` — Verify fix worked before claiming success

## When NOT to Use This Skill

- User asks to add a new feature (not a bug) — use `zai-code-planning` instead
- User asks to write tests for existing code — use `sp-test-driven-development`
- The error is in a generated document (PDF/DOCX/PPTX) — check the relevant document skill