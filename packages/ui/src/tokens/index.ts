// Layer 1: Design Tokens
// No React, no logic -- pure CSS variables and JS constants

export { cn } from './cn'
export { tokens } from './tokens'
export type {
  DesignTokens,
  LayoutTokens,
  ContainerSize,
  SidebarVariant,
  GutterSize,
  BreakpointName,
  LayoutStructure,
  ProjectGoal,
  LayoutCategory,
  LayoutRegion,
  GridTemplate,
  LayoutRecipe,
  LayoutAdvice,
  LayoutAdviceInput,
} from './types'

export {
  layoutRegistry,
  getLayoutRecipe,
  getAllLayoutRecipes,
  getLayoutsByCategory,
  getLayoutsForGoal,
} from './layout-registry'
