# Task 3: AI-configs-writer — Rewrite config files for P-MAS-v2

## Task Description
Rewrite 5 AI config files to reflect P-MAS-v2 (Prompt-based Multi-Agent System Dashboard) instead of the stale @stsgs/ui / Interface Studio content.

## Files Rewritten
1. `/home/z/my-project/CLAUDE.md`
2. `/home/z/my-project/.cursorrules`
3. `/home/z/my-project/.windsurfrules`
4. `/home/z/my-project/.zcode/rules.md`
5. `/home/z/my-project/.github/copilot-instructions.md`

## Also Updated
- `/home/z/my-project/worklog.md` — Header changed from @stsgs/ui to P-MAS-v2

## Changes Made

### Removed (all 5 files)
- @stsgs/ui / Interface Studio branding
- 6-layer architecture (tokens -> ui -> sections -> features -> hooks -> providers)
- Dual Theme System, Studio theme, Project theme references
- Layout Engine, Theme Engine, Component Engine references
- npx stsgs, create-stsgs-app CLI commands
- eslint-plugin-stsgs references
- @stsgs/ui import patterns

### Added (all 5 files)
- P-MAS-v2 product identity
- 26 AI agents across 8 role groups (Strategy, Tactics, Control, Execution, Memory, Monitoring, Communication, Learning)
- Architecture: src/app/, src/components/hierarchy/, src/components/workflows/, src/components/ui/, src/hooks/, src/lib/, prisma/
- Design: Dark theme (black #000000 + Cyan #06B6D4 accent + monochrome)
- React Flow + Dagre DAG layout for Agent Hierarchy
- Workflow Pipeline (CRUD, execution, status tracking)
- Anti-monolith rules preserved (static imports only with Turbopack)
- P-MAS-v2 import patterns
- 7 API endpoints (/api/agents, /api/agents/prompt, /api/tasks, /api/hierarchy, /api/stats, /api/health, /api/seed)
- Full stack: Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, shadcn/ui, Prisma SQLite, React Flow, Framer Motion, Zustand

## Verification
- Zero references to @stsgs/ui, Interface Studio, Layout/Theme/Component Engine, npx stsgs, create-stsgs-app, Dual Theme System, Studio/Project theme, eslint-plugin-stsgs across all 5 files
