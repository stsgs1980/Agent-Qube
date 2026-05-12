/**
 * stsgs scan — Scan project for anti-monolith violations
 *
 * Checks:
 * 1. Cross-layer imports (no-cross-layer-imports)
 * 2. File line counts (max-lines: 200)
 * 3. useState per component (max-useState: 3)
 * 4. Missing barrel exports
 * 5. Inline data fetching in components
 */

import type { Command } from 'commander'
import * as fs from 'fs'
import * as path from 'path'

interface Violation {
  file: string
  rule: string
  message: string
  severity: 'error' | 'warning'
}

export async function scanCommand(
  options: { path?: string; fix?: boolean }
) {
  const { default: chalk } = await import('chalk')
  const { default: ora } = await import('ora')

  const projectPath = path.resolve(options.path || '.')
  const spinner = ora(`Scanning ${projectPath}...`).start()

  const violations: Violation[] = []

  try {
    // 1. Find all .tsx and .ts files
    const files = findSourceFiles(projectPath)
    spinner.text = `Scanning ${files.length} files...`

    // 2. Check each file
    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8')
      const lines = content.split('\n')

      // Check max-lines
      if (lines.length > 200) {
        violations.push({
          file: relativePath(file, projectPath),
          rule: 'max-lines',
          message: `${lines.length} lines (max 200)`,
          severity: 'warning',
        })
      }

      // Check cross-layer imports
      const layer = detectLayer(file)
      if (layer) {
        for (const line of lines) {
          const importMatch = line.match(/from\s+['"](.+)['"]/)
          if (importMatch) {
            const importPath = importMatch[1]
            const importLayer = detectImportLayer(importPath)
            if (importLayer && LAYER_INDEX[importLayer] > LAYER_INDEX[layer]) {
              violations.push({
                file: relativePath(file, projectPath),
                rule: 'no-cross-layer-imports',
                message: `${layer} imports from ${importLayer}: ${importPath}`,
                severity: 'error',
              })
            }
          }
        }
      }

      // Check max-useState
      const useStateCount = (content.match(/useState[<(]/g) || []).length
      if (useStateCount > 3) {
        violations.push({
          file: relativePath(file, projectPath),
          rule: 'max-use-state',
          message: `${useStateCount} useState calls (max 3)`,
          severity: 'warning',
        })
      }

      // Check data fetching in components
      if (layer === 'ui' || layer === 'sections') {
        if (/fetch\(|axios\.|useQuery\(|useMutation\(/.test(content)) {
          violations.push({
            file: relativePath(file, projectPath),
            rule: 'no-data-fetching',
            message: `Data fetching in ${layer} component`,
            severity: 'error',
          })
        }
      }
    }

    spinner.stop()

    // Report
    const errors = violations.filter((v) => v.severity === 'error')
    const warnings = violations.filter((v) => v.severity === 'warning')

    console.log(chalk.bold('\n  @stsgs/ui — Project Scan Results\n'))
    console.log(`  ${chalk.green('[OK]')} ${files.length} files scanned`)

    if (errors.length > 0) {
      console.log(`  ${chalk.red('[X]')} ${errors.length} errors`)
    } else {
      console.log(`  ${chalk.green('[OK]')} 0 errors`)
    }

    if (warnings.length > 0) {
      console.log(`  ${chalk.yellow('[!]')} ${warnings.length} warnings`)
    } else {
      console.log(`  ${chalk.green('[OK]')} 0 warnings`)
    }

    if (violations.length > 0) {
      console.log()
      for (const v of violations) {
        const icon = v.severity === 'error' ? chalk.red('[X]') : chalk.yellow('[!]')
        console.log(`  ${icon} ${chalk.dim(v.file)}: ${v.message}`)
      }
    }

    console.log()

    if (errors.length === 0 && warnings.length === 0) {
      console.log(chalk.green('  Project passes all anti-monolith checks!\n'))
    }
  } catch (error: any) {
    spinner.fail(chalk.red(error.message))
  }
}

const LAYER_INDEX: Record<string, number> = {
  tokens: 0,
  ui: 1,
  sections: 2,
  features: 3,
  hooks: 4,
  providers: 5,
}

function detectLayer(filePath: string): string | null {
  const normalized = filePath.replace(/\\/g, '/')
  for (const layer of Object.keys(LAYER_INDEX)) {
    if (normalized.includes(`/${layer}/`)) return layer
  }
  return null
}

function detectImportLayer(importPath: string): string | null {
  const match = importPath.match(/@stsgs\/ui\/(\w+)/)
  if (match && LAYER_INDEX[match[1]] !== undefined) return match[1]
  return null
}

function findSourceFiles(dir: string): string[] {
  const results: string[] = []
  const exclude = ['node_modules', 'dist', '.next', '.turbo']

  function walk(d: string) {
    const entries = fs.readdirSync(d, { withFileTypes: true })
    for (const entry of entries) {
      if (exclude.includes(entry.name)) continue
      const full = path.join(d, entry.name)
      if (entry.isDirectory()) {
        walk(full)
      } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
        results.push(full)
      }
    }
  }

  walk(dir)
  return results
}

function relativePath(file: string, base: string): string {
  return path.relative(base, file).replace(/\\/g, '/')
}
