# git-safe-ops

Safe git operations skill. Provides guards and checks before destructive git commands.

## Trigger

When the agent is about to execute git operations that modify history (force push, rebase, reset, checkout with discard, branch deletion).

## Instructions

1. Before any `git push --force`, confirm the branch is not shared or get explicit user confirmation.
2. Before `git reset --hard`, stash or confirm uncommitted changes can be discarded.
3. Before `git clean`, list what would be deleted and ask for confirmation.
4. Before branch deletion, check if merged or confirm with user.
5. Always run `git status` before and after destructive operations.
6. Never run `git push --force` on `main` without explicit user request.