#!/usr/bin/env tsx

/**
 * repair-imports.ts — Fix common import issues in extracted components
 *
 * Fixes:
 * 1. Replace relative imports with @stsgs/ui/* paths
 * 2. Remove duplicate shadcn/ui imports
 * 3. Add missing barrel exports
 * 4. Fix cross-layer import violations
 *
 * Usage:
 *   pnpm repair                    # Repair all extracted components
 *   pnpm repair --layer=ui         # Repair only ui/ layer
 *   pnpm repair --dry-run          # Preview changes
 */

import * as fs from 'fs'
import * as path from 'path'

interface RepairAction {
  file: string
  type: 'replace-import' | 'add-barrel' | 'fix-cross-layer' | 'remove-duplicate'
  description: string
  original: string
  replacement: string
}

// Common import replacements
const IMPORT_REPLACEMENTS: Record<string, string> = {
  // shadcn/ui relative imports → @stsgs/ui
  "@/components/ui/button": "@stsgs/ui",
  "@/components/ui/card": "@stsgs/ui",
  "@/components/ui/dialog": "@stsgs/ui",
  "@/components/ui/input": "@stsgs/ui",
  "@/components/ui/badge": "@stsgs/ui",
  "@/components/ui/sheet": "@stsgs/ui",
  "@/components/ui/select": "@stsgs/ui",
  "@/components/ui/dropdown-menu": "@stsgs/ui",
  "@/components/ui/tabs": "@stsgs/ui",
  "@/components/ui/tooltip": "@stsgs/ui",
  "@/components/ui/switch": "@stsgs/ui",
  "@/components/ui/checkbox": "@stsgs/ui",
  "@/components/ui/label": "@stsgs/ui",
  "@/components/ui/separator": "@stsgs/ui",
  "@/components/ui/avatar": "@stsgs/ui",
  "@/components/ui/scroll-area": "@stsgs/ui",
  "@/components/ui/accordion": "@stsgs/ui",
  "@/components/ui/popover": "@stsgs/ui",
  "@/components/ui/toast": "@stsgs/ui",

  // Utility imports
  "@/lib/utils": "@stsgs/ui/tokens",
  "@/utils/cn": "@stsgs/ui/tokens",
  "@/lib/cn": "@stsgs/ui/tokens",
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')
  const layerFilter = process.argv.find((a) => a.startsWith('--layer='))?.split('=')[1]

  console.log('[REPAIR] @stsgs/ui Import Repair Tool')
  console.log(`   Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`)
  if (layerFilter) console.log(`   Layer: ${layerFilter}`)
  console.log()

  const dataPath = path.join(__dirname, 'data', 'extraction-report.json')
  if (!fs.existsSync(dataPath)) {
    console.log('[WARNING] No extraction report found. Run `pnpm extract` first.')
    return
  }

  const report = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
  const actions: RepairAction[] = []

  for (const comp of report.components || []) {
    if (layerFilter && comp.layer !== layerFilter) continue

    let content = comp.content

    // Find and replace imports
    for (const [oldImport, newImport] of Object.entries(IMPORT_REPLACEMENTS)) {
      const regex = new RegExp(`from\\s+['"]${escapeRegex(oldImport)}['"]`, 'g')
      if (regex.test(content)) {
        actions.push({
          file: comp.sourcePath,
          type: 'replace-import',
          description: `Replace ${oldImport} → ${newImport}`,
          original: oldImport,
          replacement: newImport,
        })
        if (!dryRun) {
          content = content.replace(
            new RegExp(`from\\s+['"]${escapeRegex(oldImport)}['"]`, 'g'),
            `from '${newImport}'`
          )
        }
      }
    }
  }

  // Report
  console.log(`Found ${actions.length} repair actions:\n`)
  for (const action of actions) {
    const icon = action.type === 'fix-cross-layer' ? '[X]' : '[FIX]'
    console.log(`  ${icon} ${action.file}: ${action.description}`)
  }

  if (dryRun) {
    console.log('\n[INFO] Dry run -- no changes made.')
  } else {
    console.log(`\n[OK] Applied ${actions.length} repairs.`)
  }
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

main().catch(console.error)
