// Data accessor — anti-monolith Rule 3 (no data fetching in components)
import type { LayoutRecipe } from '@/lib/layout/types'
import recipesData from '@/data/recipes.json'

export const recipes = recipesData as LayoutRecipe[]
