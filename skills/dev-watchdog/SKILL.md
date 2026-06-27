# dev-watchdog

Development watchdog skill. Monitors for common development anti-patterns and policy violations during coding sessions.

## Trigger

When actively developing code, before committing, or during code review.

## Instructions

1. Check that no hardcoded secrets, API keys, or tokens are being committed.
2. Verify that `.gitignore` covers generated files, build artifacts, and environment files.
3. Ensure commit messages follow the project convention (conventional commits or as configured).
4. Watch for large files being added to the repository (over 1MB without LFS).
5. Check that new dependencies are necessary and do not introduce known vulnerabilities.
6. Flag any TODO or FIXME comments that should be tracked as issues.