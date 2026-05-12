#!/usr/bin/env tsx

/**
 * extract-components.ts — Scan GitHub repos and extract components for @stsgs/ui
 *
 * Phase A: Data preparation script
 *
 * Usage:
 *   pnpm extract              # Scan all repos
 *   pnpm extract --repo=name  # Scan specific repo
 *   pnpm extract --dry-run    # Preview without writing
 *
 * Reads from: GitHub API (stsgs org)
 * Writes to:  scripts/data/extracted-components.json
 */

import * as fs from 'fs'
import * as path from 'path'

interface ExtractedComponent {
  name: string
  sourceRepo: string
  sourcePath: string
  layer: 'tokens' | 'ui' | 'sections' | 'features' | 'hooks' | 'providers'
  category: string
  tags: string[]
  linesCount: number
  hasPropsInterface: boolean
  hasJSDoc: boolean
  hasBarrelExport: boolean
  useStateCount: number
  hasDataFetching: boolean
  quality: 'clean' | 'needs-props' | 'needs-import-fix' | 'broken'
  content: string
}

interface ExtractionReport {
  timestamp: string
  totalRepos: number
  totalComponents: number
  byLayer: Record<string, number>
  byQuality: Record<string, number>
  duplicatesFound: { name: string; count: number; repos: string[] }[]
  components: ExtractedComponent[]
}

// Layer detection heuristics
const LAYER_INDICATORS: Record<string, string[]> = {
  tokens: ['tokens/', 'theme/', 'colors/', 'design-tokens/'],
  ui: ['ui/', 'components/ui/', 'shadcn/', 'primitives/'],
  sections: ['sections/', 'blocks/', 'layouts/'],
  features: ['features/', 'widgets/', 'containers/'],
  hooks: ['hooks/', 'use-'],
  providers: ['providers/', 'context/', 'contexts/'],
}

function detectLayer(filePath: string, content: string): ExtractedComponent['layer'] {
  const normalized = filePath.replace(/\\/g, '/')

  for (const [layer, indicators] of Object.entries(LAYER_INDICATORS)) {
    for (const indicator of indicators) {
      if (normalized.includes(indicator)) {
        return layer as ExtractedComponent['layer']
      }
    }
  }

  // Content-based heuristics
  if (filePath.startsWith('use') && !filePath.endsWith('.tsx')) return 'hooks'
  if (filePath.endsWith('Provider.tsx') || filePath.endsWith('Context.tsx')) return 'providers'
  if (filePath.endsWith('Section.tsx')) return 'sections'
  if (content.includes('useState') || content.includes('useEffect')) return 'features'

  return 'ui' // default
}

function assessQuality(comp: Partial<ExtractedComponent>): ExtractedComponent['quality'] {
  if (comp.hasDataFetching) return 'broken'
  if (!comp.hasPropsInterface) return 'needs-props'
  if (comp.useStateCount && comp.useStateCount > 3) return 'needs-import-fix'
  return 'clean'
}

async function main() {
  const dryRun = process.argv.includes('--dry-run')
  const repoFilter = process.argv.find((a) => a.startsWith('--repo='))?.split('=')[1]

  console.log('[SCAN] @stsgs/ui Component Extractor')
  console.log(`   Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`)
  if (repoFilter) console.log(`   Filter: ${repoFilter}`)
  console.log()

  const dataDir = path.join(__dirname, 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  // TODO: Implementation with GitHub API
  // 1. Fetch repo list from stsgs org
  // 2. For each repo, scan for React components
  // 3. Detect layer, assess quality, find duplicates
  // 4. Write extraction report

  const report: ExtractionReport = {
    timestamp: new Date().toISOString(),
    totalRepos: 0,
    totalComponents: 0,
    byLayer: { tokens: 0, ui: 0, sections: 0, features: 0, hooks: 0, providers: 0 },
    byQuality: { clean: 0, 'needs-props': 0, 'needs-import-fix': 0, broken: 0 },
    duplicatesFound: [],
    components: [],
  }

  const reportPath = path.join(dataDir, 'extraction-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  console.log(`\n[SAVED] Report saved: ${reportPath}`)
  console.log('   Run with GitHub PAT to scan actual repos.')
}

main().catch(console.error)
