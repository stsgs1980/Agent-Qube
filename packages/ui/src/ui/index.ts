// Layer 2: UI Components
// Pure presentation. No state, no hooks, no data-fetching.
// Props in, JSX out. Based on shadcn/ui + Radix UI.

// ─── Layout System (1 component + 51 recipes + advisor) ───────
export { Layout } from './layout'
export type { LayoutProps, LayoutSlotProps } from './layout'
export { useLayoutAdvice } from './layout'
export type { LayoutRecommendation, UseLayoutAdviceResult } from './layout'
export {
  layoutRegistry,
  getLayoutRecipe,
  getAllLayoutRecipes,
  getLayoutsByCategory,
  getLayoutsForGoal,
} from './layout'

// ─── Layout Primitives ────────────────────────────────────────
export { Grid, GridItem } from './grid'
export type { GridProps, GridItemProps, ResponsiveColumns, GapSize } from './grid'
export { Container } from './container'
export type { ContainerProps } from './container'
export { Stack } from './stack'
export type { StackProps } from './stack'
export { Cluster } from './cluster'
export type { ClusterProps } from './cluster'
export { ColumnBrowser } from './column-browser'
export type { ColumnBrowserProps, ColumnCategory, BrowserItem, ColumnTab } from './column-browser'
export { SearchableFilterableGrid } from './searchable-grid'
export type { SearchableFilterableGridProps, FilterableItem, FilterCategory } from './searchable-grid'
export { BentoGrid, BentoItem } from './bento-grid'
export type { BentoGridProps, BentoItemProps } from './bento-grid'
export { MasonryGrid } from './masonry-grid'
export type { MasonryGridProps } from './masonry-grid'

// ─── Custom Controls (Extracted from Code-Realm monoliths) ─────
export { SliderControl } from './slider-control'
export type { SliderControlProps } from './slider-control'
export { ColorPickerInput } from './color-picker-input'
export type { ColorPickerInputProps } from './color-picker-input'
export { CopyButton } from './copy-button'
export type { CopyButtonProps } from './copy-button'
export { CodeBlock } from './code-block'
export type { CodeBlockProps } from './code-block'
export { ForceGraph } from './force-graph'
export { useForceGraph } from './force-graph'
export { runPhysics } from './force-graph'
export type { ForceGraphProps, ForceGraphNode, ForceGraphEdge, PhysicsConfig } from './force-graph'

// ─── shadcn/ui Components (48) ────────────────────────────────
// Extracted from Component-Browser-Public-v1.0 browser-app

// Actions
export * from './button'
export * from './toggle'
export * from './toggle-group'
export * from './switch'
export * from './slider'

// Data Display
export * from './avatar'
export * from './badge'
export * from './card'
export * from './chart'
export * from './skeleton'
export * from './table'
export * from './separator'
export * from './scroll-area'
export * from './aspect-ratio'

// Feedback
export * from './alert'
export * from './alert-dialog'
export * from './progress'
export * from './toast'
export * from './toaster'
export * from './sonner'

// Forms
export * from './input'
export * from './input-otp'
export * from './textarea'
export * from './checkbox'
export * from './radio-group'
export * from './select'
export * from './form'
export * from './label'
export * from './calendar'

// Navigation
export * from './tabs'
export * from './breadcrumb'
export * from './navigation-menu'
export * from './menubar'
export * from './pagination'
export * from './sidebar'
export * from './dropdown-menu'
export * from './context-menu'
export * from './command'

// Overlays
export * from './dialog'
export * from './sheet'
export * from './drawer'
export * from './popover'
export * from './tooltip'
export * from './hover-card'
export * from './collapsible'
export * from './accordion'
export * from './carousel'
export * from './resizable'
