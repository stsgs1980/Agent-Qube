#!/usr/bin/env tsx

/**
 * generate-ai-rules.ts — Generate platform-specific AI rule files from core.md
 *
 * Reads:  ai-rules/core.md (+ library.md, enforcement.md, project.md)
 * Writes: .cursorrules, CLAUDE.md, ZAI.md, .zcode/rules.md,
 *         .github/copilot-instructions.md, .windsurfrules
 *
 * Usage:
 *   pnpm ai:generate             # Generate all platform configs
 *   pnpm ai:init                 # Generate + show instructions
 *   pnpm ai:sync                 # Regenerate all (same as generate)
 */

import * as fs from 'fs'
import * as path from 'path'

const PROJECT_ROOT = path.resolve(__dirname, '..')
const AI_RULES_DIR = path.join(PROJECT_ROOT, 'ai-rules')

const PLATFORMS = [
  { id: 'cursor', file: '.cursorrules', format: 'raw' as const },
  { id: 'claude', file: 'CLAUDE.md', format: 'markdown' as const },
  { id: 'zai', file: 'ZAI.md', format: 'markdown' as const },
  { id: 'zcode', file: '.zcode/rules.md', format: 'markdown' as const },
  { id: 'copilot', file: '.github/copilot-instructions.md', format: 'markdown' as const },
  { id: 'windsurf', file: '.windsurfrules', format: 'raw' as const },
]

function generateContent(
  platform: (typeof PLATFORMS)[number],
  coreContent: string
): string {
  const platformNames: Record<string, string> = {
    cursor: 'Cursor',
    claude: 'Claude Code',
    zai: 'Z.ai',
    zcode: 'Zcode',
    copilot: 'GitHub Copilot',
    windsurf: 'Windsurf',
  }

  const name = platformNames[platform.id]

  if (platform.format === 'markdown') {
    return `# ${platform.file} — Rules for ${name}\n\n> Auto-generated from ai-rules/core.md by \`npx stsgs ai sync\`\n\n${coreContent}\n`
  }

  return `# ${name} AI Rules — @stsgs/ui Project\n\n# Auto-generated from ai-rules/core.md by \`npx stsgs ai sync\`\n\n${coreContent}\n`
}

async function main() {
  const isInit = process.argv.includes('--init')
  const isSync = process.argv.includes('--sync')

  console.log('[AI] AI Rules Generator\n')

  // Read core.md
  const corePath = path.join(AI_RULES_DIR, 'core.md')
  if (!fs.existsSync(corePath)) {
    console.error('[ERROR] ai-rules/core.md not found!')
    process.exit(1)
  }

  let coreContent = fs.readFileSync(corePath, 'utf-8')

  // Optionally merge library.md and enforcement.md
  for (const extra of ['library.md', 'enforcement.md']) {
    const extraPath = path.join(AI_RULES_DIR, extra)
    if (fs.existsSync(extraPath)) {
      const extraContent = fs.readFileSync(extraPath, 'utf-8')
      coreContent += '\n\n---\n\n' + extraContent
    }
  }

  // Generate each platform
  let generated = 0

  for (const platform of PLATFORMS) {
    const content = generateContent(platform, coreContent)
    const filePath = path.join(PROJECT_ROOT, platform.file)

    // Ensure directory
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    fs.writeFileSync(filePath, content, 'utf-8')
    generated++
    console.log(`  [OK] ${platform.file} (${platform.id})`)
  }

  console.log(`\n  [INFO] Generated ${generated} platform configs from ai-rules/core.md`)
  console.log('  [SYNC] Run `npx stsgs ai sync` after updating core.md\n')

  if (isInit) {
    console.log('  Next steps:')
    console.log('  1. Review and customize ai-rules/core.md')
    console.log('  2. Run `npx stsgs ai sync` to regenerate')
    console.log('  3. Commit all generated files to git\n')
  }
}

main().catch(console.error)
