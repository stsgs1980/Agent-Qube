import { LayoutThemeProvider } from '@/lib/layout/theme'
import { ProjectThemeProvider } from '@/lib/layout/project-theme'
import { AppContent } from '@/components/layout/variant-tabs'
import type { LayoutRecipe } from '@/lib/layout/types'
import recipesData from '@/data/recipes.json'

const recipes = recipesData as LayoutRecipe[]

export default function Home() {
  return (
    <LayoutThemeProvider>
      <ProjectThemeProvider>
        <AppContent recipes={recipes} />
      </ProjectThemeProvider>
    </LayoutThemeProvider>
  )
}
