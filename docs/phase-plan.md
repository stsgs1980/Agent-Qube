# Development Phases — @stsgs/ui

## Backlog: Component-Browser Pattern Extraction

> Source: `stsgs1980/Component-Browser-Public-v1.0/reusable_components/layout/`
> Reviewed: 40 files, categorized, originals deleted. Only structurally valuable patterns retained.

### sections/ (Layer 3) — Composite layout sections

| Component | Source File | Status | Description |
|-----------|-----------|--------|-------------|
| `ThreeColumnBrowser` | 001_ThreeColumnBrowser.tsx | Ready for de-hardcoding | Generic 3-col master-detail (Categories→Items→Detail). Already prop-driven: `<C extends BrowserItem>`, `renderDetail` callback, dual-level tabs. Replace with Layout primitives. |
| `FourColumnBrowser` | 006_FourColumnBrowser.tsx | Ready for de-hardcoding | 4-col browser (Categories→Items→Variants→Preview/Code). localStorage favorites, `renderPreview`/`renderCode` callbacks. Already prop-driven. |
| `CTABanner` | 006_CTABanner.tsx | Ready for de-hardcoding | Composable CTA section with gradient card, glow effect, slot-based actions. Already prop-driven. |
| `StaggeredHero` | 009_StaggeredHero.tsx | Ready for de-hardcoding | Staggered-motion hero with `titleParts` (highlight spans), stats row, dot-grid bg. Already prop-driven. |

### features/ (Layer 4) — Feature-level composites

| Component | Source File | Status | Description |
|-----------|-----------|--------|-------------|
| `IdeLayout` | 006_IdeLayout.tsx | Ready for de-hardcoding | Full IDE mock (file tree + code editor + terminal + status bar) with `IdeFile`/`IdeTheme` types. Fully prop-driven, rich composite. |
| `ResponsiveShowcase` | 019_ResponsiveShowcase.tsx | Ready for de-hardcoding | Responsive design tool: device-frame preview, breakpoint visualizer, unit converter, CSS output. Fully prop-driven. |

### De-hardcoding checklist (applies to all 6)
- [ ] Replace hardcoded `@/` imports with `@stsgs/ui` layer imports
- [ ] Replace inline Tailwind with Layout/Slot composition from tokens
- [ ] Extract any remaining hardcoded strings/labels into props
- [ ] Add TypeScript strict props interfaces
- [ ] Add JSDoc documentation
- [ ] Write barrel export (index.ts)
- [ ] Verify: no upward layer imports (eslint-plugin-stsgs)

---

## Phase A: Data Preparation
**Goal**: Extract components from 45 repos and prepare them for the library

### Tasks
- [ ] Scan all 45 repos for React components
- [ ] Categorize into 6 layers
- [ ] Detect and catalog duplicates (1,431 expected)
- [ ] Repair imports (replace @/components/ui/* → @stsgs/ui)
- [ ] Add TypeScript props interfaces where missing
- [ ] Add JSDoc comments
- [ ] Split oversized files (>200 lines)
- [ ] Add barrel exports
- [ ] Generate quality report

### Scripts
```bash
pnpm extract           # Scan repos, extract components
pnpm repair            # Fix imports, add barrel exports
pnpm categorize        # Assign layers, tags, collections
```

### Output
- `scripts/data/extraction-report.json` — Full extraction data
- Components added to `packages/ui/src/{layer}/`

---

## Phase B: Component Browser
**Goal**: Build an interactive catalog for browsing and previewing components

### Features
- [ ] Live Preview with iframe
- [ ] Monaco Editor for code editing
- [ ] Tags and categories navigation
- [ ] Collections (Dashboard Kit, Auth Pages, etc.)
- [ ] Search and filter
- [ ] Copy import / Install buttons
- [ ] Props table with documentation
- [ ] Quality indicators (clean / needs-fix / broken)

### Package: `@stsgs/browser`

---

## Phase C: CLI & Distribution
**Goal**: Distribute components via CLI and NPM

### Commands
- [ ] `create-stsgs-app <name>` — Scaffold new project
- [ ] `stsgs add <component>` — Add component to existing project
- [ ] `stsgs list [layer]` — List available components
- [ ] `stsgs scan` — Check project for violations
- [ ] `stsgs ai init` — Generate AI rules
- [ ] `stsgs ai sync` — Sync AI rules across platforms

### Templates
- [ ] SaaS Landing Page
- [ ] Dashboard / Admin Panel
- [ ] Portfolio / Showcase
- [ ] Custom (empty)

### Package: `@stsgs/cli`, `create-stsgs-app`

---

## Phase D: Quality & Enforcement
**Goal**: Enforce anti-monolith rules programmatically

### ESLint Plugin Rules
- [x] `no-cross-layer-imports` — Block upward layer imports
- [x] `max-lines` — Max 200 lines per file
- [x] `max-use-state` — Max 3 useState per component

### Additional
- [ ] Pre-commit hooks
- [ ] CI pipeline integration
- [ ] Quality dashboard
- [ ] Automated repair suggestions

### Package: `eslint-plugin-stsgs`

---

## Phase E: Community & AI
**Goal**: Community features and AI integration

### Features
- [ ] Component ratings and reviews
- [ ] User collections
- [ ] Code sandbox integration
- [ ] AI component assistant
- [ ] Version history
- [ ] Changelog per component

---

## Updated Sequence

The original 4-phase plan from Component Browser Development Plan maps to these phases:

| Original | Updated | Focus |
|----------|---------|-------|
| Phase 1: Quality | Phase A | Data prep for library |
| Phase 2: Preview/UX | Phase B | Component Browser |
| Phase 3: CLI/Distribution | Phase C | CLI tools |
| Phase 4: Community/AI | Phase D+E | Enforcement + Community |

Key insight: Phase 1 from the original plan = data preparation for @stsgs/ui (not a separate task). Quality improvements happen during extraction, not after.
