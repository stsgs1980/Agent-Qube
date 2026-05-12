# Agent Rules

> Mandatory rules for AI agents working with @stsgs/ui.
> Based on: agent-toolkit v1.5.0 — adapted for this project.

---

## 0. Onboarding Protocol

When entering this project (new chat, session restart, context loss),
you MUST complete the onboarding protocol before starting any work:

1. Read `AGENT_RULES.md` (this file)
2. Read `docs/PROJECT_CONFIG.md` (project-specific settings)
3. Read `worklog.md` (previous session history)
4. Check git state: `git log --oneline -10` and `git status`
5. Verify project structure per architecture diagram
6. Report current state to user

NEVER start coding before completing Steps 1-3.

See `docs/instructions/onboarding-protocol.md` for full details.

## 1. Language Rule

- Code, file paths, terminal commands, git commit messages — always **English**
- Chat messages, explanations — match **user's language** (Russian/English)
- Before each response verify: "Am I writing in the same language as the user?"

See `docs/instructions/language-rule.md` for full details.

## 2. Git Workflow Rules

### 2.1 Backup Before Rewrite

Before any git operation that rewrites history (rebase, merge, pull, reset --hard):

1. `git stash push -m "pre-op-backup"`
2. `cp -r packages/ /tmp/stsgs-backup/`
3. `git log --oneline -20 > /tmp/git-log-backup.txt`

### 2.2 Force Push Over Rebase

When `git push` is rejected (diverged branches):

- `git push --force-with-lease origin main` — CORRECT
- `git push --force origin main` — AVOID (overrides remote without safety check)
- `git pull --rebase` — FORBIDDEN (blocks sandbox environment on conflict)

### 2.3 Never Pull After Remote URL Change

After `git remote set-url origin <url>`:

- `git push --force-with-lease origin main` — CORRECT
- `git pull` — FORBIDDEN (creates unnecessary conflicts)

### 2.4 No Panic Diagnostics

Before telling the user data is lost, check ALL 5 paths:

1. `ls packages/ui/src/` — do files exist?
2. `ls .git/rebase-merge/` — is rebase paused?
3. `git reflog` — are commits referenced?
4. `ls /tmp/stsgs-backup-*/` — were backups created?
5. `git fsck --lost-found` — dangling objects?

NEVER say "permanently lost" until all 5 checks are exhausted.

### 2.5 Log Everything

After every git operation, log to `worklog.md`: operation, hash before/after, result.

See `docs/instructions/git-workflow-rules.md` for full details.

## 3. Architecture Rules (Project-Specific)

### 3.1 Layer Dependencies

6-layer direction: `tokens/ -> ui/ -> sections/ -> features/ -> hooks/ -> providers/`

NEVER import from upper layer to lower. Enforced by `eslint-plugin-stsgs`.

### 3.2 Anti-Monolith (7 Rules)

1. Component <= 150 lines, File <= 200 lines, Page <= 40 lines
2. Max 3 useState per component
3. Component doesn't fetch data
4. Barrel exports for every module
5. Layer separation enforced
6. Dynamic imports for heavy deps
7. ESLint enforcement active

### 3.3 Component Discovery

Before creating a component: `npx stsgs list [layer]`
DO NOT recreate existing components.

## 4. Code Standards

### 4.1 No-Unicode Policy v2.1

> File: `docs/standards/No-Unicode_Policy_v2.1.md`
> Levels: **[C] Critical** (code, UI) + **[W] Warning** (AI-communication, docs) + **[I] Info** (prototypes, internal)

Prohibits emoji and Unicode graphic characters in:
- Source code and UI text **[C]**
- AI agent chat responses **[W]** — user messages are NOT regulated
- Project documentation **[W]** (subject to MARKDOWN_STANDARD)

Exceptions:
- `(ref)` marking in tables and code blocks for identification purposes
- Typographic characters (em dash, copyright, degree) in plain text only
- Cyrillic characters in Russian-language content

Icons: **SVG only** (Lucide library). No emoji as icons.

### 4.2 MARKDOWN_STANDARD v2.1

> Files: `docs/standards/MARKDOWN_STANDARD_RU_v2.1.md`, `docs/standards/MARKDOWN_STANDARD_EN_v2.1.md`
> Level: **[W] Warning**

Governs formatting of all .md files in the project:
- ASCII + Cyrillic + typographic characters in text
- No Unicode in headings, code, or tables (except `(ref)`)
- 4 backticks for nested code blocks, language tags required
- Dash `-` for unordered lists (not `*` or `+`)
- Stack signature format: `Built with: <project technologies>`

### 4.3 REPRODUCIBILITY-STANDARD

> File: `docs/standards/REPRODUCIBILITY-STANDARD.md`
> Level: **[C] Critical**

Ensures `clone + install + dev = works` on any machine. Key rules:
- `.env.example` required with all variables and safe defaults
- Relative paths only (no `/home/`, `http://localhost:` in code)
- SQLite: `connection_limit=1`, relative path via `path.resolve()`
- Error handling: generic messages to client, no Prisma error leakage
- Anti-fragility: non-critical ops must not break critical ones
- Dark theme required via CSS variables
- No dead packages in dependencies

### 4.4 GITHUB_STANDARD

> File: `docs/standards/GITHUB_STANDARD.md`
> Level: **[C] Critical**

Governs all Git and GitHub operations:
- Conventional Commits format (type + scope + description)
- Branch naming (feat/, fix/, refactor/, docs/, chore/, release/)
- Forbidden operations (pull --rebase, push --force, etc.)
- Backup before rewrite procedure
- Push policy (minimum 1 push per session)
- SemVer 2.0 versioning and tagging
- .gitignore requirements
- PR checklist

### 4.5 Implementation Order

Standards must be applied in a specific order.
See `docs/standards/ПОРЯДОК_внедрения_стандартов.md` for the full 6-step sequence.

## 5. Diagnostic Disclosure

Severity ladder for communicating problems:

| Certainty | Phrase |
|-----------|--------|
| File exists | "File X is present, Y lines" |
| Not found | "File X not found, checking alternatives..." |
| All checks exhausted | "File X not found after exhaustive search. Options: A, B, C" |
| All recovery failed | "File X could not be recovered. You may need to recreate it." |

Never jump to the last row without passing through all previous rows.

See `docs/instructions/diagnostic-disclosure.md` for full details.

## 6. Planning Rule

For tasks that require more than 3 steps, write a plan in `worklog.md` BEFORE writing code.

- Tasks 1-3 steps: just do it, log after
- Tasks 4-10 steps: write a brief plan in worklog, then execute
- Tasks 10+ steps: write a detailed plan, show user for confirmation before starting

See `docs/instructions/writing-plans.md` for full details.

## 7. Push Policy

Push after every significant change — do not accumulate half-finished work locally.

| Situation | Action |
|-----------|--------|
| Feature or fix completed | Push immediately |
| End of work session | Push even if unfinished changes exist |
| CI red | Push is ok, but fix soon |
| Experimental branch | Push immediately (in separate branch), do not merge to main without review |
| Token expired | Update token, update remote URL, push |

**Minimum:** 1 push at the end of every session. Local changes without push = data loss risk in Z.ai sandbox.

**Formula:**

```
work -> commit -> push -> peace of mind
```

## 8. Sandbox Z.ai

Sandbox environment has specific constraints that affect all operations:

- **Shared filesystem**: All chat sessions share the same filesystem. Files created in one chat are visible in all other chats.
- **Chat = Shell process**: Each chat session has its own shell process. When the chat ends, the shell process dies, but files on disk remain.
- **Process mortality**: Background processes (dev servers, watchers) die when the chat session ends or after ~5 minutes of inactivity. Use `disown` to maximize survival time.
- **No cross-chat process sharing**: A process started in one chat cannot be controlled from another chat. But files left behind can be used.
- **Recovery from git lockup**: If a previous chat left git in a blocked state:
  ```bash
  rm -rf .git/rebase-merge .git/rebase-apply
  git reset --hard HEAD
  ```

See `docs/instructions/sandbox-rules.md` for full details.

## 9. Skills to Use

| Skill | When to Use |
|-------|-------------|
| `api-retry` | Making HTTP requests to external APIs, encountering 502/503/504 errors |
| `health-check` | Checking availability of chat.z.ai, monitoring API response times |
| `fallback` | chat.z.ai is unavailable, need alternative providers |
| `git-safe-ops` | Before any git push/pull/rebase/merge with remote |
| `dev-watchdog` | Starting, restarting, or checking dev server |

## 10. Instructions to Follow

| Instruction | File |
|-------------|------|
| Onboarding Protocol | `docs/instructions/onboarding-protocol.md` |
| Git Workflow Rules | `docs/instructions/git-workflow-rules.md` |
| Language Rule | `docs/instructions/language-rule.md` |
| Diagnostic Disclosure | `docs/instructions/diagnostic-disclosure.md` |
| Writing Plans | `docs/instructions/writing-plans.md` |
| Sandbox Rules | `docs/instructions/sandbox-rules.md` |

## 11. Document Classification

### Group B — Governance (standards)

Apply FIRST. Define rules that all other documents must follow.

| File | Version | Level | Purpose |
|------|---------|-------|---------|
| `MARKDOWN_STANDARD_RU_v2.1.md` | v2.1.4 | [W] | Markdown formatting rules (Russian) |
| `MARKDOWN_STANDARD_EN_v2.1.md` | v2.1.4 | [W] | Markdown formatting rules (English) |
| `No-Unicode_Policy_v2.1.md` | v2.1.3 | [C]+[W]+[I] | Unicode/emoji prohibition |
| `README_TEMPLATE.md` | v2.1 | -- | Mandatory README structure + stack default |
| `ПОРЯДОК_внедрения_стандартов.md` | v2.0 | -- | Implementation sequence (6 steps) |
| `REPRODUCIBILITY-STANDARD.md` | v1.0 | [C] | Clone+install+dev = works |
| `WCAG_2.1_AA.md` | v1.0 | [C] | Accessibility compliance (WCAG 2.1 AA) |
| `GITHUB_STANDARD.md` | v1.0 | [C] | Git/GitHub operations, commit format, branching |

### Group A — Operational (templates)

Deploy AFTER Group B. These SUBMIT to Group B standards.

| File | Version | Purpose |
|------|---------|---------|
| `WORKLOG.md` | v2.1.1 | Agent work journal (deployed as `worklog.md`) |
| `TASK_TEMPLATE.md` | v2.1.1 | Sub-agent prompt templates |
| `README_WORKLOG.md` | v2.1.1 | Worklog system guide |

### Group C — Reference (docs)

| File | Purpose |
|------|---------|
| `docs/architecture/architecture.md` | System architecture |
| `docs/planning/phase-plan.md` | Phase plan and TODO |
| `docs/ai-rules/core.md` | Single source of truth for AI rules |
| `docs/PROJECT_CONFIG.md` | Project-specific configuration |

---

Built with: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui + Radix UI
