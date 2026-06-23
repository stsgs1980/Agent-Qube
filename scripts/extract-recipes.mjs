import { readFileSync, writeFileSync, mkdirSync } from 'fs'

const file = readFileSync('/home/z/my-project/stsgs/packages/ui/src/tokens/layout-registry.ts', 'utf-8')

const recipeRegex = /const (\w+):\s*LayoutRecipe\s*=\s*(\{[\s\S]*?\n\})\n/g

const recipes = []
let match
while ((match = recipeRegex.exec(file)) !== null) {
  const varName = match[1]
  const objStr = match[2]
  try {
    const fn = new Function(`return ${objStr}`)
    const recipe = fn()
    recipes.push(recipe)
  } catch (e) {
    console.error(`Failed to parse ${varName}:`, e.message)
  }
}

mkdirSync('/home/z/my-project/src/data', { recursive: true })
writeFileSync('/home/z/my-project/src/data/recipes.json', JSON.stringify(recipes, null, 2))
console.log(`Extracted ${recipes.length} recipes`)
