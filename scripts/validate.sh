#!/bin/bash
# Agent Qube / validate.sh
# Pre-push purity gate: checks that no forbidden/temporary files are tracked.
# Adapted from anti-hallucination-guard for the main Agent Qube project.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"

# Forbidden patterns -- should never be in the repository
FORBIDDEN_PATTERNS=(
    ".env"
    ".env.local"
    ".env.production"
    "*.log"
    "*.tmp"
    "node_modules/"
    ".next/"
    "upload/"
    "download/*.docx"
    "download/*.xlsx"
    ".git/modules/"
    "*.db"
    "*.db-journal"
)

# Forbidden root-level files -- leak indicators from sandbox or submodule
FORBIDDEN_ROOT_FILES=(
    "categorize.ts"
    "extract-components.ts"
    "extract-recipes.mjs"
    "generate-ai-rules.ts"
    "repair-imports.ts"
    "seed-db.ts"
)

ERRORS=0
WARNINGS=0

echo "=== Agent Qube: pre-push validation ==="
echo ""

# Check tracked files against forbidden patterns
TRACKED_FILES=$(git -C "$PROJECT_ROOT" ls-files)

for FILE in $TRACKED_FILES; do
    for PATTERN in "${FORBIDDEN_PATTERNS[@]}"; do
        case "$FILE" in
            *"$PATTERN"*)
                echo "[-] FORBIDDEN: $FILE (matches pattern: $PATTERN)"
                ERRORS=$((ERRORS + 1))
                ;;
        esac
    done
done

# Check for forbidden root-level files (submodule leak indicators)
for FILE in "${FORBIDDEN_ROOT_FILES[@]}"; do
    if git -C "$PROJECT_ROOT" ls-files --error-unmatch "$FILE" &>/dev/null; then
        echo "[-] LEAKED FILE: $FILE (should only exist in anti-hallucination-guard submodule)"
        ERRORS=$((ERRORS + 1))
    fi
done

# Check that anti-hallucination-guard submodule is clean (if present)
AHG_DIR="$PROJECT_ROOT/anti-hallucination-guard"
if [ -d "$AHG_DIR" ]; then
    AHG_ALLOWED=(
        "setup.sh"
        "AGENT_RULES.md"
        "README.md"
        ".gitignore"
        ".git-hooks/"
        "scripts/"
        "skills/"
        "tools/"
    )

    if [ -f "$AHG_DIR/.git" ]; then
        # It's a proper submodule -- check its contents
        AHG_TRACKED=$(git -C "$AHG_DIR" ls-files 2>/dev/null || true)
        for FILE in $AHG_TRACKED; do
            ALLOWED_FLAG=0
            for PATTERN in "${AHG_ALLOWED[@]}"; do
                case "$FILE" in
                    "$PATTERN"*) ALLOWED_FLAG=1 ;;
                esac
            done
            if [ "$ALLOWED_FLAG" -eq 0 ]; then
                echo "[!] AHG WARNING: anti-hallucination-guard/$FILE not in submodule whitelist"
                WARNINGS=$((WARNINGS + 1))
            fi
        done
    fi
    echo "[+] anti-hallucination-guard/ -- submodule present"
fi

# Check that critical project files exist
CRITICAL_FILES=(
    "package.json"
    "README.md"
    "src/app/page.tsx"
    "src/app/layout.tsx"
    "prisma/schema.prisma"
)

for FILE in "${CRITICAL_FILES[@]}"; do
    if [ -f "$PROJECT_ROOT/$FILE" ]; then
        echo "[+] $FILE -- OK"
    else
        echo "[-] MISSING: $FILE"
        ERRORS=$((ERRORS + 1))
    fi
done

echo ""
echo "=== Result ==="

if [ "$ERRORS" -eq 0 ]; then
    echo "Repository is clean. Push allowed."
    if [ "$WARNINGS" -gt 0 ]; then
        echo "Warnings: $WARNINGS (review recommended)"
    fi
    exit 0
else
    echo "ERRORS FOUND: $ERRORS -- PUSH BLOCKED"
    echo ""
    echo "Fix:"
    echo "  git rm --cached <file>    -- untrack forbidden file"
    echo "  git commit --amend         -- amend the commit"
    echo ""
    exit 1
fi
