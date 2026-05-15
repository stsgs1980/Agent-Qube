# @stsgs/ui — Interface Studio: Vision & Decisions

> Created: 2025-07-14
> Purpose: Single source of truth for project direction, decisions, and discussion history.

---

## 1. What We Are Building

**@stsgs/ui is an Interface Studio** -- not a component library, not a theme switcher, not a template marketplace.

The Studio takes a **context** (goal, audience, style) and produces a **ready-to-use interface**: layout + theme + components + code.

```
INPUT:  "SaaS landing for fintech, premium style"
  |
  v
LAYOUT ENGINE  -->  Holy Grail (score: 94/100)
THEME ENGINE   -->  Champagne (gold, Playfair Display, sharp corners)
COMPONENT ENGINE -> Hero, PricingCards, CTA, Footer
  |
  v
OUTPUT: Live preview + exportable code + tokens
```

### Three Engines

| Engine | Input | Output | Status |
|--------|-------|--------|--------|
| **Layout Engine** | goal, content type, item count | grid-template + regions + score | DONE -- `useLayoutAdvice` (51 recipes, scoring) |
| **Theme Engine** | context, audience, mood | tokens + effects + typography | DONE -- registry, dual theme, 5 presets |
| **Component Engine** | goal, layout slots | component composition for each slot | NEXT -- context-aware compositions |

---

## 2. Reference Products Studied

### 21st.dev -- Component Marketplace + AI Agent Registry
- URL: https://21st.dev
- What it does: Browse and copy React/Tailwind components + AI agent configs (YAML/JSON)
- Key features: Search by name/category, agent SDK, cloud-managed agents
- What we take: **Component catalog pattern** (card with preview/code)
- What we don't: Copy-paste distribution (we use npm), no context recommendations, no themes

### UI UX Pro Max -- Design Intelligence Database
- URL: https://ui-ux-pro-max-skill.nextlevelbuilder.io
- What it does: Searchable database of 57 styles, 95 palettes, 56 font pairings, 24 chart types, 14 landing patterns
- Key features: AI recommendations by context (prompt -> style + palette + fonts + code)
- What we take: **Context-to-design mapping** (goal -> theme recommendation), structured design database
- What we don't: Text-only output (no live preview), no layout system, no interactive studio

### Google Stitch -- AI UI Generator
- URL: https://stitch.withgoogle.com
- What it does: AI-powered UI design tool (Gemini 2.5 Pro) -- prompt/sketch/image -> high-fidelity mockup + code
- Key features: AI canvas, voice commands, mobile + web, export to code
- What we take: **Prompt-to-UI flow** (input context -> get result), AI-assisted iteration
- What we don't: No component library, no layout scoring, no token system

### Loading UI -- Loading State Showcase
- URL: https://loadingui.space.z.ai
- What it does: Showcase of 9 loading/skeleton components with Preview/Code tabs
- What we take: **Card with Preview/Code tabs** pattern for Component Browser
- What we don't: Single-category showcase, copy-paste only

### What NOBODY has (our unique value)

1. **Layout scoring** -- "which layout is best for your goal?" with numerical score
2. **Theme as function of context** -- not a selector, but a recommendation engine
3. **Component compositions** -- not primitives, not templates, but context-aware compositions with variants
4. **npm package** -- not copy-paste, but `npm install @stsgs/ui`
5. **Dual theme system** -- studio theme (stable) + project theme (dynamic)

---

## 3. Dual Theme System -- Critical Decision

### The Problem

Our studio app has TWO independent color systems:

1. **Studio theme** -- the colors of the tool itself (navigation, sidebar, controls)
2. **Project theme** -- the colors of the interface being created (preview, export)

These MUST be independent. When the user builds a fintech landing in Champagne, the studio controls should NOT turn gold.

### The Solution

```
StudioThemeProvider (outer)
  |-- mode: 'dark' (stable)
  |-- preset: 'zinc' (default, rarely changes)
  |-- tokens: studio-* (bgDeep, accentPrimary, textMuted...)
  |
  +-- ProjectThemeProvider (inner)
      |-- mode: 'dark' | 'light' (changes per project)
      |-- preset: 'champagne' | 'cyan-night' | ... (recommended by context)
      |-- tokens: project-* (same keys, different values)
```

### Concrete Example

```
Studio (Zinc)                          Project (Champagne)
bg: #0A0A0F                            bg: #0B0B0F
accent: #10B981 (emerald)              accent: #C8A97E (gold)
text: #fafafa                          text: #EDEDEF
radius: 12px                           radius: 2px
font: Inter                            font: Playfair Display
```

The studio is a neutral frame. The project is the colorful canvas inside.

### Technical Implementation

- `useStudioTheme()` -- studio tokens (navigation, chrome, controls)
- `useProjectTheme()` -- project tokens (preview, export, generated code)
- CSS variables: `--studio-*` and `--project-*` prefixes
- Each ProjectThemeProvider sets `data-project-theme` on its wrapper div

---

## 4. Theme Engine Architecture

### Current Problems

1. **Three parallel sources of truth**: globals.css `:root`/`.dark` + tokens.ts darkTokens/lightTokens + presets.ts
2. **Closed type**: `ThemePreset = 'zinc' | 'champagne' | ...` -- adding a theme requires editing 3+ files
3. **Manual pair mappings**: `DARK_TO_LIGHT` and `LIGHT_TO_DARK` separate dictionaries
4. **Monolith presets file**: All 5 presets in one file (332 lines), grows linearly
5. **shadcn disconnect**: shadcn components read `--background`, our components read `--stsgs-bg-deep`

### Target Architecture

```
lib/layout/
  theme-types.ts          -- ThemeTokens, ThemeMode, PresetDefinition interfaces
  theme-registry.ts       -- register(), getAll(), getByMode(), getPair()
  presets/
    champagne.ts          -- 1 file = 1 preset (~60 lines)
    cyan-night.ts
    zinc.ts
    champagne-light.ts
    cyan-morning.ts

app/
  globals.css             -- @import + @theme inline (mapping) + @layer base (WCAG)
  themes/
    champagne.css         -- [data-theme="champagne"] { --stsgs-*: ... }
    cyan-night.css        -- [data-theme="cyan-night"] { --stsgs-*: ... }
    zinc.css              -- [data-theme="zinc"] { --stsgs-*: ... }
    champagne-light.css   -- [data-theme="champagne-light"] { --stsgs-*: ... }
    cyan-morning.css      -- [data-theme="cyan-morning"] { --stsgs-*: ... }
```

### Key Changes

| Before | After |
|--------|-------|
| `type ThemePreset = 'zinc' \| 'champagne' \| ...` | `type ThemePreset = string` (open) |
| Add theme = edit 3 files | Add theme = 1 new file + `registerPreset()` |
| `DARK_TO_LIGHT` / `LIGHT_TO_DARK` maps | `pair` field inside preset definition |
| All presets in one file (332 lines) | 1 file per preset (~60 lines each) |
| globals.css duplicates `:root`/`.dark` | `[data-theme]` selectors, no duplication |
| shadcn reads `--background` | `@theme inline` maps `--color-background: var(--stsgs-bg-deep)` |

### Theme Recommendation Engine

```typescript
function recommendTheme(context: {
  goal: string           // 'saas' | 'ecommerce' | 'blog' | ...
  mood?: string          // 'premium' | 'tech' | 'playful' | 'minimal'
  audience?: string      // 'developers' | 'consumers' | 'enterprise'
}): ThemePreset
```

Mapping:

| Context | Recommended Theme |
|---------|-------------------|
| SaaS + premium | champagne |
| SaaS + tech | cyan-night |
| SaaS + minimal | zinc |
| E-commerce + premium | champagne-light |
| E-commerce + tech | cyan-morning |
| Blog + minimal | zinc |
| Documentation + developers | cyan-night |
| Portfolio + premium | champagne |
| CRM + enterprise | zinc |
| Dashboard + tech | cyan-night |

---

## 5. Current State -- What Exists

### Files

```
src/
  app/
    globals.css                    -- 143 lines (@theme inline + WCAG focus)
    page.tsx                       -- 17 lines (provider wrappers + AppContent)
  lib/layout/
    theme.tsx                      -- 104 lines (LayoutThemeProvider + StudioThemeProvider alias)
    project-theme.tsx              -- 107 lines (ProjectThemeProvider + useProjectTheme)
    theme-types.ts                 -- PresetDefinition, ThemeTokens, ThemeMode
    theme-registry.ts              -- registerPreset(), getAll(), getByMode(), getPair()
    tokens.ts                      -- 221 lines (colors, spacing, typography, darkTokens, lightTokens)
    types.ts                       -- 109 lines (LayoutRecipe, LayoutAdviceInput, etc.)
    scoring.ts                     -- scoring engine for useLayoutAdvice
    use-ai-prompt.ts               -- AI prompt parsing
    presets/
      champagne.ts                 -- Champagne preset (dark, gold, Playfair Display)
      champagne-light.ts           -- Champagne Light preset
      cyan-night.ts                -- Cyan Night preset (dark, cyan, Inter)
      cyan-morning.ts              -- Cyan Morning preset
      zinc.ts                      -- Zinc preset (dark, emerald, Inter)
  app/
    themes/
      champagne.css                -- [data-theme="champagne"] selectors
      champagne-light.css
      cyan-night.css
      cyan-morning.css
      zinc.css
  components/layout/
    variant-tabs.tsx               -- StudioNavBar + BrandLogo + VariantTabs + RecipeCounter
    theme-preset-selector.tsx      -- 66 lines (selector shell)
    theme-dropdown.tsx             -- 72 lines (dropdown content)
    theme-mode-toggle.tsx          -- 43 lines (Sun/Moon mode toggle)
    preset-list.tsx                -- 101 lines (PresetList + Swatch + PresetInfo)
    prompt-studio.tsx              -- 97 lines (hero + chips + empty state)
    prompt-input.tsx               -- 89 lines (input + submit button)
    parse-pipeline.tsx             -- 91 lines (ParsePipeline + BestMatch)
    use-ranked-recipes.ts          -- hook for ranking
    layout-explorer.tsx            -- 116 lines
    explorer-sidebar.tsx           -- 137 lines
    explorer-grid-view.tsx         -- 61 lines
    explorer-list-view.tsx         -- 42 lines
    ai-canvas.tsx                  -- 146 lines
    wireframe-preview.tsx          -- 139 lines
    grid-preview.tsx               -- 129 lines
    grid-code-block.tsx            -- 103 lines
    code-drawer.tsx                -- 72 lines
    score-gauge.tsx                -- 39 lines
    pipeline-node.tsx              -- 48 lines
    syntax-highlight.tsx           -- 59 lines
  data/
    recipes.json                   -- 51 layout recipes
```

### What Works

- Layout Engine (51 recipes, scoring, recommendations)
- Theme Engine (registry, 5 presets, CSS vars, data-theme attribute)
- Dual Theme System (Studio + Project providers, independent themes)
- 3 variant views (Prompt Studio, Layout Explorer, AI Canvas)
- Theme switching (5 presets, dark/light toggle, paired switching)
- WCAG 2.4.7 focus indicators
- Reduced motion support
- Anti-Monolith compliance (all files within line limits)

### What's Missing

- `recommendTheme({ goal, mood, audience })` -- context-aware theme recommendation
- Component Engine (context-aware composition)
- Unified flow (one input -> full output)
- Live preview with project theme (wireframe in project theme)
- Code export
- Token fine-tuning (sliders for radius, accent, etc.)
- Layout Explorer stubs (Search, Layers, Code/Docs/Playground tabs)
- WCAG 2.1 AA audit across all existing components
- Typography audit (fontFamily vs fontFamilyMono)
- Smooth CSS transition on theme change (from Code-Realm analysis)

---

## 6. Discussion History

### Session 1-2: Foundation & Theme Presets
- Built initial Layout Explorer with 51 recipes
- Created `useLayoutAdvice` hook with scoring engine
- Designed 5 theme presets: Champagne, Cyan Night, Zinc, Champagne Light, Cyan Morning
- Implemented `LayoutThemeProvider` + `ThemePresetSelector`
- WCAG 2.4.7 focus ring implementation

### Session 3: Code-Realm Study & Anti-Monolith Discussion
- User asked to study https://github.com/stsgs1980/Code-Realm for theme implementation
- Discussed globals.css as monolith (~1300 lines potential)
- Decided: break into per-theme CSS files with `[data-theme]` selectors
- Discussed scalability: what if 20 presets?
- Decided: registry pattern (Map<string, PresetDefinition>) instead of closed union type

### Session 4: Studio Vision Clarification
- User: "if we build a studio where we build interfaces, give components by context, make needed effects and colors, so the output is a mega product?"
- This changed the framing: theme switcher is NOT the goal, Interface Studio IS the goal
- Defined 3 engines: Layout (done), Theme (next), Component (future)
- Theme = recommendation by context, not user selection

### Session 5: Reference Products Study
- Studied 21st.dev -- component marketplace + AI agents
- Studied UI UX Pro Max -- design intelligence database (57 styles, 95 palettes)
- Studied Google Stitch -- AI UI generator from prompt/sketch
- Conclusion: we combine the best of all three + add unique value (layout scoring, context themes, npm package)

### Session 6: Dual Theme System -- DONE
- User identified critical distinction: "studio colors vs project colors"
- Decided: two independent theme providers
  - StudioThemeProvider: stable, neutral (Zinc dark default)
  - ProjectThemeProvider: dynamic, context-dependent
- CSS variable prefixes: `--studio-*` and `--project-*`

### Session 7: Documentation Fix
- User: "fix all discussion so we don't lose the thread"
- Created this document
- Synchronized all 6 documents (README, architecture, phase-plan, core.md, CLAUDE.md, PROJECT_CONFIG.md)

### Session 8: Code-Realm Deep Study
- Read full Code-Realm source: theme-provider.tsx, theme-toggle.tsx, globals.css (4500+ lines), sections-registry.ts, palette.tsx, page.tsx
- **Key findings**:
  - Theme system = `next-themes` (dark/light only) — too simple for our Dual Theme
  - globals.css = 4500+ line monolith — confirms our anti-monolith decision
  - **sections-registry.ts** = Registry pattern (SectionConfig[]) — validates our Theme Registry plan
  - **palette.tsx** = 7 color harmony algorithms + WCAG checking — TAKE for recommendTheme()
  - **useSyncExternalStore** for SSR-safe mounting — TAKE for our hooks
  - **Hardcoded colors** in page.tsx — DON'T TAKE, we use design tokens
- Full analysis saved: `docs/planning/code-realm-analysis.md`

### Session 9: Theme Engine + Dual Theme Implementation -- DONE
- Implemented Theme Engine: registry (Map), theme-types.ts, theme-registry.ts, per-file presets, CSS [data-theme] selectors
- Refactored globals.css: removed `:root`/`.dark`, added `@theme inline` mapping
- Connected LayoutThemeProvider to registry + `data-theme` attribute on `<html>`
- Implemented Dual Theme System:
  - Created ProjectThemeProvider + useProjectTheme() (src/lib/layout/project-theme.tsx)
  - Added StudioThemeProvider/useStudioTheme aliases in theme.tsx
  - Studio chrome (nav, sidebar) uses StudioTheme (Zinc, stable)
  - Project preview (GridPreview) uses ProjectTheme (dynamic)
  - Theme selector controls PROJECT theme, styled via STUDIO theme

### Session 10: Anti-Monolith Compliance -- DONE
- Split all files exceeding Rule 1 limits (all components now <= 150 lines)
- Updated docs: phase-plan.md, architecture.md, core.md marked Phase 2/3 as DONE

---

## 7. Next Steps

### Immediate: Component Engine + Unified Studio Flow

1. Implement `recommendTheme()` — context-aware theme recommendation
2. Map goals to component compositions per layout slot
3. Per-slot component selection with variant system (light/dark, minimal/rich)
4. Merge 3 variants into one unified workspace (Prompt Studio, Layout Explorer, AI Canvas)
5. Left panel: context input (goal, style, audience)
6. Right panel: live preview with project theme
7. Bottom panel: exportable code
8. Context changes → layout + theme + components update together

### Future: Polish

- Layout Explorer stubs (Search, Layers, Code/Docs/Playground tabs)
- Smooth CSS transition on theme change (from Code-Realm analysis)
- WCAG 2.1 AA audit across all existing components
- Typography audit (fontFamily vs fontFamilyMono)
- Token fine-tuning UI (sliders for radius, accent, etc.)
---

## 8. Key Terminology

| Term | Definition |
|------|-----------|
| **Studio** | The @stsgs/ui application itself -- the tool the user interacts with |
| **Project** | The interface being created inside the Studio |
| **Studio theme** | Colors/typography of the Studio application (stable, neutral) |
| **Project theme** | Colors/typography of the interface being created (dynamic, context-dependent) |
| **Theme Engine** | System that recommends and applies themes based on context |
| **Layout Engine** | System that recommends layouts based on goals (DONE) |
| **Component Engine** | System that recommends components based on context + layout (NEXT) |
| **Preset** | A complete set of design tokens (colors, fonts, radius, shadows) |
| **Registry** | Central Map<string, PresetDefinition> for all presets |
| **recommendTheme()** | Function that maps context -> theme preset |
| **useLayoutAdvice**** | Hook that maps goal -> layout recommendation with scoring |

---

## 9. 5 Theme Presets Reference

| Preset | Mode | Accent | Font Display | Radius | Pair | Best For |
|--------|------|--------|-------------|--------|------|----------|
| Champagne | dark | #C8A97E (gold) | Playfair Display | 2px | champagne-light | Premium, luxury, fintech |
| Cyan Night | dark | #00E5FF (cyan) | Inter | 2px | cyan-morning | Tech, developer tools, dashboards |
| Zinc | dark | #10B981 (emerald) | Inter | 12px | -- | Neutral, admin, enterprise |
| Champagne Light | light | #856930 (dark gold) | Playfair Display | 2px | champagne | Premium light, editorial |
| Cyan Morning | light | #0E7490 (dark cyan) | Inter | 2px | cyan-night | Tech light, documentation |

---

Built with: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + shadcn/ui + Radix UI
