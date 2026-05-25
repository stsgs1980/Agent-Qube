/**
 * @stsgs/prompting -- Behavioral Instructions (Part 1)
 * First 3 behavioral rules: diagnostic-disclosure, git-workflow-rules, language-rule.
 */

import type { InstructionEntry } from './instructions-types'

export const INSTRUCTIONS: InstructionEntry[] = [
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
]
