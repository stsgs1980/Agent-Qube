# @stsgs/ui — Interface Studio

> Context-aware interface builder: layout + theme + components from a single prompt.
>
> Repository: [github.com/stsgs1980/UI-Kit](https://github.com/stsgs1980/UI-Kit)

## What It Does

@stsgs/ui is an **Interface Studio** -- not just a component library. It takes a context (goal, audience, style) and produces a ready-to-use interface: layout + theme + components + code.

```
INPUT:  "SaaS landing for fintech, premium style"
  |
  +-- Layout Engine  --> Holy Grail (score: 94/100)
  +-- Theme Engine   --> Champagne (gold, Playfair, sharp corners)
  +-- Component Engine -> Hero, PricingCards, CTA, Footer
  |
OUTPUT: Live preview + exportable code + tokens
```

## Three Engines

| Engine | Input | Output | Status |
|--------|-------|--------|--------|
| **Layout Engine** | goal, content type, item count | grid-template + regions + score | Done -- `useLayoutAdvice` (51 recipes) |
| **Theme Engine** | context, audience, mood | tokens + effects + typography | In progress -- registry + `recommendTheme()` |
| **Component Engine** | goal, layout slots | component composition | Planned -- after Theme Engine |

## Features

- 51 layout recipes (6 categories) with auto-responsive tablet+mobile
- Layout Advisor: context-aware `useLayoutAdvice()` hook with scoring
- 5 theme presets (3 dark + 2 light) with paired dark/light switching
- Dual theme system: studio theme (stable) + project theme (dynamic)
- Theme recommendation: `recommendTheme()` maps context to preset
- 6-layer architecture with strict dependency direction
- AI rules for 6 platforms (Cursor, Claude, Z.ai, Zcode, Copilot, Windsurf)
- Anti-monolith enforcement via ESLint plugin
- No-Unicode Policy (SVG icons only, no emoji in code or docs)
- WCAG 2.1 AA compliance
- Reproducible: clone + install + dev = works

## Tech Stack

- **Framework** -- Next.js 16, React 19
- **Language** -- TypeScript 5.7+ (strict mode)
- **Styling** -- Tailwind CSS 4, shadcn/ui, Radix UI primitives
- **Build** -- pnpm 9.15+, Turborepo monorepo, tsup

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9.15+

### Installation

```bash
# Clone the repository
git clone https://github.com/stsgs1980/UI-Kit.git
cd UI-Kit

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run development mode
pnpm dev
```

### Quick Start (CLI)

```bash
# Create a new project
npx create-stsgs-app my-project

# Add components to existing project
npx stsgs add Button
npx stsgs add @dashboard-kit

# Scan for violations
npx stsgs scan

# Sync AI rules
npx stsgs ai sync
```

## Architecture: 6-Layer Dependency Direction

```
tokens/ -> ui/ -> sections/ -> features/ -> hooks/ -> providers/
```

Dependencies flow **strictly downward**. If `ui/Button.tsx` imports from `features/`, the architecture is broken.

| Layer | Purpose | Count | Has State? |
|-------|---------|-------|------------|
| `tokens/` | Design tokens, layout registry, cn() | 51 recipes + types | No |
| `ui/` | Base components (shadcn/ui + Layout) | ~50 | No |
| `sections/` | Page section compositions | ~100 | No |
| `features/` | Interactive widgets | ~50 | Yes |
| `hooks/` | useBreakpoint, useLayoutAdvice | ~8 | Yes |
| `providers/` | ThemeProvider, app wrappers | ~4 | Yes |

## Dual Theme System

The Studio has two independent color systems:

| System | Purpose | Changes | Provider |
|--------|---------|---------|----------|
| **Studio theme** | Navigation, controls, chrome | Rarely (user preference) | `StudioThemeProvider` |
| **Project theme** | Preview, generated code, export | Frequently (context-dependent) | `ProjectThemeProvider` |

Example: User builds a fintech landing in Champagne (gold). Studio stays in Zinc (neutral). Two worlds, one screen.

## 5 Theme Presets

| Preset | Mode | Accent | Font Display | Radius | Best For |
|--------|------|--------|-------------|--------|----------|
| Champagne | dark | #C8A97E (gold) | Playfair Display | 2px | Premium, luxury, fintech |
| Cyan Night | dark | #00E5FF (cyan) | Inter | 2px | Tech, dev tools, dashboards |
| Zinc | dark | #10B981 (emerald) | Inter | 12px | Neutral, admin, enterprise |
| Champagne Light | light | #856930 (dark gold) | Playfair Display | 2px | Premium light, editorial |
| Cyan Morning | light | #0E7490 (dark cyan) | Inter | 2px | Tech light, documentation |

## Import Patterns

```typescript
import { Button, Card, Dialog } from '@stsgs/ui'
import { HeroSection, NavbarSection } from '@stsgs/ui/sections'
import { SearchPanel, ThemeToggle } from '@stsgs/ui/features'
import { useTheme, useMediaQuery, useLayoutAdvice } from '@stsgs/ui/hooks'
import { ThemeProvider } from '@stsgs/ui/providers'
import { cn } from '@stsgs/ui/tokens'
```

## Anti-Monolith Rules (7 Rules)

1. **Line Limits** -- Component <= 150, File <= 200, Page <= 40
2. **Max useState** -- 3 per component, then extract to hook
3. **No data fetching** in components, use props only
4. **Barrel exports** for every module
5. **Layer separation** enforced by ESLint
6. **Dynamic imports** for heavy dependencies
7. **Tooling enforcement** via `eslint-plugin-stsgs`

## Collections

Pre-packaged feature sets for common use cases:

| Collection | Install | Components |
|------------|---------|------------|
| Dashboard Kit | `npx stsgs add @dashboard-kit` | ~18 |
| Auth Pages | `npx stsgs add @auth-pages` | ~8 |
| Landing Page | `npx stsgs add @landing-page` | ~14 |
| Chat UI | `npx stsgs add @chat-ui` | ~6 |

## Project Structure

```text
UI-Kit/
  packages/
    ui/                  @stsgs/ui -- Component library
    cli/                 @stsgs/cli -- CLI tool
    browser/             @stsgs/browser -- Component Browser
    eslint-plugin/       eslint-plugin-stsgs -- Enforcement
    create-app/          create-stsgs-app -- Project scaffolding
  src/                   Studio application (Next.js)
    app/                 Pages and globals
    lib/layout/          Theme engine, tokens, scoring
    components/layout/   Studio UI components
    data/                Layout recipes (51)
  docs/
    ai-rules/            Single source of truth for AI rules
      core.md            Main rules document
      library.md         Component quality checklist
      project.md         Project-specific template
      enforcement.md     ESLint rules docs
    standards/           Group B: Governance documents
    instructions/        Detailed behavioral instructions
    architecture/        System architecture
    planning/            Phase plan + Studio vision
    templates/           Group A: Operational templates
  AGENT_RULES.md         Behavioral rules for AI agents
  worklog.md             Agent work journal
```

## Development Rules

### Required Technologies

- Next.js 16 + React 19
- TypeScript 5.7+ strict mode
- Tailwind CSS 4 + shadcn/ui + Radix UI
- pnpm + Turborepo

### Code Style

- No Unicode/emoji in source code, UI text, or documentation [Critical]
- SVG icons only (Lucide library)
- Components <= 150 lines, files <= 200 lines
- Barrel exports for every module
- Dark theme via CSS variables

## Agent Rules (Mandatory)

Any AI agent working on this project MUST read and follow `AGENT_RULES.md` before performing any operations.

See `AGENT_RULES.md` for full details.
See `docs/instructions/` for complete rule descriptions.
See `docs/standards/` for governance documents (No-Unicode Policy, MARKDOWN_STANDARD, REPRODUCIBILITY, WCAG 2.1 AA, GITHUB_STANDARD).
See `docs/planning/studio-vision.md` for the Interface Studio vision and all architectural decisions.

## Development Phases

### Engine Roadmap (Current)

| Phase | Engine | Focus | Status |
|-------|--------|-------|--------|
| 1 | Layout Engine | 51 recipes, scoring, recommendations | Done |
| 2 | Theme Engine | Registry, CSS variables, recommendTheme(), dual theme | In progress |
| 3 | Component Engine | Context-aware compositions, per-slot selection | Planned |
| 4 | Unified Studio | One flow: context -> preview + code | Planned |
| 5 | Distribution | npm package, CLI, Component Browser | Planned |

### Component Library Waves

See `docs/planning/phase-plan.md` for the full Wave Plan (Wave 1-4) and component inventory.

## License

MIT

---

Built with: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui + Radix UI
