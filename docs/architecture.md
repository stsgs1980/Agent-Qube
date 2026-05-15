# Architecture — @stsgs/ui

## Overview

@stsgs/ui is a Foundation Component Library built on a **6-layer architecture** with strict one-directional dependency flow. This ensures components remain composable, testable, and free from circular dependencies.

## Layer Diagram

```
┌─────────────────────────────────────────────────────────┐
│  providers/  (Layer 6) — App-level wrappers             │
│  ThemeProvider, ErrorBoundary, ToastProvider             │
│  Imports: hooks/, ui/, tokens/                           │
├─────────────────────────────────────────────────────────┤
│  hooks/  (Layer 5) — Stateful logic without JSX         │
│  useTheme, useMediaQuery, useLocalStorage                │
│  Imports: tokens/                                        │
├─────────────────────────────────────────────────────────┤
│  features/  (Layer 4) — Interactive widgets              │
│  SearchPanel, ThemeToggle, CommandPalette                │
│  Imports: sections/, ui/, hooks/, tokens/                │
├─────────────────────────────────────────────────────────┤
│  sections/  (Layer 3) — Page section compositions        │
│  HeroSection, NavbarSection, PricingSection              │
│  Imports: ui/, tokens/                                   │
├─────────────────────────────────────────────────────────┤
│  ui/  (Layer 2) — Base components (shadcn/ui)           │
│  Button, Card, Dialog, Input, Sheet                      │
│  Imports: tokens/                                        │
├─────────────────────────────────────────────────────────┤
│  tokens/  (Layer 1) — Design tokens, cn()               │
│  colors, spacing, typography, shadows                    │
│  Imports: external libs only                             │
└─────────────────────────────────────────────────────────┘
```

## Dependency Rules

### Allowed Imports (Downward Only)

| Layer | Can Import From | Cannot Import From |
|-------|----------------|-------------------|
| tokens/ | external libs | ui, sections, features, hooks, providers |
| ui/ | tokens/ | sections, features, hooks, providers |
| sections/ | ui/, tokens/ | features, hooks, providers |
| features/ | sections/, ui/, hooks/, tokens/ | providers |
| hooks/ | tokens/ | ui, sections, features, providers |
| providers/ | hooks/, ui/, tokens/ | features, sections |

### Violation Examples

```typescript
// [X] BROKEN: ui/ importing from features/
// File: ui/Button.tsx
import { SearchPanel } from '@stsgs/ui/features'  // ERROR!

// [X] BROKEN: sections/ importing from hooks/
// File: sections/HeroSection.tsx
import { useTheme } from '@stsgs/ui/hooks'  // ERROR!

// [OK] CORRECT: features/ importing from ui/
// File: features/SearchPanel.tsx
import { Button, Input } from '@stsgs/ui'  // OK
```

## Layer Details

### Layer 1: tokens/
**Purpose**: Design tokens and utility functions
**No React, no JSX, no state**
- `cn()` — className merging utility (clsx + tailwind-merge)
- `tokens` — Default design tokens (colors, spacing, typography, shadows, radii)
- `DesignTokens` — TypeScript interface

### Layer 2: ui/
**Purpose**: Pure presentation components (shadcn/ui based)
**No state, no hooks, no data-fetching — Props in, JSX out**
- Based on Radix UI primitives
- Supports `className` prop via `cn()`
- Uses `forwardRef` where DOM access is needed
- ~50 components: Button, Badge, Card, Dialog, Input, Sheet, etc.

### Layer 3: sections/
**Purpose**: Compositions of ui/ components into reusable page sections
**No own state — everything through props**
- Sections are page-level building blocks
- Composed of multiple ui/ components
- ~100 components: HeroSection, FeaturesSection, NavbarSection, etc.

### Layer 4: features/
**Purpose**: Complex interactive widgets with internal state
**Has state and hooks, but self-contained**
- Can use useState (max 3), useEffect, custom hooks
- Does NOT fetch data directly (data comes via props)
- ~50 components: SearchPanel, ThemeToggle, CommandPalette, etc.
- **Collections** = feature sets: Dashboard Kit, Auth Pages, etc.

### Layer 5: hooks/
**Purpose**: Stateful logic without JSX
**Pure TypeScript, no React components**
- Encapsulate state, data, and side effects
- Used by features/ and providers/
- ~8 hooks: useTheme, useMediaQuery, useLocalStorage, etc.

### Layer 6: providers/
**Purpose**: Application-level wrappers
**React context providers and boundaries**
- Wrap the entire component tree
- Import from hooks/ and ui/
- ~4 providers: ThemeProvider, ErrorBoundary, ToastProvider, QueryProvider

## Enforcement

The dependency rules are enforced programmatically via `eslint-plugin-stsgs`:

```javascript
// .eslintrc.js
import stsgs from 'eslint-plugin-stsgs'

export default [
  {
    plugins: { stsgs },
    rules: {
      'stsgs/no-cross-layer-imports': 'error',
      'stsgs/max-lines': ['warn', { max: 200 }],
      'stsgs/max-use-state': ['warn', { max: 3 }],
    },
  },
]
```

## Anti-Monolith Rules

1. **Line Limits**: Component ≤ 150 lines, File ≤ 200 lines, Page ≤ 40 lines
2. **Max useState**: 3 per component — extract to hook if more needed
3. **No data fetching** in components — data flows in via props
4. **Barrel exports** for every module — import from `index.ts`
5. **Layer separation** — no upward imports, enforced by ESLint
6. **Dynamic imports** for heavy dependencies (charts, editors, canvases)
7. **Tooling enforcement** — ESLint, pre-commit hooks, CI pipeline
