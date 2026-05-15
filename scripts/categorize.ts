#!/usr/bin/env tsx

/**
 * categorize.ts — Categorize extracted components into layers and tags
 *
 * Assigns:
 * - Layer (tokens/ui/sections/features/hooks/providers)
 * - Tags (animation, dark-mode, charts, lucide, forms, overlays, layout, navigation, data-display)
 * - Collection membership (dashboard-kit, auth-pages, landing-page, chat-ui)
 *
 * Usage:
 *   pnpm categorize               # Categorize all extracted components
 *   pnpm categorize --assign      # Write categorization back to report
 */

import * as fs from 'fs'
import * as path from 'path'

interface CategoryRule {
  pattern: RegExp
  layer: string
  tags: string[]
  collection?: string
}

const CATEGORY_RULES: CategoryRule[] = [
  // UI base components
  { pattern: /^(Button|Badge|Card|Input|Textarea|Checkbox|Switch|Label|Separator)$/, layer: 'ui', tags: ['forms'] },
  { pattern: /^(Dialog|Sheet|Popover|Tooltip|Dropdown|Select)$/, layer: 'ui', tags: ['overlays'] },
  { pattern: /^(Tabs|Accordion|NavigationMenu)$/, layer: 'ui', tags: ['navigation'] },
  { pattern: /^(Avatar|ScrollArea|Skeleton|Progress)$/, layer: 'ui', tags: ['data-display'] },
  { pattern: /^(Toast|Alert|Command)$/, layer: 'ui', tags: ['overlays'] },
  { pattern: /^(Table|DataTable)$/, layer: 'ui', tags: ['data-display'] },

  // Sections
  { pattern: /Section$/, layer: 'sections', tags: ['layout'] },
  { pattern: /^(Navbar|Footer|Sidebar|Header)$/, layer: 'sections', tags: ['navigation', 'layout'] },
  { pattern: /^(Hero|CTA|Pricing|Features|FAQ|Testimonials|Stats)$/, layer: 'sections', tags: ['landing'] },

  // Features
  { pattern: /Panel|Canvas|Palette|Grid$/, layer: 'features', tags: ['interactive'] },
  { pattern: /Form|Auth|Login|Signup/, layer: 'features', tags: ['forms'], collection: 'auth-pages' },
  { pattern: /Theme|Toggle|Mode/, layer: 'features', tags: ['dark-mode'] },
  { pattern: /Chart|Graph/, layer: 'features', tags: ['charts'] },

  // Hooks
  { pattern: /^use/, layer: 'hooks', tags: [] },

  // Providers
  { pattern: /Provider|Boundary|Context$/, layer: 'providers', tags: [] },
]

const TAG_DETECTION: Record<string, RegExp> = {
  animation: /framer-motion|animate|transition|motion\./,
  'dark-mode': /darkMode|dark-mode|theme.*toggle|useTheme/,
  charts: /recharts|chart|Chart|Graph|d3-/,
  lucide: /lucide-react|from 'lucide/,
  forms: /react-hook-form|zod|formData|onSubmit|input.*type/,
  overlays: /Dialog|Modal|Sheet|Popover|Drawer/,
  layout: /grid|flex|layout|container|section/i,
  navigation: /nav|menu|breadcrumb|sidebar|tabs/i,
  'data-display': /table|list|card|avatar|badge|tooltip/i,
}

async function main() {
  const assign = process.argv.includes('--assign')

  console.log('[TAG] @stsgs/ui Component Categorizer\n')

  const dataPath = path.join(__dirname, 'data', 'extraction-report.json')
  if (!fs.existsSync(dataPath)) {
    console.log('[WARNING] No extraction report found. Run `pnpm extract` first.')
    return
  }

  const report = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  let categorized = 0

  for (const comp of report.components || []) {
    // Apply category rules
    for (const rule of CATEGORY_RULES) {
      if (rule.pattern.test(comp.name)) {
        comp.layer = rule.layer
        comp.tags = [...new Set([...comp.tags, ...rule.tags])]
        if (rule.collection) {
          comp.collection = rule.collection
        }
        categorized++
        break
      }
    }

    // Detect tags from content
    if (comp.content) {
      for (const [tag, regex] of Object.entries(TAG_DETECTION)) {
        if (regex.test(comp.content)) {
          comp.tags = [...new Set([...comp.tags, tag])]
        }
      }
    }
  }

  // Stats
  const byLayer: Record<string, number> = {}
  const byTag: Record<string, number> = {}

  for (const comp of report.components || []) {
    byLayer[comp.layer] = (byLayer[comp.layer] || 0) + 1
    for (const tag of comp.tags || []) {
      byTag[tag] = (byTag[tag] || 0) + 1
    }
  }

  console.log('  By Layer:')
  for (const [layer, count] of Object.entries(byLayer)) {
    console.log(`    ${layer}: ${count}`)
  }

  console.log('\n  By Tag:')
  for (const [tag, count] of Object.entries(byTag).sort((a, b) => b[1] - a[1])) {
    console.log(`    ${tag}: ${count}`)
  }

  console.log(`\n  Categorized: ${categorized} components`)

  if (assign) {
    fs.writeFileSync(dataPath, JSON.stringify(report, null, 2))
    console.log('  [OK] Written back to extraction-report.json')
  } else {
    console.log('  [INFO] Dry run -- use --assign to write changes')
  }
}

main().catch(console.error)
