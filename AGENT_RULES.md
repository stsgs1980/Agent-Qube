# Agent Rules

> Project version: **v1.9.0** (merged from agent-toolkit v1.8.3 + UI-Kit v1.5.0)
>
> Mandatory rules for AI agents working with this project.
> Read before starting work.

---

## 0. Onboarding Protocol

When entering this project (new chat, session restart, context loss),
you MUST complete the onboarding protocol before starting any work:

1. Read `AGENT_RULES.md` (this file)
2. Read `docs/PROJECT_CONFIG.md` (project-specific settings)
3. Read `worklog.md` (previous session history)
4. Check git state: `git log --oneline -10` and `git status`
5. Verify project state per `docs/PROJECT_CONFIG.md` (dev server, paths)
6. Scan project structure
7. Report current state to user

See `docs/instructions/onboarding-protocol.md` for full details.
NEVER start coding or modifying files before completing Steps 1-3.

## 1. Language Rule

Always respond in the user's language. If the user writes in Russian, respond in Russian. If in English, respond in English. Never switch languages without explicit request.

- Code, file paths, terminal commands, git commit messages -- always English
- Chat messages, explanations, worklog -- match user's language
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

- `git push --force-with-lease origin main` -- CORRECT
- `git push --force origin main` -- AVOID (overrides remote without safety check)
- `git pull --rebase` -- FORBIDDEN (blocks sandbox environment on conflict)

### 2.3 Never Pull After Remote URL Change

After `git remote set-url origin <url>`:

- `git push --force-with-lease origin main` -- CORRECT
- `git push --force origin main` -- AVOID (no safety check)
- `git pull` -- FORBIDDEN (creates unnecessary conflicts)

### 2.4 No Panic Diagnostics

Before telling the user data is lost, check ALL 5 paths:

1. `ls packages/ui/src/` -- do files exist?
2. `ls .git/rebase-merge/` -- is rebase paused?
3. `git reflog` -- are commits referenced?
4. `ls /tmp/stsgs-backup-*/` -- were backups created?
5. `git fsck --lost-found` -- dangling objects?

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
3. Component does not fetch data
4. Barrel exports for every module
5. Layer separation enforced
6. Dynamic imports for heavy deps
7. ESLint enforcement active

### 3.3 Component Discovery

Before creating a component: `npx stsgs list [layer]`
DO NOT recreate existing components.

## 4. Code Standards

This project enforces the following standards. All files referenced below
are in the `docs/standards/` directory.

### 4.1 Unicode Policy v2.1

> File: `docs/standards/UNICODE_POLICY.md` (also `docs/standards/No-Unicode_Policy_v2.1.md`)
> Levels: **[C] Critical** (code, UI) + **[W] Warning** (AI-communication, docs) + **[I] Info** (prototypes, internal)

Prohibits emoji and Unicode graphic characters in:
- Source code and UI text **[C]**
- AI agent chat responses **[W]** -- user messages are NOT regulated
- Project documentation **[W]** (subject to MARKDOWN_STANDARD)

Exceptions:
- `(ref)` marking in tables and code blocks for identification purposes
- Typographic characters (em dash, copyright, degree) in plain text only
- Cyrillic characters in Russian-language content

Icons: **SVG only** (Lucide library). No emoji as icons.

### 4.2 MARKDOWN_STANDARD v2.1

> Files: `docs/standards/MARKDOWN_STANDARD_EN_v2.1.md`, `docs/standards/MARKDOWN_STANDARD_RU_v2.1.md`
> Level: **[W] Warning**

Governs formatting of all .md files in the project:
- ASCII + Cyrillic + typographic characters in text
- No Unicode in headings, code, or tables (except `(ref)`)
- 4 backticks for nested code blocks, language tags required
- Dash `-` for unordered lists (not `*` or `+`)
- Stack signature format: `Built with: <project technologies>`
  (default value defined in `docs/standards/README_TEMPLATE.md`)

### 4.3 Reproducibility Standard

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
- Auto-backup before every write mutation
- Deduplication-first on all create endpoints
- Safe delete with explicit confirmation for all entities

See the full document for 11 rules across 4 levels (Environment, Code, Delivery, Process).

### 4.4 Implementation Order

Standards must be applied in a specific order.
See `docs/standards/IMPLEMENTATION_ORDER.md` for the full 6-step sequence.

### 4.5 Frontend Development Standard

> File: `docs/standards/FRONTEND_STANDARD.md`
> Level: **[C] Critical**

Governs all React/Next.js frontend development:
- Component size limits: 150 lines max
- File size limits: 200 lines max
- State management: max 3 useState per component
- Architecture: Feature-Sliced Design (FSD)
- Data isolation: no direct API calls in UI components

### 4.6 GitHub Standard

> File: `docs/standards/GITHUB_STANDARD.md` (STD-GIT-001 v1.2)
> Level: **[C] Critical**

Governs all git operations:
- Conventional Commits format required
- Branch naming: `<type>/<description>`
- Force push: only `--force-with-lease`
- Backup before any history rewrite
- Push after every significant change
- Checkpoint system (WIP commits every 15-20 min)
- Deadlock prevention for sandbox environment

### 4.7 WCAG Accessibility

> File: `docs/standards/WCAG_2.1_AA_STANDARD.md`
> Level: **[C] Critical**

Ensures UI accessibility:
- Text contrast: 4.5:1 minimum
- Non-text contrast: 3:1 minimum
- Keyboard navigation for all interactive elements
- Focus visible indicators
- Touch targets: 44x44px minimum
- ARIA roles and states

### 4.8 Code Examples Guide

> File: `docs/standards/CODE_EXAMPLES_GUIDE.md`
> Level: **[W] Warning**

Governs code examples in documentation:
- Self-contained and executable
- Copy-paste ready (no line numbers, prompts)
- Proper syntax highlighting
- Security warnings for dangerous operations

### 4.9 Error Handling Standard

> File: `docs/standards/ERROR_HANDLING_STANDARD.md`
> Level: **[C] Critical**

Governs error handling throughout the application:
- Error class hierarchy with typed errors
- Retry with exponential backoff
- Circuit breaker pattern
- React error boundaries
- Structured logging

### 4.10 Security Standard

> File: `docs/standards/SECURITY_STANDARD.md`
> Level: **[C] Critical**

Governs security practices:
- OWASP Top 10 compliance
- Secrets management (no hardcoded credentials)
- Input validation and sanitization
- Security headers
- Rate limiting

### 4.11 Testing Standard

> File: `docs/standards/TESTING_STANDARD.md`
> Level: **[C] Critical**

Governs testing practices:
- Testing pyramid: 70% unit, 20% integration, 10% E2E
- AAA pattern (Arrange-Act-Assert)
- Playwright for E2E testing
- Quality gates for CI/CD

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

Push after every significant change -- do not accumulate half-finished work locally.

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

## 8. Skills to Use

| Skill | When to Use |
|-------|-------------|
| `git-checkpoint` | Every 15-20 min during active work, before risky operations |
| `git-safe-ops` | Before any git push/pull/rebase/merge with remote |
| `sanitize-validate` | User input, form data, API requests, file uploads, security |
| `api-retry` | Making HTTP requests to external APIs, encountering 502/503/504 errors |
| `health-check` | Checking availability of chat.z.ai, monitoring API response times |
| `fallback` | chat.z.ai is unavailable, need alternative providers |
| `dev-watchdog` | Starting, restarting, or checking dev server |

## 9. Instructions to Follow

| Instruction | File |
|-------------|------|
| Onboarding Protocol | `docs/instructions/onboarding-protocol.md` |
| Git Workflow Rules | `docs/instructions/git-workflow-rules.md` |
| Language Rule | `docs/instructions/language-rule.md` |
| Diagnostic Disclosure | `docs/instructions/diagnostic-disclosure.md` |
| Writing Plans | `docs/instructions/writing-plans.md` |
| Sandbox Rules | `docs/instructions/sandbox-rules.md` |

## 10. Document Classification

This project organizes files into three groups:

### Group B -- Governance (standards)

Apply FIRST. Define rules that all other documents must follow.

| ID | File | Level | Purpose |
|----|------|-------|---------|
| STD-DOC-002 | `MARKDOWN_STANDARD_EN_v2.1.md` | [W] | Markdown formatting rules (English) |
| STD-DOC-002 | `MARKDOWN_STANDARD_RU_v2.1.md` | [W] | Markdown formatting rules (Russian) |
| STD-DOC-003 | `UNICODE_POLICY.md` | [C]+[W]+[I] | Unicode/emoji prohibition |
| STD-DOC-004 | `README_TEMPLATE.md` | [W] | Mandatory README structure |
| STD-DOC-005 | `CODE_EXAMPLES_GUIDE.md` | [W] | Code examples formatting |
| STD-ENV-001 | `REPRODUCIBILITY-STANDARD.md` | [C] | Clone+install+dev = works |
| STD-ARCH-001 | `IMPLEMENTATION_ORDER.md` | [W] | Implementation sequence (6 steps) |
| STD-META-001 | `STANDARD_ID_SYSTEM.md` | [W] | Standard ID registry and rules |
| STD-FE-001 | `FRONTEND_STANDARD.md` | [C] | Frontend development (React/Next.js) |
| STD-GIT-001 | `GITHUB_STANDARD.md` | [C] | Git/GitHub operations standard |
| STD-A11Y-001 | `WCAG_2.1_AA_STANDARD.md` | [C] | Accessibility compliance (WCAG 2.1 AA) |
| STD-TEST-001 | `TESTING_STANDARD.md` | [C] | Unit, integration, E2E testing standards |
| STD-ERR-001 | `ERROR_HANDLING_STANDARD.md` | [C] | Error classification, logging, recovery |
| STD-SEC-001 | `SECURITY_STANDARD.md` | [C] | Authentication, secrets, OWASP compliance |

All standards are located in `docs/standards/`.

### Group A -- Operational (templates)

Deploy AFTER Group B. These SUBMIT to Group B standards.

| File | Version | Purpose |
|------|---------|---------|
| `docs/templates/WORKLOG.md` | v2.1.1 | Agent work journal (deployed as `worklog.md`) |
| `docs/templates/TASK_TEMPLATE.md` | v2.1.1 | Sub-agent prompt templates |
| `docs/templates/README_WORKLOG.md` | v2.1.1 | Worklog system guide |
| `docs/templates/workflows/` | -- | Bug fix, feature, refactor workflows |
| `docs/templates/e2e/` | -- | E2E testing setup (Playwright) |

### Group C -- Reference (docs)

| File | Purpose |
|------|---------|
| `docs/architecture/architecture.md` | System architecture |
| `docs/planning/phase-plan.md` | Phase plan and TODO |
| `docs/planning/studio-vision.md` | Product vision |
| `docs/ai-rules/core.md` | Single source of truth for AI rules |
| `docs/ai-rules/enforcement.md` | AI rules enforcement guide |
| `docs/ai-rules/library.md` | Library-specific AI rules |
| `docs/ai-rules/project.md` | Project-specific AI rules |
| `docs/PROJECT_CONFIG.md` | Project-specific configuration |

### Infrastructure (non-standard)

| File | Purpose |
|------|---------|
| `AGENT_RULES.md` | This file -- agent behavioral rules |
| `docs/instructions/*.md` | Detailed behavioral instructions |

## 11. Sandbox Z.ai

Sandbox environment has specific constraints that affect all operations:

- **Shared filesystem**: All chat sessions share the same filesystem. Files created
  in one chat are visible in all other chats.
- **Chat = Shell process**: Each chat session has its own shell process. When the
  chat ends, the shell process dies, but files on disk remain.
- **Process mortality**: Background processes (dev servers, watchers) die when the
  chat session ends or after ~5 minutes of inactivity. Use `disown` to maximize
  survival time.
- **No cross-chat process sharing**: A process started in one chat cannot be
  controlled from another chat. But files left behind can be used.
- **Recovery from git lockup**: If a previous chat left git in a blocked state
  (e.g., `needs merge`, `rebase in progress`), the ONLY safe recovery is:
  ```bash
  rm -rf .git/rebase-merge .git/rebase-apply
  git reset --hard HEAD
  ```
  This must be done from a NEW chat session (the old one is blocked).

See `docs/instructions/sandbox-rules.md` for full details.

## 12. Project in Sandbox

The project MUST reside in `/home/z/my-project/`:

- This is the sandbox's designated working directory
- Do NOT create project clones in other directories (e.g., `/home/z/pmas/`)
- If a project exists elsewhere, move it to `/home/z/my-project/`
- All relative paths in configs must resolve from this directory
- Dev server logs go to `/tmp/zdev.log`

## 13. Dev Server Startup

Starting the dev server requires specific handling in sandbox:

```bash
# Kill any existing process
pkill -f 'next dev' 2>/dev/null
sleep 1

# Start with disown to survive parent shell death
cd /home/z/my-project && npx next dev -p 3000 </dev/null >/tmp/zdev.log 2>&1 & disown

# Wait for compilation
sleep 6

# Verify (always use 127.0.0.1, not localhost)
curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/
```

Key rules:
- Always use `disown` after backgrounding the server process
- Always use `npx next dev`, NOT `bun run dev` (bun wrapper is unstable)
- Always redirect output: `>/tmp/zdev.log 2>&1`
- Always close stdin: `</dev/null`
- Always use `127.0.0.1` for health checks (not `localhost` -- IPv6 issues)
- Server lives ~5 min; watchdog should check every 5 min

---

Built with: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui + Radix UI
