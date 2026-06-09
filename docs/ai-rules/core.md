# @stsgs/ui — AI Rules (Single Source of Truth)

> This file is the single source of truth for AI coding assistant rules.
> Platform-specific configs are auto-generated from this file via `npx stsgs ai sync`.

## Architecture: 6-Layer Dependency Direction

```
tokens/ → ui/ → sections/ → features/ → hooks/ → providers/
```

**Rule: Dependencies flow strictly downward. NEVER import from an upper layer.**

| Layer | Can import from | Cannot import from |
|-------|----------------|-------------------|
| tokens/ | external libs only | everything else |
| ui/ | tokens/ | sections, features, hooks, providers |
| sections/ | ui/, tokens/ | features, hooks, providers |
| features/ | sections/, ui/, hooks/, tokens/ | providers |
| hooks/ | tokens/ | ui, sections, features, providers |
| providers/ | hooks/, ui/, tokens/ | features, sections |

If `ui/Button.tsx` imports from `features/`, the architecture is **broken**.

## Anti-Monolith Rules (7 Rules)

### Rule 1: Line Limits
- Component file: ≤ 150 lines
- Any file: ≤ 200 lines
- Page file (page.tsx): ≤ 40 lines
- If a file exceeds limits, split it immediately

### Rule 2: Max useState
- Maximum 3 `useState` calls per component
- If more state needed, extract into a custom hook in `hooks/`

### Rule 3: Component Doesn't Fetch Data
- Components receive data via props only
- Data fetching happens in hooks or page-level
- Never call `fetch()`, `axios`, `useQuery` inside a UI/Section component

### Rule 4: Barrel Exports
- Every module has an `index.ts` barrel export
- Import from barrel, not from individual files
- [OK] `import { Button } from '@stsgs/ui'`
- [X] `import { Button } from '@stsgs/ui/ui/button'`

### Rule 5: Layer Separation Enforced
- Each layer is a separate export path: `@stsgs/ui/tokens`, `@stsgs/ui/ui`, etc.
- No cross-layer imports (enforced by `eslint-plugin-stsgs`)
- Test files can import from any layer

### Rule 6: Dynamic Imports for Heavy Dependencies
- Use `next/dynamic` for components with heavy deps (charts, editors, canvases)
- Never bundle heavy libraries in the initial page load

### Rule 7: Enforce with Tooling
- ESLint: `eslint-plugin-stsgs` enforces rules 1-5 programmatically
- Pre-commit hooks run lint before allowing commits
- CI pipeline blocks PRs with violations

## Component Discovery

Before creating a new component, **always check if it exists** in @stsgs/ui:

```bash
npx stsgs list [layer]          # List components in a layer
npx stsgs add <component>       # Add component to project
npx stsgs scan                   # Check project health
```

**DO NOT recreate existing components.** Check the library first.

## Import Patterns

```typescript
// UI components (Layer 2)
import { Button, Card, Dialog } from '@stsgs/ui'

// Sections (Layer 3)
import { HeroSection, NavbarSection } from '@stsgs/ui/sections'

// Features (Layer 4)
import { SearchPanel, ThemeToggle } from '@stsgs/ui/features'

// Hooks (Layer 5)
import { useTheme, useMediaQuery } from '@stsgs/ui/hooks'

// Providers (Layer 6)
import { ThemeProvider } from '@stsgs/ui/providers'

// Tokens (Layer 1)
import { cn } from '@stsgs/ui/tokens'
```

## File Naming Conventions

- Components: `PascalCase.tsx` (e.g., `Button.tsx`, `HeroSection.tsx`)
- Hooks: `camelCase.ts` (e.g., `useTheme.ts`, `useMediaQuery.ts`)
- Barrel exports: `index.ts`
- Types: Co-located in component file, or `types.ts` for shared types
- Tests: `Component.test.tsx` co-located with component

## Project Structure

```
@stsgs/ui/
├── src/
│   ├── tokens/          # Layer 1: Design tokens, cn()
│   ├── ui/              # Layer 2: shadcn/ui base (50 components)
│   ├── sections/        # Layer 3: Page sections (~100)
│   ├── features/        # Layer 4: Interactive widgets (~50)
│   ├── hooks/           # Layer 5: Custom hooks (~8)
│   └── providers/       # Layer 6: App wrappers (~4)
├── package.json
└── tsup.config.ts
```

## Tech Stack

- Next.js 16, React 19, Tailwind CSS 4
- shadcn/ui + Radix UI primitives
- TypeScript 5.7+, strict mode
- pnpm + Turborepo monorepo
