'use client'

import {
  createContext,
  useContext,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useMemo,
} from 'react'
import { cn } from '../../tokens/cn'
import type { LayoutStructure, GutterSize, BreakpointName } from '../../tokens/types'
import type { LayoutRecipe, GridTemplate } from '../../tokens/types'
import { getLayoutRecipe } from '../../tokens/layout-registry'
import { useLayoutContext as useProviderContext } from '../../providers/layout-provider'

// ─── Types ────────────────────────────────────────────────────

export interface LayoutProps extends HTMLAttributes<HTMLDivElement> {
  /** Which layout structure to use (default: 'top-nav') */
  structure?: LayoutStructure
  /** Override the recipe's gap (default: from recipe) */
  gap?: GutterSize
  /** Override min-height (default: from recipe, usually '100vh') */
  minHeight?: string
  /** Force a specific breakpoint for rendering (for SSR/testing) */
  forceBreakpoint?: BreakpointName | 'base'
  /** Custom recipe (overrides structure lookup) */
  recipe?: LayoutRecipe
}

export interface LayoutSlotProps extends HTMLAttributes<HTMLDivElement> {
  /** Which named region this slot fills */
  name: string
  /** Slot content */
  children: ReactNode
}

// ─── Context ──────────────────────────────────────────────────

interface LayoutContextValue {
  recipe: LayoutRecipe
  breakpoint: BreakpointName | 'base'
}

const LayoutContext = createContext<LayoutContextValue | null>(null)

function useLayoutContext(): LayoutContextValue {
  const ctx = useContext(LayoutContext)
  if (!ctx) {
    throw new Error('Layout.Slot must be used inside a <Layout> component')
  }
  return ctx
}

// ─── Helpers ──────────────────────────────────────────────────

const gapRemMap: Record<GutterSize, string> = {
  none: '0rem',
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
}

/** Determine which grid template to use based on current breakpoint */
function resolveGridTemplate(
  recipe: LayoutRecipe,
  breakpoint: BreakpointName | 'base'
): GridTemplate {
  if (breakpoint === 'base' || breakpoint === 'sm') {
    return recipe.gridTemplateMobile ?? recipe.gridTemplate
  }
  if (breakpoint === 'md') {
    return recipe.gridTemplateTablet ?? recipe.gridTemplate
  }
  return recipe.gridTemplate
}

/** Build CSS style object from a GridTemplate */
function gridTemplateToStyle(
  template: GridTemplate,
  gap: GutterSize
): React.CSSProperties {
  const style: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: template.columns,
    gap: gapRemMap[gap],
  }

  if (template.rows) {
    style.gridTemplateRows = template.rows
  }

  if (template.areas && template.areas.length > 0) {
    style.gridTemplateAreas = template.areas.map((area) => `"${area}"`).join(' ')
  }

  return style
}

/** Map of named slots to their grid-area names */
function getSlotAreaMap(recipe: LayoutRecipe, breakpoint: BreakpointName | 'base'): Record<string, string> {
  const template = resolveGridTemplate(recipe, breakpoint)
  const map: Record<string, string> = {}

  if (template.areas) {
    for (const row of template.areas) {
      for (const name of row.split(/\s+/)) {
        if (name && name !== '.') {
          map[name] = name
        }
      }
    }
  }

  return map
}

// ─── Auto-responsive breakpoint resolution ──────────────────
//
// Layout reads breakpoint from LayoutProvider (Layer 6) when available.
// This avoids Layer 2 → Layer 5 dependency (Layout → useBreakpoint).
// Without LayoutProvider, falls back to desktop template (SSR-safe).
//
// Priority: forceBreakpoint prop > LayoutProvider context > 'lg' default

// ─── Layout Component ─────────────────────────────────────────

/**
 * Layout -- context-aware layout component with named grid areas.
 *
 * Given a structure name from the registry, renders the corresponding
 * CSS Grid layout with named slots. Children use <Layout.Slot name="...">
 * to place themselves in the correct grid area.
 *
 * The component reads the layout recipe from the registry, selects
 * the appropriate grid template for the current breakpoint, and
 * renders the CSS Grid with grid-template-areas.
 *
 * @example
 * ```tsx
 * <Layout structure="holy-grail">
 *   <Layout.Slot name="header"><Header /></Layout.Slot>
 *   <Layout.Slot name="sidebar"><Sidebar /></Layout.Slot>
 *   <Layout.Slot name="main"><Content /></Layout.Slot>
 *   <Layout.Slot name="footer"><Footer /></Layout.Slot>
 * </Layout>
 *
 * <Layout structure="sidebar-left">
 *   <Layout.Slot name="sidebar"><Nav /></Layout.Slot>
 *   <Layout.Slot name="main"><Dashboard /></Layout.Slot>
 * </Layout>
 *
 * <Layout structure="golden-ratio-grid">
 *   <Layout.Slot name="minor"><Intro /></Layout.Slot>
 *   <Layout.Slot name="major"><Details /></Layout.Slot>
 * </Layout>
 * ```
 */
export const Layout = Object.assign(
  forwardRef<HTMLDivElement, LayoutProps>(
    ({ structure = 'top-nav', gap: gapOverride, minHeight: minHeightOverride, forceBreakpoint, recipe: recipeOverride, className, style, children, ...props }, ref) => {
      const recipe = recipeOverride ?? getLayoutRecipe(structure)
      const gap = gapOverride ?? recipe.gap
      const minHeight = minHeightOverride ?? recipe.minHeight

      // Resolve breakpoint: prop override > LayoutProvider context > desktop default
      // LayoutProvider reads useBreakpoint (Layer 5→6) so Layout (Layer 2)
      // doesn't need to import hooks directly (which would violate layers).
      const providerCtx = useProviderContext()
      const breakpoint = forceBreakpoint ?? providerCtx.breakpoint

      const gridTemplate = resolveGridTemplate(recipe, breakpoint)
      const gridStyle = gridTemplateToStyle(gridTemplate, gap)

      const contextValue = useMemo(
        () => ({ recipe, breakpoint }),
        [recipe, breakpoint]
      )

      return (
        <LayoutContext.Provider value={contextValue}>
          <div
            ref={ref}
            className={cn(className)}
            style={{
              ...gridStyle,
              ...(minHeight ? { minHeight } : {}),
              ...style,
            }}
            {...props}
          >
            {children}
          </div>
        </LayoutContext.Provider>
      )
    }
  ),
  {
    displayName: 'Layout',
    Slot: Slot,
  }
)

// ─── Layout.Slot Component ────────────────────────────────────

/**
 * Layout.Slot -- named region within a Layout.
 *
 * Places its children in the grid area matching the given name.
 * The name must correspond to a region defined in the layout recipe.
 *
 * If a recipe has no grid-template-areas (e.g. cards-grid),
 * the slot name is used as a CSS class instead.
 */
function Slot({ name, className, style, children, ...props }: LayoutSlotProps) {
  const { recipe, breakpoint } = useLayoutContext()
  const areaMap = getSlotAreaMap(recipe, breakpoint)

  const isNamedArea = name in areaMap

  return (
    <div
      className={cn(className)}
      style={{
        ...(isNamedArea ? { gridArea: name } : {}),
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

Slot.displayName = 'Layout.Slot'
