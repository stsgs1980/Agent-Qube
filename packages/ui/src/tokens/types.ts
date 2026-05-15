/** Design tokens type definition */
export interface DesignTokens {
  colors: Record<string, string>
  spacing: Record<string, string>
  typography: {
    fontFamilies: Record<string, string>
    fontSizes: Record<string, string>
    fontWeights: Record<string, number>
    lineHeights: Record<string, string>
    letterSpacings: Record<string, string>
  }
  shadows: Record<string, string>
  radii: Record<string, string>
  breakpoints: Record<string, string>
  transitions: Record<string, string>
  layout: LayoutTokens
}

/** Layout system tokens -- grid, container, sidebar */
export interface LayoutTokens {
  /** Max content widths per named size */
  containerMaxWidths: Record<ContainerSize, string>
  /** Named sidebar widths */
  sidebarWidths: Record<SidebarVariant, string>
  /** Column gap between grid items */
  gutters: Record<GutterSize, string>
  /** Default grid column counts per breakpoint */
  defaultColumns: Record<string, number>
}

export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'
export type SidebarVariant = 'narrow' | 'default' | 'wide'
export type GutterSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type BreakpointName = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

/** Layout structure names -- all grid patterns supported by @stsgs/ui */
export type LayoutStructure =
  // Classic
  | 'sidebar-left' | 'sidebar-right' | 'top-nav' | 'two-columns' | 'three-columns'
  | 'holy-grail' | 'split-screen' | 'cards-grid' | 'magazine' | 'fullscreen-hero'
  // Bento
  | 'bento-grid' | 'bento-sidebar' | 'bento-hero' | 'bento-masonry'
  // Artistic
  | 'masonry-grid' | 'asymmetric-grid' | 'span-grid' | 'overlap-grid'
  | 'honeycomb-grid' | 'mosaic-grid' | 'responsive-grid'
  // Mathematical
  | 'fibonacci-grid' | 'fibonacci-columns' | 'fibonacci-tiles'
  | 'fibonacci-responsive' | 'fibonacci-masonry' | 'fibonacci-bento'
  | 'fibonacci-steps' | 'fibonacci-cascade'
  | 'golden-ratio-grid' | 'phi-grid' | 'rule-of-thirds'
  | 'harmonic-series'
  | 'prime-grid' | 'sqrt-grid' | 'modular-grid'
  // Application
  | 'dashboard' | 'blog'
  // Advanced (from CSS-Grid analysis)
  | 'grid-overlap' | 'full-bleed' | 'container-query-grid'
  | 'scroll-snap-grid' | 'animated-grid' | 'subgrid-sync'
  | 'auto-flow-column' | 'dense-packing' | 'login-split'
  | 'form-label-input' | 'nav-logo-action' | 'grid-template-shorthand'
  | 'implicit-named-lines'

/** Project goal -- what kind of project is this layout for? */
export type ProjectGoal =
  | 'landing' | 'admin-panel' | 'blog' | 'ecommerce'
  | 'dashboard-app' | 'documentation' | 'portfolio'
  | 'social' | 'media' | 'saas' | 'crm' | 'analytics'

/** Layout category -- groups for browsing and filtering */
export type LayoutCategory =
  | 'classic' | 'bento' | 'artistic' | 'mathematical' | 'application'
  | 'advanced'

/** Named region (slot) in a layout */
export interface LayoutRegion {
  /** Slot name -- used in <Layout.Slot name="..."> */
  name: string
  /** Whether this slot must be provided (default: false) */
  required?: boolean
  /** Default minimum height */
  minHeight?: string
}

/** Grid template for a specific breakpoint */
export interface GridTemplate {
  /** CSS grid-template-columns value */
  columns: string
  /** CSS grid-template-rows value (optional) */
  rows?: string
  /** CSS grid-template-areas value (optional, line-by-line) */
  areas?: string[]
}

/** Layout recipe -- complete definition of a layout structure */
export interface LayoutRecipe {
  /** Layout structure identifier */
  structure: LayoutStructure
  /** Human-readable name */
  name: string
  /** Description of when to use this layout */
  description: string
  /** Category for grouping */
  category: LayoutCategory
  /** Project goals this layout is best for */
  bestFor: ProjectGoal[]
  /** Project goals this layout conflicts with */
  conflicts: ProjectGoal[]
  /** Technical notes about implementation */
  techNotes: string
  /** Named regions (slots) this layout accepts */
  regions: LayoutRegion[]
  /** Grid template for desktop (lg+) */
  gridTemplate: GridTemplate
  /** Grid template for tablet (md) -- if different from desktop */
  gridTemplateTablet?: GridTemplate
  /** Grid template for mobile (base) -- if different from desktop */
  gridTemplateMobile?: GridTemplate
  /** Gap between grid cells */
  gap: GutterSize
  /** Minimum height (default: '100vh' for full-page layouts) */
  minHeight?: string
  /** ASCII preview of the layout shape */
  preview: string
}

/** Advice from the layout advisor */
export interface LayoutAdvice {
  /** Layout structure being advised about */
  structure: LayoutStructure
  /** Advice type */
  type: 'recommended' | 'warning' | 'error'
  /** Human-readable message */
  message: string
}

/** Input for layout advice */
export interface LayoutAdviceInput {
  /** What kind of project */
  goal: ProjectGoal
  /** What type of content will be displayed */
  contentType?: 'cards' | 'text' | 'data' | 'media' | 'forms' | 'mixed'
  /** Approximate number of content items */
  itemCount?: number
  /** Whether the layout needs a sidebar */
  needsSidebar?: boolean
  /** Whether the layout needs a header */
  needsHeader?: boolean
  /** Whether the layout needs a footer */
  needsFooter?: boolean
}
