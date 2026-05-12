# Architecture — @stsgs/ui Interface Studio

## Overview

@stsgs/ui is an **Interface Studio** -- a context-aware interface builder that takes a goal and produces a ready-to-use interface: layout + theme + components + code.

The Studio is built on **three engines** sitting on top of a **6-layer component architecture**.

## Studio Architecture

```
+--------------------------------------------------------------+
|                     Interface Studio                          |
|                                                              |
|   INPUT: "SaaS landing for fintech, premium"                |
|                                                              |
|   +---------------+  +---------------+  +-----------------+ |
|   | Layout Engine |  | Theme Engine  |  | Component Engine| |
|   | useLayoutAdv  |  | recommendThem |  | recommendComps  | |
|   | 51 recipes    |  | 5+ presets    |  | per-slot select | |
|   | scoring       |  | CSS vars      |  | compositions    | |
|   +-------+-------+  +-------+-------+  +--------+--------+ |
|           |                  |                   |           |
|   OUTPUT: Layout + Theme + Components = Interface            |
+--------------------------------------------------------------+
          |              |              |
          v              v              v
+--------------------------------------------------------------+
|              6-Layer Component Architecture                   |
|                                                              |
|  providers/  (Layer 6) -- StudioThemeProvider                |
|                          ProjectThemeProvider                 |
|                          ErrorBoundary, ToastProvider         |
|  hooks/  (Layer 5)     -- useLayoutAdvice, useStudioTheme    |
|                          useProjectTheme, useMediaQuery       |
|  features/  (Layer 4)  -- SearchPanel, ThemeToggle           |
|                          CommandPalette                       |
|  sections/  (Layer 3)  -- HeroSection, PricingSection        |
|                          NavbarSection                        |
|  ui/  (Layer 2)        -- Button, Card, Dialog, Layout       |
|  tokens/  (Layer 1)    -- colors, spacing, typography        |
+--------------------------------------------------------------+
```

## Three Engines

### Layout Engine (Done)
- **Hook**: `useLayoutAdvice({ goal, contentType, itemCount })`
- **Recipes**: 51 layout patterns across 6 categories
- **Scoring**: Multi-goal scoring with conflict mitigation
- **Output**: Recommended layout with grid-template + regions + score

### Theme Engine (In Progress)
- **Hook**: `useProjectTheme()` / `useStudioTheme()`
- **Function**: `recommendTheme({ goal, mood, audience })`
- **Registry**: Open Map<string, PresetDefinition> (not closed union)
- **CSS**: `[data-theme]` selectors with `--stsgs-*` custom properties
- **Dual**: Studio theme (stable) + Project theme (dynamic)
- **Output**: Complete token set (colors, fonts, radius, shadows)

### Component Engine (Planned)
- **Function**: `recommendComponents({ goal, layout, slots })`
- **Mapping**: Goal -> component composition per layout slot
- **Variants**: Light/dark, minimal/rich per component
- **Output**: Component tree with proper imports

## Dual Theme System

The Studio has two independent color systems that never interfere:

```
StudioThemeProvider (outer)
  |-- mode: 'dark' (stable)
  |-- preset: 'zinc' (default, rarely changes)
  |-- tokens: --studio-* (bgDeep, accentPrimary, textMuted...)
  |-- CSS: [data-studio-theme="zinc"]
  |
  +-- ProjectThemeProvider (inner)
      |-- mode: 'dark' | 'light' (changes per project)
      |-- preset: recommended by context
      |-- tokens: --project-* (same keys, different values)
      |-- CSS: [data-project-theme="champagne"]
```

### Why Two Themes?

- Studio controls (navigation, sidebar, buttons) must stay **neutral and stable**
- Project preview must show **the actual colors** the user is building
- Switching project from Champagne to Cyan Night should NOT turn the navigation gold or cyan

### CSS Variable Mapping

```css
@theme inline {
  /* shadcn/ui components read these: */
  --color-background: var(--studio-bg-deep);
  --color-foreground: var(--studio-text-primary);
  --color-primary: var(--studio-accent-primary);

  /* Project preview reads these: */
  --color-project-bg: var(--project-bg-deep);
  --color-project-fg: var(--project-text-primary);
}
```

## Theme Registry Architecture

```
lib/layout/
  theme-types.ts          -- PresetDefinition, ThemeTokens, ThemeMode
  theme-registry.ts       -- register(), getAll(), getByMode(), getPair()
  presets/
    champagne.ts          -- 1 file = 1 preset (~60 lines)
    cyan-night.ts
    zinc.ts
    champagne-light.ts
    cyan-morning.ts

app/
  globals.css             -- @import + @theme inline (mapping) + @layer base
  themes/
    champagne.css         -- [data-theme="champagne"] { --stsgs-*: ... }
    cyan-night.css        -- [data-theme="cyan-night"] { --stsgs-*: ... }
    zinc.css              -- [data-theme="zinc"] { --stsgs-*: ... }
    champagne-light.css
    cyan-morning.css
```

### Key: Open, Not Closed

```typescript
// WRONG: Closed union -- adding a theme requires editing 3+ files
type ThemePreset = 'zinc' | 'champagne' | 'cyan-night' | 'champagne-light' | 'cyan-morning'

// RIGHT: Open string -- adding a theme = 1 new file + registerPreset()
type ThemePreset = string

// Pair is inside the definition, not in separate dictionaries
const champagne: PresetDefinition = {
  id: 'champagne',
  mode: 'dark',
  pair: 'champagne-light',  // <-- here, not in DARK_TO_LIGHT map
  tokens: { ... }
}
registerPreset(champagne)
```

## 6-Layer Dependency Direction

```
tokens/ -> ui/ -> sections/ -> features/ -> hooks/ -> providers/
```

**Rule: Dependencies flow strictly downward. NEVER import from an upper layer.**

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
import { SearchPanel } from '@stsgs/ui/features'  // ERROR!

// [X] BROKEN: sections/ importing from hooks/
import { useTheme } from '@stsgs/ui/hooks'  // ERROR!

// [OK] CORRECT: features/ importing from ui/
import { Button } from '@stsgs/ui'  // OK
```

## Layer Details

### Layer 1: tokens/
**No React, no JSX, no state**
- `cn()` -- className merging (clsx + tailwind-merge)
- `tokens` -- Design tokens (colors, spacing, typography, shadows, radii)
- `darkTokens` / `lightTokens` -- Semantic tokens per mode

### Layer 2: ui/
**No state, no hooks -- Props in, JSX out**
- Based on Radix UI primitives
- Supports `className` prop via `cn()`
- ~50 components: Button, Badge, Card, Dialog, Input, Sheet, etc.

### Layer 3: sections/
**No own state -- everything through props**
- Page-level building blocks
- ~100 components: HeroSection, FeaturesSection, NavbarSection, etc.

### Layer 4: features/
**Has state and hooks, but self-contained**
- Can use useState (max 3), useEffect, custom hooks
- Does NOT fetch data directly (data comes via props)
- ~50 components: SearchPanel, ThemeToggle, CommandPalette, etc.

### Layer 5: hooks/
**Pure TypeScript, no React components**
- ~8 hooks: useLayoutAdvice, useStudioTheme, useProjectTheme, useMediaQuery, etc.

### Layer 6: providers/
**React context providers and boundaries**
- ~4 providers: StudioThemeProvider, ProjectThemeProvider, ErrorBoundary, ToastProvider

## Anti-Monolith Rules

1. **Line Limits**: Component <= 150 lines, File <= 200 lines, Page <= 40 lines
2. **Max useState**: 3 per component -- extract to hook if more needed
3. **No data fetching** in components -- data flows in via props
4. **Barrel exports** for every module -- import from `index.ts`
5. **Layer separation** -- no upward imports, enforced by ESLint
6. **Dynamic imports** for heavy dependencies (charts, editors, canvases)
7. **Tooling enforcement** -- ESLint, pre-commit hooks, CI pipeline

## See Also

- `docs/planning/studio-vision.md` -- Full vision, decisions, discussion history
- `docs/planning/phase-plan.md` -- Component extraction waves and inventory
