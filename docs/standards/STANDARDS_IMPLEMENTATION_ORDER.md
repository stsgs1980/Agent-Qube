# Standards Implementation Order and Worklog System

This document describes the order of applying all project documents -- from reading standards to building README. Each step builds on the results of the previous one. Violating the order leads to rework.

---

## Project Documents

### Group B: Standards (Governance)

Define rules. Do not change when starting a new project -- only read and accept.

| Document | Level | Scope |
|----------|-------|-------|
| No-Unicode_Policy_v2.1.md | [C] + [W] + [I] | UI, production code, AI chat, prototypes |
| MARKDOWN_STANDARD_EN_v2.1.md | [W] | README, project documentation |
| README_TEMPLATE.md | - | README.md structure |

### Group A: Operational System (Worklog)

Work tools. Copied into the project and used from day one.

| Document | Purpose |
|----------|---------|
| README_WORKLOG.md | Worklog system guide |
| TASK_TEMPLATE.md | Sub-agent prompt templates |
| WORKLOG.md | Agent work journal (live file) |

### Relationship Between Groups

- Group A submits to Group B (all .md files must conform to MARKDOWN_STANDARD and No-Unicode Policy)
- Group B does not know about Group A (standards do not mention worklog)
- Group A references Group B (README_WORKLOG mentions standards)

---

## Full Sequence (6 Steps)

### Step 1: Accept Standards (Group B)

**What to do:**

- Copy all Group B files into the project folder (e.g., `docs/standards/`)
- Read each standard completely
- Ensure the team understands levels [C], [W], [I]
- Define the stack signature for the project (format: `Built with: <technologies>`, default: see README_TEMPLATE)

**Why first:** Standards are the foundation. Everything that follows must conform to them. Starting work without understanding the rules leads to rework.

**Risk:** Without this step, each project participant will format code and documentation differently.

---

### Step 2: Deploy Worklog System (Group A)

**What to do:**

- Copy README_WORKLOG.md into the project (guide)
- Copy TASK_TEMPLATE.md into the project (prompt templates)
- Create WORKLOG.md from template (empty journal with header)
- Verify all three files conform to MARKDOWN_STANDARD (stack signature, code block languages, list markers)

**Why second:** Worklog starts tracking work from step 3. Without it -- no history, no coordination between agents, no rollback capability.

**Why after standards:** Group A files must conform to Group B standards from the moment they appear in the project. Verification at step 2 ensures the worklog system does not violate MARKDOWN_STANDARD.

**Risk:** Deploying worklog before accepting standards -- files may not conform to rules, requiring rework at step 5.

---

### Step 3: REPRODUCIBILITY-STANDARD (Foundation)

**What to do:**

- Create .env.example with relative paths
- Configure db.ts: connection_limit=1, mkdirSync, relative paths via process.cwd()
- Remove absolute paths (/home/, http://localhost:)
- Check dependencies (no dead packages)
- Configure dark theme via CSS variables
- Log result in WORKLOG.md (Task ID: 3)

**Why third:** Infrastructure must be stable before code and documentation start relying on it.

**Risk:** Writing UI first, then fixing DB paths or environment variables -- requires retesting all code that used those connections.

---

### Step 4: No-Unicode Policy v2.1 [C] (UI Code Protection)

**What to do:**

- Add custom ESLint rule no-unicode-policy/no-unicode (error)
- Replace all emoji in UI components with Lucide SVG icons
- Replace unicode statuses with text tags: [OK], [FAIL], [TODO]
- Run bun run lint to verify
- Log result in WORKLOG.md (Task ID: 4)

**Why fourth:** After setting up infrastructure (step 3), code must be "frozen" from unicode pollution. ESLint rule blocks all new emoji/unicode in code. .ts/.tsx files are already stable (step 3 done), no repeat cleanup needed.

**Risk:** Running No-Unicode before Reproducibility -- .ts/.tsx files will change during DB setup, requiring cleanup again. Running after Markdown Standard -- .md files will still have emoji that No-Unicode does not catch.

---

### Step 5: MARKDOWN_STANDARD v2.1 [W] (Documentation)

**What to do:**

- Remove emoji from all .md files (worklog, README, AGENT_RULES, etc.)
- Replace unicode pseudo-graphics with ASCII
- Verify lists (only `-`, not `*` or `+`)
- Verify code blocks (always with language specified, fallback: `text` or `bash`)
- Add Stack Signature to root files (format: `Built with: <technologies>`)
- Validate Group A files (README_WORKLOG.md, TASK_TEMPLATE.md, WORKLOG.md)
- Log result in WORKLOG.md (Task ID: 5)

**Why fifth:** No-Unicode already cleaned code (step 4), but ESLint rules do not cover .md files. Markdown Standard is the final cleanup for documentation, including worklog system files.

**Risk:** Running Markdown Standard before No-Unicode -- requires re-scanning .md files because both standards prohibit emoji with different scope.

---

### Step 6: README_TEMPLATE (Final Build)

**What to do:**

- Assemble README.md from template (Title, Features, Tech Stack, Getting Started, Configuration, Project Structure, API Reference, Scripts, Development Rules, Agent Rules)
- Add Stack Signature at the bottom (project-specific stack value)
- Formatting conforms to MARKDOWN_STANDARD
- Log result in WORKLOG.md (Task ID: 6)

**Why last:** README.md must conform to MARKDOWN_STANDARD, so the template is applied after formatting rules are established (step 5). Tech stack is defined at step 1, infrastructure is stable (step 3), code is clean (step 4).

**Risk:** Building README first -- when Markdown Standard is applied, lists need reformatting (`*` to `-`), code blocks need language tags, Stack Signature needs adding.

---

## Dependency Diagram

```text
Step 1: Standards (Group B)         Read, accept rules
        |
        v
Step 2: Worklog (Group A)           Deploy, verify conformance with B
        |
        v
Step 3: REPRODUCIBILITY              Set up infrastructure (env, db, paths)
        |                            Log in WORKLOG
        v
Step 4: No-Unicode Policy [C]        ESLint rule + UI code cleanup
        |                            Log in WORKLOG
        v
Step 5: MARKDOWN_STANDARD [W]        Cleanup .md files (including Group A)
        |                            Log in WORKLOG
        v
Step 6: README_TEMPLATE              Build README from template
                                     Log in WORKLOG
```

---

## What Happens When Order Is Violated

| Mistake | Consequence |
|---------|-------------|
| Worklog (step 2) before Standards (step 1) | Group A files do not conform to B -- re-verification and editing at step 5 |
| No-Unicode before Reproducibility | .ts/.tsx files change during DB setup -- repeat cleanup |
| Markdown Standard before No-Unicode | Emoji in .md and code -- double pass through files |
| README Template before Markdown Standard | README format does not conform to standard -- reformatting |
| Any standard without Reproducibility | Absolute paths, dead packages -- hidden bugs |
| Reproducibility after README | Absolute paths in .env and db.ts break deployment -- rewriting config and reformatting README |
| Skipping step 2 (worklog) | No work history, no agent coordination, no rollback |

---

## Key Rules

1. **Layers:** Each step is a layer. The lower layer must be stable before adding the next. Otherwise layers must be redone.

2. **Group A submits to Group B:** All worklog system files are verified against standards. This is done twice: during deployment (step 2) and when applying MARKDOWN_STANDARD (step 5).

3. **Worklog records every step:** Starting from step 3, each step is logged in WORKLOG.md. Steps 1-2 are manual (worklog not yet used), steps 3-6 include logging.

4. **Stack signature defined at step 1:** Format is set by MARKDOWN_STANDARD, specific value by README_TEMPLATE. When project stack changes, only README_TEMPLATE needs updating.

---
Built with: Next.js 16 + TypeScript + Tailwind CSS
