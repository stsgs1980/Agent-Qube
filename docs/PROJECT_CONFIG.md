# Project Configuration

> Project-specific settings for @stsgs/ui -- Interface Studio

---

## Stack Signature

```
Built with: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui + Radix UI
```

## Product

@stsgs/ui is an **Interface Studio**: context-aware interface builder.
Input: goal + audience + style. Output: layout + theme + components + code.

Three engines:
1. Layout Engine (done) -- `useLayoutAdvice()`, 51 recipes
2. Theme Engine (in progress) -- registry, `recommendTheme()`, dual theme
3. Component Engine (planned) -- per-slot compositions

Full vision: `docs/planning/studio-vision.md`

## Dev Server

| Setting | Value |
|---------|-------|
| Command | `pnpm dev` |
| Framework | Turborepo monorepo |
| Package manager | pnpm 9.15+ |

## Project Paths

| Path | Purpose |
|------|---------|
| `packages/ui/src/` | Component library source |
| `packages/ui/src/tokens/` | Layer 1: Design tokens |
| `packages/ui/src/ui/` | Layer 2: Base components (shadcn) |
| `packages/ui/src/sections/` | Layer 3: Page sections |
| `packages/ui/src/features/` | Layer 4: Interactive widgets |
| `packages/ui/src/hooks/` | Layer 5: Custom hooks |
| `packages/ui/src/providers/` | Layer 6: App wrappers |
| `packages/cli/src/` | CLI tool source |
| `packages/eslint-plugin/src/` | ESLint rules source |
| `src/lib/layout/` | Studio: theme engine, tokens, scoring |
| `src/components/layout/` | Studio: UI components |
| `src/data/` | Studio: layout recipes (51) |
| `scripts/` | Extraction and utility scripts |
| `docs/ai-rules/` | Single source of truth for AI rules |
| `docs/standards/` | Governance standards |
| `docs/instructions/` | Operational instructions |
| `docs/architecture/` | System architecture |
| `docs/planning/` | Phase plan + Studio vision |
| `docs/templates/` | Worklog, task, and README templates |

## Component Library

- Use **shadcn/ui** + **Radix UI** components as base
- TypeScript throughout with strict typing
- `cn()` utility from `@stsgs/ui/tokens` for className merging
- All components support `className` prop

## AI Rules

- Single source: `docs/ai-rules/core.md`
- 6 platform configs auto-generated via `npx stsgs ai sync`
- Platforms: Cursor, Claude, Z.ai, Zcode, Copilot, Windsurf

## Repository

- GitHub: https://github.com/stsgs1980/UI-Kit
- NPM: `@stsgs/ui`
- License: MIT

## Notes

- This file is the single source of truth for project-specific configuration
- `AGENT_RULES.md` references this file for all project-dependent settings
- When switching to a different stack, update only this file
