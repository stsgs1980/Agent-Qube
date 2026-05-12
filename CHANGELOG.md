# Changelog

All notable changes to @stsgs/ui will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] — 2025-05-11

### Added
- Monorepo structure with pnpm + Turborepo
- `@stsgs/ui` package with 6-layer architecture scaffold
  - Layer 1: `tokens/` — Design tokens, cn() utility, TypeScript types
  - Layer 2: `ui/` — Placeholder for ~50 shadcn/ui components
  - Layer 3: `sections/` — Placeholder for ~100 section components
  - Layer 4: `features/` — Placeholder for ~50 feature components
  - Layer 5: `hooks/` — Placeholder for ~8 custom hooks
  - Layer 6: `providers/` — Placeholder for ~4 providers
- `eslint-plugin-stsgs` with 3 rules:
  - `no-cross-layer-imports` — Enforce dependency direction
  - `max-lines` — Max 200 lines per file
  - `max-use-state` — Max 3 useState per component
- `@stsgs/cli` with 5 commands:
  - `stsgs add <component>` — Add component to project
  - `stsgs list [layer]` — List available components
  - `stsgs scan` — Check project for anti-monolith violations
  - `stsgs ai init` — Generate AI rules from core.md
  - `stsgs ai sync` — Sync AI rules across platforms
- AI rules system:
  - `ai-rules/core.md` — Single source of truth
  - `ai-rules/library.md` — Component quality checklist
  - `ai-rules/project.md` — Project-specific template
  - `ai-rules/enforcement.md` — ESLint documentation
  - 6 platform configs: `.cursorrules`, `CLAUDE.md`, `ZAI.md`, `.zcode/rules.md`, `.github/copilot-instructions.md`, `.windsurfrules`
- Extraction scripts:
  - `scripts/extract-components.ts` — Scan repos for components
  - `scripts/repair-imports.ts` — Fix import paths
  - `scripts/categorize.ts` — Assign layers, tags, collections
  - `scripts/generate-ai-rules.ts` — Generate platform configs
- Documentation:
  - `README.md` — Project overview and quick start
  - `docs/architecture.md` — 6-layer architecture detailed docs
  - `docs/phase-plan.md` — Development phases A→E
- Wireframes (4 PNGs in `/download/wireframes/`):
  - `01-architecture.png` — 6-layer architecture diagram
  - `02-component-browser.png` — Component Browser UI
  - `03-cli-process.png` — CLI process flow
  - `04-new-project-structure.png` — New project structure + comparison
