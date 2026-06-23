/**
 * @stsgs/prompting -- Instructions Registry
 * Behavioral rules and protocols for AI agents.
 *
 * Two categories:
 *   instructions/  -- 6 behavioral rules (language, git, sandbox, onboarding, planning, diagnostics)
 *   ai-rules/      -- 4 architectural rules (core, enforcement, library, project) [inline, no filesystem dependency]
 *
 * Use getInstruction() or getAIRule() to retrieve content as string
 * for injection into LLM system prompts.
 */

// ─── Types ────────────────────────────────────────────────────

export type InstructionCategory = 'instructions' | 'ai-rules'

export interface InstructionMeta {
  id: string
  title: string
  category: InstructionCategory
  description: string
  version: string
  keywords: string[]
}

export interface InstructionEntry extends InstructionMeta {
  content: string
  lineCount: number
}

// ─── Instructions (Behavioral) ───────────────────────────────

const INSTRUCTIONS: InstructionEntry[] = [
  {
    id: 'diagnostic-disclosure',
    title: 'Diagnostic Disclosure Rule',
    category: 'instructions',
    description: 'Never assert data loss without exhaustive verification. 5-step checklist + severity ladder for communicating problems.',
    version: '1.0.0',
    keywords: ['data-loss', 'verification', 'diagnostic', 'git-recovery', 'sandbox'],
    lineCount: 107,
    content: `# Diagnostic Disclosure Rule

## Instruction for AI Agent Behavior

---

## Rule: Never Assert Data Loss Without Exhaustive Verification

When something goes wrong (git conflict, session reset, file deletion, build failure),
the agent must verify the actual state before informing the user.

---

## Verification Checklist

Before telling the user that data is lost, corrupted, or unrecoverable,
check ALL of the following in order:

### Step 1: Direct File Check
\`\`\`bash
ls <expected-file-path>
wc -l <expected-file-path>
\`\`\`
Does the file exist? Is it non-empty?

### Step 2: Git State Check
\`\`\`bash
git status
git log --oneline -10
\`\`\`
Are the expected commits in history? Is the working tree clean?

### Step 3: Git Recovery Paths
\`\`\`bash
git reflog                          # All HEAD movements
git fsck --lost-found               # Dangling commits/blobs
ls .git/rebase-merge/               # Paused rebase (commits preserved)
ls .git/rebase-apply/               # Paused apply
\`\`\`
Are there lost commits that can be recovered?

### Step 4: Backup Locations
\`\`\`bash
ls /tmp/src-backup-*/               # Manual backups from git-safe-ops
ls /tmp/git-log-backup-*.txt        # Git log snapshots
\`\`\`
Were backups created before the operation?

### Step 5: Session State
\`\`\`bash
# Is this the same session or a new one?
# Same session = files likely preserved
# New session = sandbox may have reset
\`\`\`

---

## Communication Rules

### DO:
- Say "I cannot determine the current state" if checks are blocked
- Say "Let me verify before concluding" when uncertain
- Present findings as facts: "File X exists, Y lines. Commit Z is in history."
- Give the user hope: "There are 3 recovery paths remaining"
- Ask the user to help if you're truly stuck: "Can you check if..."

### DO NOT:
- Say "code is permanently lost" without completing all 5 verification steps
- Say "there is nothing we can do" without trying every recovery method
- Assume session reset = data loss (sandbox often preserves files)
- Skip verification steps because you're "sure" about the outcome
- Use definitive language about loss when you have incomplete information

### Severity Ladder

| Certainty | Phrase |
|-----------|--------|
| File definitely exists | "File X is present, Y lines" |
| File not found at expected path | "File X not found at expected path, checking alternatives..." |
| All checks exhausted, file not found | "File X was not found after exhaustive search. Recovery options: A, B, C" |
| All recovery options failed | "File X could not be recovered. The last known state was [description]. You may need to recreate it." |

Never jump to the last row without passing through all previous rows.`,
  },
  {
    id: 'git-workflow-rules',
    title: 'Git Workflow Rules',
    category: 'instructions',
    description: '7 rules for git operations in sandboxed environments: backup before rewrite, force push over rebase, no pull after remote URL change, no panic diagnostics, log everything, 5 checks before declaring data loss, diff before commit.',
    version: '1.0.0',
    keywords: ['git', 'sandbox', 'rebase', 'force-push', 'backup', 'data-loss'],
    lineCount: 111,
    content: `# Git Workflow Rules

## Instruction for AI Agent Behavior

These rules govern how the agent handles git operations in sandboxed environments.

## Rule 1: Backup Before Rewrite
Before any git operation that rewrites history (rebase, merge, pull, reset --hard):
1. \`git stash push -m "pre-op-backup"\`
2. Copy critical source files to \`/tmp/\`
3. Save git log: \`git log --oneline -20 > /tmp/git-log-backup.txt\`

## Rule 2: Force Push Over Rebase
When push is rejected (diverged branches):
- DO use \`git push --force-with-lease origin main\`
- DO NOT use \`git push --force\` (last resort only)
- DO NOT use \`git pull --rebase\` or \`git pull\`

## Rule 3: Never Pull After Remote URL Change
After \`git remote set-url origin <new-url>\`:
- DO immediately \`git push --force-with-lease origin main\`
- DO NOT run \`git pull\` or \`git fetch + merge\`

## Rule 4: No Panic Diagnostics
If something goes wrong with git:
1. Check: do source files still exist?
2. Check: \`.git/rebase-merge/\` directory
3. Check: \`git reflog\`
4. Check: \`/tmp/\` backups
5. Check: \`git fsck --lost-found\`
DO NOT tell the user "code is permanently lost" until ALL 5 checks are done.

## Rule 5: Log Everything
After every git operation, log to worklog.md: operation, hash before/after, result.

## Rule 6: Five Checks Before Declaring Data Loss
1. \`git log --oneline -20\` -- commits in local history?
2. \`git log --oneline origin/main -10\` -- commits on remote?
3. \`git status\` -- uncommitted changes or stashed data?
4. \`git stash list\` -- saved stashes?
5. \`ls src/app/\` -- source files on disk?
NEVER say "data is permanently lost" until all 5 return negative.

## Rule 7: Diff Before Commit
Before every \`git commit\`, run \`git diff --staged\` to verify ONLY requested changes.`,
  },
  {
    id: 'language-rule',
    title: 'Language Rule',
    category: 'instructions',
    description: 'Always match the user language. Detect from input, respond in same language, never switch without request. Applies to chat/log but NOT code/paths/commits.',
    version: '1.0.0',
    keywords: ['language', 'i18n', 'localization', 'russian', 'english'],
    lineCount: 46,
    content: `# Language Rule

## Instruction for AI Agent Behavior

## Rule: Always Match the User's Language

1. **Detect** the language of the user's message
2. **Respond** in the same language
3. **Never switch** languages without explicit user request

### Detection
- Cyrillic characters -> respond in Russian
- Latin characters -> respond in English
- Mix -> respond in the language of the majority
- Ambiguous -> ask the user

### What This Applies To
- All chat messages to the user
- Explanations of code, errors, and decisions
- Worklog entries (use the project's working language)

### What This Does NOT Apply To
- Code itself (variable names, function names) - always English
- File paths - always ASCII
- Terminal commands - always English
- Git commit messages - always English (universal convention)`,
  },
  {
    id: 'onboarding-protocol',
    title: 'Onboarding Protocol',
    category: 'instructions',
    description: '6-step onboarding: read AGENT_RULES.md, read PROJECT_CONFIG.md, read worklog, check git state, verify dev server, scan structure. Forbidden actions during onboarding. Partial onboarding allowed.',
    version: '1.0.0',
    keywords: ['onboarding', 'startup', 'session', 'worklog', 'git-state', 'dev-server'],
    lineCount: 164,
    content: `# Onboarding Protocol

## Instruction for AI Agent Behavior

## Rule: Always Onboard Before Acting

When entering an existing project (new chat, session restart, context loss),
the agent MUST complete ALL onboarding steps before starting any work.

## Onboarding Steps (execute in order)

### Step 1: Read Agent Rules
Read AGENT_RULES.md in project root. Contains mandatory behavioral rules.

### Step 1.5: Read Project Configuration
Read PROJECT_CONFIG.md in project root. Stack, dev server, paths.

### Step 2: Read Worklog
Read worklog.md. History of previous sessions, decisions, problems.

### Step 3: Check Git State
\`\`\`bash
git log --oneline -10
git status
git branch -a
\`\`\`

### Step 4: Verify Dev Server
\`\`\`bash
curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000
\`\`\`
200 = running, 000 = down (restart needed), 500 = error

### Step 5: Scan Project Structure
\`\`\`bash
ls -la instructions/
ls -la skills/
ls src/app/
\`\`\`

### Step 6: Report to User
After Steps 1-5, report: project name, branch, last commit, server status, worklog sessions, instructions, skills, uncommitted changes.

## Forbidden Actions During Onboarding
- Start coding immediately
- Delete or modify files
- Run git push/pull
- Install new packages
- Assume project state

## Partial Onboarding
If user says "skip onboarding" -- still run Steps 1 and 3 (non-skippable).`,
  },
  {
    id: 'sandbox-rules',
    title: 'Sandbox Rules',
    category: 'instructions',
    description: 'Z.ai sandbox constraints: shared filesystem across sessions, shell process lifecycle, git lockup recovery from new chat, startup checklist, quick reference table.',
    version: '1.0.0',
    keywords: ['sandbox', 'z-ai', 'filesystem', 'shell', 'git-lock', 'recovery'],
    lineCount: 117,
    content: `# Sandbox Rules

## Instruction for AI Agent Behavior

## 1. Shared Filesystem
All chat sessions share the same filesystem. /home/z/my-project/ is the designated working directory. Files created in one chat are visible in all other chats. There is NO isolation on disk.

## 2. Shell Process Lifecycle
Each chat session has its own shell process. When session ends, shell dies + all child processes (dev servers, watchers). Files on disk survive shell death.

## 3. Recovery from Git Lockup
If previous chat left git blocked (needs merge, rebase in progress):
\`\`\`bash
rm -rf .git/rebase-merge .git/rebase-apply
rm -f .git/MERGE_HEAD .git/MERGE_MSG .git/index.lock
git reset --hard HEAD
\`\`\`
Only from a NEW chat session. Do NOT attempt git rebase --continue when blocked.

## 4. Startup Checklist
Step 1: git status + git log
Step 2: curl 127.0.0.1:3000 (200=alive, 000=dead)
Step 3: Verify src/app/page.tsx exists
Step 4: Report state to user

## Quick Reference
| Symptom | Fix |
|---------|-----|
| Git commands blocked | Recovery from new chat |
| Dev server 000 | npx next dev with disown |
| Files missing | Check /tmp/ backups |
| localhost fails | Use 127.0.0.1 instead |`,
  },
  {
    id: 'writing-plans',
    title: 'Writing Plans',
    category: 'instructions',
    description: 'Plan before coding for 4+ step tasks. Plan format with task ID in worklog. Plan review for 10+ steps. Scale plan to task complexity.',
    version: '1.0.0',
    keywords: ['planning', 'worklog', 'task-management', 'plan-review', 'checklist'],
    lineCount: 116,
    content: `# Writing Plans

## Instruction for AI Agent Behavior

## Rule: Plan Before You Code

For any task that requires more than 3 steps, write a plan BEFORE writing code.
The plan must be written into worklog.md as a structured checklist.

## When to Plan
| Task Size | Action |
|-----------|--------|
| 1-3 steps | Just do it, log after |
| 4-10 steps | Write brief plan in worklog |
| 10+ steps | Write detailed plan, show user before starting |

## Plan Format
\`\`\`
---
Task ID: <id>
Agent: <agent name>
Task: <description>

Plan:
1. [step description]
2. [step description]

Work Log:
- [actual work done]

Stage Summary:
- [results]
\`\`\`

## Plan Checklist
- What files will be created or modified?
- What is the order of operations?
- Are there dependencies between steps?
- What could go wrong?
- Is there a rollback strategy?

## Plan Review
For 10+ step tasks: present plan to user, wait for confirmation before executing.`,
  },
]

// ─── AI Rules (Architectural) ────────────────────────────────

const AI_RULES: InstructionEntry[] = [
  {
    id: 'ai-rules-core',
    title: 'Agent Qube AI Rules (Core)',
    category: 'ai-rules',
    description: 'Agent Qube core rules: 26 agents, 8 role groups, 6 connection types, 5 hierarchy layers, anti-monolith rules, import patterns, tech stack.',
    version: '2.0.0',
    keywords: ['architecture', 'agents', 'hierarchy', 'anti-monolith', 'agent-qube', 'import-patterns'],
    lineCount: 140,
    content: `# Agent Qube -- AI Rules (Core)

## Product: Agent Qube (Prompt-based Multi-Agent System)
Multi-Agent System Dashboard with 26 AI agents across 8 role groups.
Three views: Dashboard, Agent Hierarchy (React Flow + Dagre), Workflow Pipeline.

## 26 Agents / 8 Role Groups
- Strategy: Architect, Analyst, Visionary
- Tactics: Coordinator, Planner, Communicator
- Control: Inspector, Evaluator, Guard
- Execution: Executor-A, Executor-B, Debugger, Tester
- Memory: Archivist, Observer, Diagnostician
- Monitoring: Gateway, Protocolist, Dispatcher
- Communication: Trainer, Scorer, Coder
- Learning: Context-Manager, RAG-Specialist, Alert-Operator, Adapter

## 6 Connection Types
command, sync, twin, delegate, supervise, broadcast

## 5 Hierarchy Layers (DAG)
L0: Strategy | L1: Tactics | L2: Control | L3: Execution | L4: Memory/Monitoring/Communication/Learning

## Anti-Monolith Rules (7 Rules)
1. Line Limits: component <= 150 lines, any file <= 200, page.tsx <= 40
2. Max useState: 3 per component, extract to custom hook if more
3. Component Doesn't Fetch Data: data via hooks or props only
4. Barrel Exports: import from barrel, not individual files
5. Layer Separation: components/, hooks/, lib/ separation
6. Static Imports: use ES module imports (NOT next/dynamic with Turbopack)
7. Enforce with Tooling: ESLint + anti-monolith rules

## Import Patterns
\`\`\`typescript
import { AgentNode } from '@/components/hierarchy/agent-node'
import { WorkflowCard } from '@/components/workflows/workflow-card'
import { db } from '@/lib/db'
import { fetchWithRetry } from '@/lib/client-fetch'
\`\`\`

## Tech Stack
Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, shadcn/ui, Prisma SQLite, React Flow, Framer Motion, Zustand`,
  },
  {
    id: 'ai-rules-enforcement',
    title: 'Code Enforcement Rules',
    category: 'ai-rules',
    description: 'Anti-monolith enforcement: max-lines (200), max-use-state (3), no-inline-styles. ESLint configuration for Agent Qube.',
    version: '2.0.0',
    keywords: ['eslint', 'enforcement', 'linting', 'anti-monolith', 'max-lines'],
    lineCount: 37,
    content: `# Code Enforcement Rules

## Anti-Monolith Rules

### max-lines
Severity: warning. Max 200 lines per file (configurable). Exclude: *.test.tsx, *.stories.tsx

### max-use-state
Severity: warning. Max 3 useState per component. Suggests custom hooks.

### no-inline-styles
Prefer Tailwind CSS classes over inline styles where possible.

## Configuration
\`\`\`javascript
export default [{
  rules: {
    'max-lines': ['warn', { max: 200 }],
    'max-use-state': ['warn', { max: 3 }],
  },
}]
\`\`\``,
  },
  {
    id: 'ai-rules-library',
    title: 'Agent Qube Component Rules',
    category: 'ai-rules',
    description: 'Component quality checklist (10 items), adding new components workflow (7 steps), Agent Qube component categories.',
    version: '2.0.0',
    keywords: ['components', 'quality', 'checklist', 'agent-qube', 'library'],
    lineCount: 40,
    content: `# Agent Qube Component Rules

## Component Quality Checklist
- TypeScript interface for all props (no any)
- JSDoc comment describing the component
- Uses cn() for className merging
- Correct directory: hierarchy/, workflows/, or ui/
- Has barrel export in index.ts
- File <= 200 lines (components <= 150)
- No inline styles (Tailwind CSS preferred)
- Supports className prop for customization
- Uses forwardRef where DOM access needed
- Accessible: proper ARIA, keyboard navigation

## Adding New Components
1. Identify correct directory (hierarchy/, workflows/, ui/)
2. Create file with TypeScript props interface + JSDoc
3. Add barrel export in index.ts
4. Run bun run lint to verify
5. Test in dev server

## Component Categories
| Category | Directory | Has State? |
|----------|-----------|------------|
| Agent Hierarchy | components/hierarchy/ | Yes |
| Workflow Pipeline | components/workflows/ | Yes |
| UI Primitives | components/ui/ | No |
| Custom Hooks | hooks/ | Yes |
| Utilities | lib/ | No |`,
  },
  {
    id: 'ai-rules-project',
    title: 'Project-Specific AI Rules Template',
    category: 'ai-rules',
    description: 'Template for project-specific AI rules: stack definition (Next.js 16, Agent Qube, Tailwind CSS 4, TypeScript), custom rules, structure, API endpoints, environment variables.',
    version: '2.0.0',
    keywords: ['project-template', 'stack', 'configuration', 'api-endpoints', 'env-vars'],
    lineCount: 24,
    content: `# Project-Specific AI Rules Template

## Stack
- Framework: Next.js 16 (App Router)
- UI Library: shadcn/ui + Tailwind CSS 4
- Database: Prisma + SQLite
- Visualization: React Flow + Dagre
- Language: TypeScript (strict)

## Sections
- Custom Rules: project-specific behavioral rules
- Project Structure: directory layout
- API Endpoints: /api/agents, /api/tasks, /api/hierarchy, /api/stats, /api/health
- Environment Variables: required env vars (names only, never values)`,
  },
]

// ─── Public API ──────────────────────────────────────────────

/** All instructions (behavioral + architectural). */
const ALL: InstructionEntry[] = [...INSTRUCTIONS, ...AI_RULES]

/** Get all instruction entries (metadata + content). */
export function getAllInstructions(): InstructionEntry[] {
  return ALL
}

/** Get instruction metadata only (no content, lighter payload). */
export function getInstructionMeta(): InstructionMeta[] {
  return ALL.map(({ content: _c, lineCount: _l, ...meta }) => meta)
}

/** Get a single instruction by ID. */
export function getInstruction(id: string): InstructionEntry | undefined {
  return ALL.find(i => i.id === id)
}

/** Get instruction content as string (for LLM system prompt injection). */
export function getInstructionContent(id: string): string | undefined {
  return ALL.find(i => i.id === id)?.content
}

/** Get instructions by category. */
export function getInstructionsByCategory(category: InstructionCategory): InstructionEntry[] {
  return ALL.filter(i => i.category === category)
}

/** Search instructions by keyword. */
export function searchInstructions(query: string): InstructionEntry[] {
  const q = query.toLowerCase()
  return ALL.filter(i =>
    i.title.toLowerCase().includes(q) ||
    i.description.toLowerCase().includes(q) ||
    i.keywords.some(k => k.toLowerCase().includes(q))
  )
}

/** Get instruction IDs list. */
export function getInstructionIds(): string[] {
  return ALL.map(i => i.id)
}

/** Get all instruction content concatenated (for full context injection). */
export function getAllInstructionContent(): string {
  return ALL.map(i => `--- ${i.title} ---\n${i.content}`).join('\n\n')
}

export { INSTRUCTIONS, AI_RULES }
