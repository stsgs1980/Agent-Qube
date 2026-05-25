# Development Phases — @stsgs/ui Interface Studio

> For the full vision and all architectural decisions, see `docs/planning/studio-vision.md`.

## Engine Roadmap (Current Priority)

The Studio is built on three engines. This is the active development sequence.

### Phase 1: Layout Engine -- DONE

- [x] 51 layout recipes (6 categories: mathematical, advanced, classic, artistic, bento, application)
- [x] Multi-goal scoring with conflict mitigation
- [x] `useLayoutAdvice()` hook
- [x] `parsePrompt()` + `scoreLayout()` + `scoreLayoutMulti()`
- [x] 3 variant views: Prompt Studio, Layout Explorer, AI Canvas

### Phase 2: Theme Engine -- DONE

- [x] Create `theme-types.ts` with `PresetDefinition` interface
- [x] Create `theme-registry.ts` with `registerPreset()`, `getAll()`, `getByMode()`, `getPair()`
- [x] Split `presets.ts` into individual files under `presets/`
- [x] Create CSS files under `themes/` with `[data-theme]` selectors
- [x] Refactor `globals.css` -- remove `:root`/`.dark`, add `@theme inline` mapping
- [x] Refactor `LayoutThemeProvider` to use registry + `data-theme` attribute
- [x] `ThemePreset` type: `string` (open, not closed union)
- [x] Remove `DARK_TO_LIGHT`/`LIGHT_TO_DARK` maps (pair inside definition)
- [ ] Implement `recommendTheme({ goal, mood, audience })` (future -- needs Component Engine context)

### Phase 3: Dual Theme System -- DONE

- [x] Create `StudioThemeProvider` (outer, stable, Zinc default)
- [x] Create `ProjectThemeProvider` (inner, dynamic, context-dependent)
- [x] Create `useStudioTheme()` and `useProjectTheme()` hooks
- [x] CSS variable prefixes: `--studio-*` / `--project-*`
- [x] Refactor all existing components to use correct provider
- [x] `data-studio-theme` and `data-project-theme` attributes

### Phase 4: Component Library -- NEXT

> Component Engine deferred until library has real components to recommend.
> Currently: 7 sections + 6 features in packages/ui/src/. Need Wave 1 (~30 components).

- [ ] De-hardcode 6 backlog components (ThreeColumnBrowser, FourColumnBrowser, CTABanner, StaggeredHero, IdeLayout, ResponsiveShowcase)
- [ ] Build/extract Wave 1 core components (~30): Hero, Navbar, Footer, FAQ, Testimonials, Stats, PricingCards, Contact...
- [ ] Build/extract Wave 2 domain components (~25): LivePreview, CodePlayground, DecisionTree...
- [ ] After Wave 1-2 complete -> resume Component Engine (Phase 4b)

### Phase 4b: Component Engine (DEFERRED)

> Blocked on: Component Library (Phase 4) must have real components first.

- [ ] Map goals to component compositions
- [ ] Per-slot component selection
- [ ] Variant system (light/dark, minimal/rich)
- [ ] Code generation with proper imports
- [ ] `recommendTheme()` integration (context-aware theme recommendation)

### Phase 5: Unified Studio Flow

- [ ] Merge 3 variants into one unified workspace (currently: Prompt Studio, Layout Explorer, AI Canvas)
- [ ] Left panel: context input (goal, style, audience)
- [ ] Right panel: live preview with project theme
- [ ] Bottom panel: exportable code
- [ ] Context changes -> layout + theme + components update together

### Phase 6: Distribution

- [ ] npm package: `@stsgs/ui`
- [ ] CLI: `create-stsgs-app`, `stsgs add`, `stsgs scan`
- [ ] Component Browser: live preview + code + install

---

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

---

## TODO: Layout UI — Pending Features

> Status as of current session. These are functional gaps, not cosmetic issues.

### Layout Explorer (`layout-explorer.tsx`)

- [ ] **Search** — Sidebar shows `<span>Search...</span>` instead of a working input. Need: controlled input that filters `ranked` by recipe name/structure/category.
- [ ] **Code tab** — `viewTab === 'code'` switches state but renders the same card grid. Need: dedicated code-view showing CSS Grid output for all filtered recipes (or selected one).
- [ ] **Docs tab** — `viewTab === 'docs'` switches state but renders the same card grid. Need: documentation view with recipe description, regions table, tech notes, responsive breakpoints.
- [ ] **Playground tab** — `viewTab === 'playground'` switches state but renders the same card grid. Need: interactive grid editor (drag regions, change gap/columns, live preview). This is a larger feature.
- [ ] **Layers** — Sidebar shows layer nav (ui/, sections/, features/, hooks/, providers/) but `activeLayer` has no effect on filtering. Should be tied to the component library once built. Do together with library work, not before.

### AI Canvas (`ai-canvas.tsx`)

- No pending functional gaps. All features work (Cmd+K palette, prompt parsing, wireframe, ranking, viewport switcher).

### Prompt Studio (`prompt-studio.tsx`)

- No pending functional gaps. Both keyword and AI modes work. Pipeline visualization, multi-goal bar, example chips all functional.

### Priority

| Item | Effort | When |
|------|--------|------|
| Search | ~15 min | Anytime |
| Code tab | ~1 hr | Anytime |
| Docs tab | ~1 hr | Anytime |
| Playground tab | ~4 hr | Separate sprint |
| Layers | ~2 hr | Together with component library |

---

## Component Library Catalog — Source Inventory & Wave Plan

> Two source repos scanned:
> 1. **Component-Browser-Public-v1.0** — 290 files, 20 categories, 273 unique component names. Raw extracted components from multiple projects (DS_Reference, Performance-Lab, P-MAS, CHROMEDNA, Flow-Studio-Pro, etc.)
> 2. **Component-Browser** — Browser app itself (Next.js + Prisma + shadcn). 11 browser-specific components (ComponentCard, CompareModal, ComponentDetailModal, etc.)

### Source 1: Component-Browser-Public-v1.0 Inventory

| Category | Count | Components |
|----------|-------|------------|
| animation | 22 | AmbientBackground, AmbientGlowRing, AnimatedBackground, AnimatedContainer, AnimatedCounter, AnimatedEdgeParticles, AnimatedProgressBar, BackgroundParticles, CameraRig, CrtOverlay, CursorEffect, DynamicBackground, FadeIn, FloatingParticles, FlowCanvas, GlitchBlock, HolographicGridFloor, MVPFlowCanvas, PostProcessing, PulsingEnergyCore, VolumeHeatmap3D, WeatherParticles |
| cards | 13 | AnimatedStatusCard, CatalogCard, CategoryDetailCard, CategoryTile, EntityCard, FeatureCard, GalleryCard, InfoCardGrid, PatternCard, RatingComparisonCard, StackCard, ToolCard, ToolStackCard |
| chat | 4 | ChatInput, ChatMessage, ChatPanel, FlowAssistant |
| color | 11 | BadgeCloud, ColorPalette, ColorPicker, ColorPickerPanel, ColorSchemePreview, ColorVariantsList, ContrastPicker, ContrastValidator, GradientGenerator, Input, PaletteStudio |
| content | 26 | CodeBlock, ComparisonMatrix, ComparisonTable, Contact, Experience, FaqAccordion, Glossary, GridItem, GuidedTour, HowIWork, IconLogo, LearningPath, Projects, PromptTemplates, QuickQuiz, QuickReference, SectionHeader, SectionTitle, Skills, Statistics, StepCard, TechniqueBattle, Testimonials, UsageGuide, WarningsBlock, WelcomeScreen |
| data-display | 16 | CapacityMeter, CompatibilityMatrix, ComplexityBadge, ConnectionBadge, CostSimulator, KPIStrip, LiveTicker, MetricBar, PerformanceDashboard, RankingList, RecentActivityTimeline, SortIcon, StatsGrid, StatsRow, SystemHealthMonitor, VerticalTimeline |
| dev-tools | 22 | AnimationGenerator, Base64Tool, BorderGenerator, CodeBlock, CodeDiff, CodePlayground, CodeWindow, CopyableCodeBlock, CssFiltersGenerator, CssSnippets, FlexboxGridTool, JsonFormatter, MarkdownPreview, RegexTester, ScreenshotExport, ShadowGenerator, SvgEditor, TerminalFrame, Transform3dTool, TypographyTool, UnitConverter |
| error-handling | 2 | ComponentErrorBoundary, ErrorBoundary |
| feedback | 3 | AchievementToast, EmptyState, PageLoader |
| flow | 8 | AnimatedFlowConnector, ArchitectureBuilder, FeedbackLoopArrow, FlowNode, FlowNodeShell, MiniPipeline, PipelineArrow, PipelineStepNode |
| forms | 9 | CategoryFilter, EcosystemFilter, FilterBar, FilterPanel, GoalSelector, LayoutSelector, NodePalette, ThemeSettings |
| hooks | 25 | ApiKeyAuth, CircuitBreaker, CompositeScoringEngine, FallbackManager, FormatFileSize, HealthCheck, HelixMath, PipelineSimulator, PreviewHTMLGenerator, RateLimiter, ResilienceSuite, SlavicPluralize, TextSanitizer, TradeSimulationStore, UseFilteredSections, UseGroupedItems, UseIconRegistry, UseIsMobile, UseKeyboardShortcuts, UseNavigationStore, UseWeightedScorer, UtilityParsers, UtilityTools, useAppStore, usePersisted |
| i18n | 3 | LanguageProvider, TypeSafeI18n, UseLocaleSync |
| interactive | 15 | BrutalistWidgets, Button, CliBlock, CollapsibleSection, DecisionTree, FloatingItem, ImageShowcase, ImageWithFallback, InteractivePlayground, NestedAccordion, RetroTerminal, RiskCalculator, SciFiHUD, SelectElementButton, SelectionActionBar |
| layout | 35 | AcademySection, AppLayout, CTABanner, ComparisonSection, ComponentsSection, DeveloperGuideSection, Footer, FoundationsSection, FourColumnBrowser, Header, Hero, Home, HomeSection, IdeLayout, IndustrialHome, LibrariesSection, Navigation, PatternsSection, PrinciplesSection, ProcessSection, QuickActions, ResourcesSection, ResponsiveShowcase, SearchableFilterableGrid, Sidebar, StacksSection, StaggeredHero, StatsSection, SystemsSection, TechnologiesSection, TerminalHeader, ThreeColumnBrowser, UIRadarPage |
| navigation | 15 | BackToTop, CardsTab, CommandPalette, GalleryTab, GradientTabBar, GradientsTab, HeroTab, InteractiveTab, PresentationMode, ScrollNavbar, SearchModal, SectionsTab, TabButton, UnderlineTabs, ViewModeToggle |
| panels | 13 | AdvisorPanel, CodeViewerDialog, ConfirmDeleteDialog, EventLogPanel, ExecutionPanel, HelpModal, ImageLightbox, MultiTimeframeComparison, NodeConfigPanel, NotificationCenter, PlaybackBar, PriceAlerts, ProjectDetailsModal |
| preview | 5 | ComponentPreview, LivePreview, MVPFlowEditor, SandboxedPreview, SyntaxHighlight |
| theme | 10 | CarbonCSSTheme, CarbonDesignTokens, ChromeDNATheme, IndustrialThemeToggle, OKLCHTheme, ProseDarkMode, StyleSwitcher, ThemeProvider, ThemeToggle, TypeScale |
| visualization | 17 | BenchmarksChart, ConnectionHeatmap, DirectedGraphDiagram, EquitySparkline, GitHubActivityGraph, HeatmapChart, MappingGrid, MiniBarChart, MiniSparkline, PerformanceHeatmap, RadarButton, RadarChart, RadarComparison, SentimentGauge, SkillsRadar, TokenFlowVisualizer, ToolsGraph |

### Source 2: Component-Browser (Browser App)

11 browser-specific components (not for library, for Component Browser product):
ActivityTimeline, CompareModal, ComponentCard, ComponentDetailModal, ComponentGraph, ComponentRow, KeyboardHelpModal, LoadingSkeleton, SearchHistoryDropdown, SidebarContent, StatsDashboard

### Mapping: Source Categories → Library Layers

Not all 273 components belong in the library. Some are too project-specific, some are duplicates, some need heavy cleanup.

| Source Category | → Library Layer | Notes |
|-----------------|-----------------|-------|
| animation | **ui/** (5) + skip rest | Keep: FadeIn, AnimatedContainer, AnimatedProgressBar, AnimatedCounter, CursorEffect. Skip 3D/Canvas deps (HolographicGridFloor, CameraRig, etc.) |
| cards | **ui/** (8) | Keep: CatalogCard, EntityCard, FeatureCard, PatternCard, StackCard, ToolCard, RatingComparisonCard, CategoryTile. Skip: AnimatedStatusCard (animation dep), InfoCardGrid (layout, not card) |
| chat | **features/** (1) | ChatPanel only (combines ChatInput+ChatMessage). Skip individual pieces. |
| color | **features/** (3) + **ui/** (2) | features: ColorPickerPanel, PaletteStudio, GradientGenerator. ui: ColorPicker, ColorPalette. Skip: BadgeCloud (content), ContrastValidator (hook) |
| content | **sections/** (10) + **ui/** (6) | sections: FaqAccordion, Testimonials, Statistics, LearningPath, Glossary, StepCard, ComparisonTable, WelcomeScreen, Contact, Projects. ui: CodeBlock, SectionHeader, GridItem, QuickReference, WarningsBlock, UsageGuide |
| data-display | **ui/** (10) | StatsGrid, StatsRow, KPIStrip, MetricBar, RankingList, CapacityMeter, VerticalTimeline, RecentActivityTimeline, LiveTicker, ComplexityBadge. Skip: PerformanceDashboard (section), CostSimulator (feature) |
| dev-tools | **features/** (5) + skip rest | features: CodePlayground, JsonFormatter, RegexTester, MarkdownPreview, SvgEditor. Skip: generators (too niche), CodeDiff (needs heavy deps) |
| error-handling | **providers/** (1) | ErrorBoundary (merge ComponentErrorBoundary into one) |
| feedback | **ui/** (3) | AchievementToast, EmptyState, PageLoader |
| flow | **features/** (2) | ArchitectureBuilder, MiniPipeline. Skip: FlowNode shells (too raw) |
| forms | **ui/** (5) | FilterBar, FilterPanel, CategoryFilter, GoalSelector, LayoutSelector |
| hooks | **hooks/** (12) | UseIsMobile, UseKeyboardShortcuts, UseNavigationStore, UseFilteredSections, UseGroupedItems, UseWeightedScorer, UseIconRegistry, useAppStore, usePersisted, RateLimiter, CircuitBreaker, TextSanitizer. Skip: HelixMath (math lib), PipelineSimulator (domain), TradeSimulationStore (domain) |
| i18n | **providers/** (2) | LanguageProvider, TypeSafeI18n. UseLocaleSync → hooks/ |
| interactive | **features/** (4) + **ui/** (3) | features: InteractivePlayground, DecisionTree, RiskCalculator, SciFiHUD. ui: CollapsibleSection, ImageWithFallback, SelectionActionBar |
| layout | **sections/** (12) + **ui/** (4) | Already partially extracted. sections: Hero, Footer, Header, Navigation, CTABanner, StaggeredHero, StatsSection, ComparisonSection, ThreeColumnBrowser, FourColumnBrowser, ComponentsSection, AcademySection. ui: Sidebar, AppLayout, QuickActions. Skip: page-level stuff (Home, IndustrialHome) |
| navigation | **features/** (3) + **ui/** (5) | features: CommandPalette, SearchModal, PresentationMode. ui: ScrollNavbar, BackToTop, UnderlineTabs, ViewModeToggle, GradientTabBar |
| panels | **features/** (5) | NotificationCenter, HelpModal, ImageLightbox, CodeViewerDialog, NodeConfigPanel. Skip: domain-specific (PriceAlerts, PlaybackBar) |
| preview | **features/** (3) | LivePreview, SandboxedPreview, ComponentPreview. SyntaxHighlight → ui/ |
| theme | **providers/** (1) + **features/** (2) + **ui/** (3) | providers: ThemeProvider. features: ThemeToggle, StyleSwitcher. ui: TypeScale, OKLCHTheme. Skip: Carbon/ChromeDNA themes (too specific) |
| visualization | **ui/** (8) | MiniBarChart, MiniSparkline, RadarChart, SkillsRadar, HeatmapChart, BenchmarksChart, MappingGrid, ToolsGraph. Skip: 3D/Canvas deps |

### Wave Plan

#### Wave 1: Foundation (close 80% of everyday needs)

**Target: What every project needs, regardless of domain.**

| Layer | Components | Source |
|-------|-----------|--------|
| **ui/** | EmptyState, PageLoader, CodeBlock, SectionHeader, CollapsibleSection, SelectionActionBar, ImageWithFallback, FadeIn, AnimatedCounter, AnimatedProgressBar | Extract + clean from repo1 |
| **ui/** | FilterBar, FilterPanel, StatsGrid, StatsRow, KPIStrip, MetricBar, RankingList, VerticalTimeline, MiniBarChart, MiniSparkline | Extract + clean from repo1 |
| **sections/** | FaqSection, TestimonialsSection, StatsSection, ComparisonTable, ContactSection, WelcomeSection | Extract + clean from repo1 |
| **hooks/** | useIsMobile, useKeyboardShortcuts, usePersisted, useAppStore | Extract + clean from repo1 |
| **providers/** | ErrorBoundary | Merge 2 versions from repo1 |
| **features/** | CommandPalette (exists), SearchModal, NotificationCenter | Extract + clean from repo1 |

~30 components. After this wave, the library is usable for any web project.

#### Wave 2: Domain Composites

**Target: Section-level building blocks for specific project types.**

| Layer | Components | Source |
|-------|-----------|--------|
| **sections/** | Hero (exists), Footer (exists), Header (exists), Navigation (exists), StacksSection, AcademySection, ComponentsSection, LearningPathSection, GlossarySection | Already have 4, extract 5 more |
| **features/** | LivePreview, SandboxedPreview, InteractivePlayground, DecisionTree, ColorPickerPanel, ImageLightbox | Extract + clean |
| **features/** | CodePlayground, JsonFormatter, RegexTester | Dev tools |
| **ui/** | CatalogCard, EntityCard, FeatureCard, PatternCard, ToolCard | Card variants |
| **ui/** | ScrollNavbar, BackToTop, UnderlineTabs | Navigation primitives |

~25 components. After this wave, the library covers dashboards, landing pages, and component browsers.

#### Wave 3: Specialized

**Target: Niche but high-value components.**

| Layer | Components | Source |
|-------|-----------|--------|
| **features/** | ArchitectureBuilder, MiniPipeline, PaletteStudio, GradientGenerator, PresentationMode | Flow/creative tools |
| **features/** | RiskCalculator, SciFiHUD | Specialty |
| **ui/** | HeatmapChart, RadarChart, SkillsRadar, MappingGrid, ToolsGraph | Visualization |
| **ui/** | AnimatedContainer, CursorEffect, AnimatedEdgeParticles | Animation |
| **hooks/** | RateLimiter, CircuitBreaker, TextSanitizer, UseFilteredSections, UseGroupedItems | Resilience + filtering |
| **providers/** | LanguageProvider, TypeSafeI18n | i18n |
| **features/** | ChatPanel | Chat |

~25 components. After this wave, the library is comprehensive.

#### Wave 4: Cleanup & Skip

These components will NOT be extracted (too project-specific, heavy 3D deps, or redundant):
- 3D/Canvas: CameraRig, HolographicGridFloor, PostProcessing, PulsingEnergyCore, VolumeHeatmap3D, WeatherParticles, FloatingParticles, BackgroundParticles, DynamicBackground, AnimatedBackground
- Domain-specific: PriceAlerts, PlaybackBar, MultiTimeframeComparison, CostSimulator, TradeSimulationStore, PipelineSimulator, EquitySparkline
- Page-level (not reusable): Home, IndustrialHome, UIRadarPage, HomeSection
- Redundant: Button (we have shadcn Button), Input (we have shadcn Input), ThemeProvider (5 versions, merge into 1)
- Raw shells: FlowNodeShell, MVPFlowCanvas, shared, layout, page

### Known Issues in Source Repos ("кривизна")

Based on extraction report and existing code review:

1. **No barrel exports** — Most files lack index.ts
2. **No TypeScript props interfaces** — Many components use `any` or inline types
3. **No JSDoc** — Zero documentation comments
4. **Inline styles mixed with Tailwind** — Some use style={}, some className
5. **Hardcoded imports** — `@/components/ui/*` instead of `@stsgs/ui`
6. **No forwardRef** — Missing on most components
7. **Missing cn()** — Direct className concatenation instead of cn()
8. **Duplicate components** — ThemeProvider (5x), ThemeToggle (4x), AnimatedCounter (2x), etc.
9. **Oversized files** — FlowCanvas (340 lines), DynamicBackground (511 lines), GlitchBlock (394 lines)
10. **Some components are not really reusable** — They embed specific data/logic from their source project
