// Layout -- context-aware layout system
// One component, 51 recipes (10 classic + 4 bento + 7 artistic + 14 mathematical + 2 app + 14 advanced), auto-selection by project context

export { Layout } from './layout'
export type { LayoutProps, LayoutSlotProps } from './layout'

// Re-export from correct layers (registry is in tokens/, advice is in hooks/)
export { useLayoutAdvice } from '../../hooks/use-layout-advice'
export type { LayoutRecommendation, UseLayoutAdviceResult } from '../../hooks/use-layout-advice'

export {
  layoutRegistry,
  getLayoutRecipe,
  getAllLayoutRecipes,
  getLayoutsByCategory,
  getLayoutsForGoal,
} from '../../tokens/layout-registry'
