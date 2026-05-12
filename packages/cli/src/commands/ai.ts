/**
 * stsgs ai init / stsgs ai sync — Generate and sync AI rules across platforms
 *
 * Reads ai-rules/core.md and generates platform-specific config files:
 * - .cursorrules      (Cursor)
 * - CLAUDE.md         (Claude Code)
 * - ZAI.md            (Z.ai)
 * - .zcode/rules.md   (Zcode.z.ai)
 * - .github/copilot-instructions.md  (GitHub Copilot)
 * - .windsurfrules    (Windsurf)
 */

import type { Command } from 'commander'
import * as fs from 'fs'
import * as path from 'path'

const PLATFORMS = [
  { id: 'cursor', file: '.cursorrules', format: 'raw' },
  { id: 'claude', file: 'CLAUDE.md', format: 'markdown' },
  { id: 'zai', file: 'ZAI.md', format: 'markdown' },
  { id: 'zcode', file: '.zcode/rules.md', format: 'markdown' },
  { id: 'copilot', file: '.github/copilot-instructions.md', format: 'markdown' },
  { id: 'windsurf', file: '.windsurfrules', format: 'raw' },
] as const

type PlatformId = (typeof PLATFORMS)[number]['id']

export async function aiCommand(
  options: { platforms?: string },
  cmd?: any
) {
  const { default: chalk } = await import('chalk')
  const { default: ora } = await import('ora')

  const commandName = cmd?.name() || 'init'
  const isSync = commandName === 'sync'

  const projectRoot = findProjectRoot()
  if (!projectRoot) {
    console.error(chalk.red('Not in an @stsgs/ui project. Run this from the project root.'))
    return
  }

  const corePath = path.join(projectRoot, 'ai-rules', 'core.md')
  if (!fs.existsSync(corePath)) {
    console.error(chalk.red('ai-rules/core.md not found. Create it first.'))
    return
  }

  const coreContent = fs.readFileSync(corePath, 'utf-8')
  const spinner = ora(
    isSync ? 'Syncing AI rules across all platforms...' : 'Generating AI rules...'
  ).start()

  // Determine which platforms to generate
  let targetPlatforms = PLATFORMS
  if (options.platforms) {
    const selected = options.platforms.split(',').map((p) => p.trim()) as PlatformId[]
    targetPlatforms = PLATFORMS.filter((p) => selected.includes(p.id))
  }

  let synced = 0

  for (const platform of targetPlatforms) {
    const content = generatePlatformContent(platform, coreContent)
    const filePath = path.join(projectRoot, platform.file)

    // Ensure directory exists
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    fs.writeFileSync(filePath, content, 'utf-8')
    synced++
    spinner.text = `Synced ${platform.file}`
  }

  spinner.succeed(chalk.green(`AI rules synced to ${synced} platform(s)`))

  // Summary
  console.log(chalk.dim('\n  Source: ai-rules/core.md'))
  for (const platform of targetPlatforms) {
    console.log(`  ${chalk.cyan('→')} ${platform.file} (${platform.id})`)
  }
  console.log(chalk.dim('\n  Run `stsgs ai sync` after updating core.md\n'))
}

function generatePlatformContent(
  platform: (typeof PLATFORMS)[number],
  coreContent: string
): string {
  const header =
    platform.format === 'markdown'
      ? `# ${platform.file} — Rules for ${platform.id === 'zcode' ? 'Zcode' : platform.id === 'zai' ? 'Z.ai' : platform.id === 'claude' ? 'Claude Code' : platform.id === 'copilot' ? 'GitHub Copilot' : platform.id}\n\n> Auto-generated from ai-rules/core.md by \`npx stsgs ai sync\`\n\n`
      : `# ${platform.id} AI Rules — @stsgs/ui Project\n\n# Auto-generated from ai-rules/core.md by \`npx stsgs ai sync\`\n\n`

  // Strip the first H1 title from core content (we add our own header)
  const body = coreContent.replace(/^#\s+.+\n/, '').trim()

  return header + body + '\n'
}

function findProjectRoot(): string | null {
  let dir = process.cwd()
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, 'package.json'))) {
      return dir
    }
    dir = path.dirname(dir)
  }
  return null
}
