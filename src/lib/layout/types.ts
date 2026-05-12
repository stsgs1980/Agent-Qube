/**
 * Layout system shared types and constants.
 * Layer 1 equivalent — no React, no JSX, no state.
 */

// ─── Types ────────────────────────────────────────────────────

export interface LayoutRegion {
  name: string
  required?: boolean
  minHeight?: string
}

export interface GridTemplate {
  columns: string
  rows?: string
  areas?: string[]
}

export interface LayoutRecipe {
  structure: string
  name: string
  description: string
  category: string
  bestFor: string[]
  conflicts: string[]
  techNotes: string
  regions: LayoutRegion[]
  gridTemplate: GridTemplate
  gridTemplateTablet?: GridTemplate
  gridTemplateMobile?: GridTemplate
  gap: string
  minHeight?: string
  preview: string
}

export interface LayoutAdviceInput {
  goal: string
  contentType?: string
  itemCount?: number
  needsSidebar?: boolean
  needsHeader?: boolean
  needsFooter?: boolean
}

export interface LayoutRecommendation {
  structure: string
  recipe: LayoutRecipe
  score: number
  verdict: 'recommended' | 'warning' | 'error'
  reason: string
}

export interface ParsedPrompt {
  goal: string
  contentType: string
  itemCount: number
  needsSidebar: boolean
  needsHeader: boolean
  needsFooter: boolean
  detected: string[]
  goalWeights: Record<string, number>
}

// ─── Constants ────────────────────────────────────────────────

export const GOALS = [
  { value: 'landing', label: 'Landing', color: '#10b981' },
  { value: 'dashboard-app', label: 'Dashboard', color: '#f59e0b' },
  { value: 'application', label: 'Application', color: '#f43f5e' },
  { value: 'blog', label: 'Blog', color: '#0ea5e9' },
  { value: 'ecommerce', label: 'E-Commerce', color: '#ec4899' },
  { value: 'documentation', label: 'Docs', color: '#8b5cf6' },
  { value: 'portfolio', label: 'Portfolio', color: '#f97316' },
  { value: 'social', label: 'Social', color: '#06b6d4' },
  { value: 'media', label: 'Media', color: '#ef4444' },
  { value: 'saas', label: 'SaaS', color: '#6366f1' },
  { value: 'crm', label: 'CRM', color: '#14b8a6' },
  { value: 'analytics', label: 'Analytics', color: '#a855f7' },
  { value: 'admin-panel', label: 'Admin', color: '#64748b' },
] as const

export const CATEGORIES = ['classic', 'bento', 'artistic', 'mathematical', 'application', 'advanced'] as const

export const categoryMeta: Record<string, { label: string; color: string; bg: string }> = {
  classic: { label: 'Classic', color: 'text-slate-600 dark:text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' },
  bento: { label: 'Bento', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-950/40' },
  artistic: { label: 'Artistic', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/40' },
  mathematical: { label: 'Math', color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-950/40' },
  application: { label: 'App', color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-950/40' },
  advanced: { label: 'Advanced', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40' },
}

export const PROMPT_EXAMPLES = [
  'SaaS лендинг с дашбордом',
  'Create a SaaS landing page with pricing cards',
  'Build an admin dashboard with sidebar and data charts',
  'Make a blog with articles and sidebar',
  'Design a portfolio showcase with media gallery',
  'Create a login page for a SaaS product',
  'Build a CRM with contact list and detail panel',
  'Design an e-commerce product catalog with 50 items',
  'Build a documentation site with sidebar navigation',
]

export const gapRemMap: Record<string, string> = {
  none: '0rem', xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem',
}
