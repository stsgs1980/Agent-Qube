/**
 * @stsgs/prompting -- Behavioral Instructions (Part 2)
 * Last 3 behavioral rules: onboarding-protocol, sandbox-rules, writing-plans.
 */

import type { InstructionEntry } from './instructions-types'

export const INSTRUCTIONS_EXTRA: InstructionEntry[] = [
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
