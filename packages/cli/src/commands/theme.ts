/**
 * stsgs theme — Theme/preset management and recommendation
 *
 * Usage:
 *   stsgs theme list              List all available themes
 *   stsgs theme recommend <goal>  Recommend a theme for a project goal
 *   stsgs theme show <name>       Show detailed theme info
 *   stsgs theme css <name>        Output theme as CSS custom properties
 */

import type { Command } from 'commander'

interface ThemePreset {
  id: string; name: string; mode: 'dark' | 'light'; accent: string
  fontDisplay: string; fontMono: string; cornerRadius: number
  mood: string; bestFor: string[]; description: string; pair: string
  colors: { bg: string; surface: string; text: string; textMuted: string; border: string }
}

const PRESETS: ThemePreset[] = [
  { id: 'champagne', name: 'Champagne', mode: 'dark', accent: '#C8A97E',
    fontDisplay: 'Playfair Display', fontMono: 'JetBrains Mono', cornerRadius: 2,
    mood: 'professional', bestFor: ['saas', 'fintech', 'portfolio', 'landing'],
    description: 'Premium gold + Playfair serif', pair: 'champagne-light',
    colors: { bg: '#0B0B0F', surface: '#1A1A24', text: '#F5F0E8', textMuted: '#8A8278', border: '#2A2A34' } },
  { id: 'cyan-night', name: 'Cyan Night', mode: 'dark', accent: '#00E5FF',
    fontDisplay: 'Playfair Display', fontMono: 'JetBrains Mono', cornerRadius: 2,
    mood: 'cool', bestFor: ['dashboard', 'documentation', 'analytics', 'saas'],
    description: 'Cyan + sharp edges + tech', pair: 'cyan-morning',
    colors: { bg: '#080810', surface: '#161B2E', text: '#FFFFFF', textMuted: '#94A3B8', border: '#1E2540' } },
  { id: 'zinc', name: 'Zinc', mode: 'dark', accent: '#10B981',
    fontDisplay: 'Inter', fontMono: 'SF Mono', cornerRadius: 12,
    mood: 'minimal', bestFor: ['crm', 'admin-panel', 'analytics', 'application'],
    description: 'Monochrome + emerald + amber', pair: 'cyan-morning',
    colors: { bg: '#0A0A0F', surface: '#16161A', text: '#FAFAFA', textMuted: '#83838C', border: '#27272A' } },
  { id: 'ember', name: 'Ember', mode: 'dark', accent: '#FF6B35',
    fontDisplay: 'Inter', fontMono: 'JetBrains Mono', cornerRadius: 8,
    mood: 'creative', bestFor: ['ecommerce', 'landing', 'portfolio', 'social'],
    description: 'Coral warmth + rounded + creative', pair: 'sand-light',
    colors: { bg: '#0F0B08', surface: '#1E1810', text: '#F5EDE5', textMuted: '#8A7E72', border: '#2E2618' } },
  { id: 'champagne-light', name: 'Champagne Light', mode: 'light', accent: '#B08D57',
    fontDisplay: 'Playfair Display', fontMono: 'JetBrains Mono', cornerRadius: 2,
    mood: 'professional', bestFor: ['blog', 'portfolio', 'editorial', 'landing'],
    description: 'Warm cream + gold + Playfair', pair: 'champagne',
    colors: { bg: '#FAF8F5', surface: '#F5F0E8', text: '#1A1814', textMuted: '#7A7164', border: '#D4C9B8' } },
  { id: 'cyan-morning', name: 'Cyan Morning', mode: 'light', accent: '#0891B2',
    fontDisplay: 'Inter', fontMono: 'JetBrains Mono', cornerRadius: 2,
    mood: 'cool', bestFor: ['documentation', 'saas', 'dashboard', 'analytics'],
    description: 'Cool white + cyan + sharp', pair: 'cyan-night',
    colors: { bg: '#F0F9FF', surface: '#E0F2FE', text: '#0C1222', textMuted: '#5F6D80', border: '#BAE6FD' } },
  { id: 'sand-light', name: 'Sand Light', mode: 'light', accent: '#C4551A',
    fontDisplay: 'Inter', fontMono: 'JetBrains Mono', cornerRadius: 8,
    mood: 'warm', bestFor: ['ecommerce', 'blog', 'landing', 'social'],
    description: 'Warm sand + burnt orange + rounded', pair: 'ember',
    colors: { bg: '#FBF7F0', surface: '#F0E8DA', text: '#1A1410', textMuted: '#7A6E5E', border: '#D4C9B0' } },
]

const GOAL_MOOD: Record<string, string> = {
  dashboard: 'professional', 'admin-panel': 'professional', crm: 'professional', analytics: 'professional',
  landing: 'creative', saas: 'creative', portfolio: 'creative',
  ecommerce: 'warm', blog: 'warm',
  documentation: 'cool', media: 'cool',
  social: 'minimal',
}

const ACCENT_NAMES: Record<string, string> = {
  champagne: 'Gold', 'cyan-night': 'Cyan', zinc: 'Emerald', ember: 'Coral',
  'champagne-light': 'Gold', 'cyan-morning': 'Cyan', 'sand-light': 'Orange',
}

async function listThemes(options: { mode?: string }) {
  const { default: chalk } = await import('chalk')
  const filtered = options.mode ? PRESETS.filter((p) => p.mode === options.mode) : PRESETS
  console.log(chalk.bold('\n  @stsgs/ui Theme Presets\n'))
  for (const mode of ['dark', 'light'] as const) {
    const group = filtered.filter((p) => p.mode === mode)
    if (!group.length) continue
    console.log(chalk.bold(`  ${mode.toUpperCase()}:`))
    for (const p of group) {
      const hex = p.accent.replace('#', '').toUpperCase().slice(0, 6)
      const mood = p.mood.charAt(0).toUpperCase() + p.mood.slice(1)
      console.log(`    ${chalk.cyan(p.id.padEnd(16))}${ACCENT_NAMES[p.id]} ${chalk.hex(p.accent)(`#${hex}`)}   ${mood.padEnd(12)}${p.fontDisplay}`)
    }
    console.log()
  }
}

async function recommendTheme(goal: string, options: { mode?: string }) {
  const { default: chalk } = await import('chalk')
  const targetMood = GOAL_MOOD[goal.toLowerCase()]
  if (!targetMood) {
    console.log(chalk.yellow(`  Unknown goal "${goal}". Try: ${Object.keys(GOAL_MOOD).join(', ')}`))
    return
  }
  const scored = PRESETS
    .filter((p) => !options.mode || p.mode === options.mode)
    .map((p) => {
      let s = 0
      if (p.mood === targetMood) s += 30
      if (options.mode && p.mode === options.mode) s += 20
      if (p.bestFor.includes(goal.toLowerCase())) s += 15
      if (PRESETS.some((q) => q.id === p.pair)) s += 10
      return { p, s }
    }).sort((a, b) => b.s - a.s)

  console.log(chalk.bold(`\n  Recommendations for "${goal}"${options.mode ? ` (${options.mode})` : ''}:\n`))
  for (const { p, s } of scored) {
    const bar = chalk.hex(p.accent)('='.repeat(Math.round(s / 5)))
    console.log(`  ${chalk.bold(p.name.padEnd(18))} ${bar} ${s}`)
    console.log(`    ${chalk.dim(p.description)} | Pair: ${p.pair}`)
  }
  console.log()
}

async function showTheme(name: string) {
  const { default: chalk } = await import('chalk')
  const p = PRESETS.find((t) => t.id === name)
  if (!p) {
    console.log(chalk.red(`  Theme "${name}" not found. Available: ${PRESETS.map((t) => t.id).join(', ')}`))
    return
  }
  console.log(chalk.bold(`\n  ${p.name} (${p.id})\n`))
  console.log(`  Mode:          ${p.mode}`)
  console.log(`  Accent:        ${chalk.hex(p.accent)(p.accent)}`)
  console.log(`  Font Display:  ${p.fontDisplay}`)
  console.log(`  Font Mono:     ${p.fontMono}`)
  console.log(`  Corner Radius: ${p.cornerRadius}px`)
  console.log(`  Mood:          ${p.mood}`)
  console.log(`  Best For:      ${p.bestFor.join(', ')}`)
  console.log(`  Pair:          ${p.pair}`)
  console.log(`  Description:   ${p.description}`)
  console.log(chalk.dim('\n  Colors:'))
  for (const [k, v] of Object.entries(p.colors))
    console.log(`    ${k.padEnd(12)} ${chalk.hex(v.startsWith('#') ? v : '#888')(v)}`)
  console.log()
}

async function outputCSS(name: string, options: { prefix?: string }) {
  const p = PRESETS.find((t) => t.id === name)
  if (!p) {
    const { default: chalk } = await import('chalk')
    console.log(chalk.red(`  Theme "${name}" not found. Available: ${PRESETS.map((t) => t.id).join(', ')}`))
    return
  }
  const px = options.prefix || '--stsgs'
  console.log(`:root[data-theme="${p.id}"] {`)
  console.log(`  ${px}-bg: ${p.colors.bg};`)
  console.log(`  ${px}-surface: ${p.colors.surface};`)
  console.log(`  ${px}-text: ${p.colors.text};`)
  console.log(`  ${px}-text-muted: ${p.colors.textMuted};`)
  console.log(`  ${px}-border: ${p.colors.border};`)
  console.log(`  ${px}-accent: ${p.accent};`)
  console.log(`  ${px}-radius: ${p.cornerRadius}px;`)
  console.log(`  ${px}-font-display: '${p.fontDisplay}', serif;`)
  console.log(`  ${px}-font-mono: '${p.fontMono}', monospace;`)
  console.log('}')
}

export function themeCommand(program: Command) {
  const cmd = program.command('theme').description('Theme/preset management and recommendation')
  cmd.command('list').description('List all available themes').option('--mode <mode>', 'Filter by mode (dark|light)').action(listThemes)
  cmd.command('recommend').description('Recommend a theme for a project goal').argument('<goal>', 'Project goal (landing, dashboard, ecommerce, etc.)').option('--mode <mode>', 'Preferred mode (dark|light)').action(recommendTheme)
  cmd.command('show').description('Show detailed theme information').argument('<name>', 'Theme name (champagne, cyan-night, zinc, ember, etc.)').action(showTheme)
  cmd.command('css').description('Output theme as CSS custom properties').argument('<name>', 'Theme name').option('--prefix <prefix>', 'CSS variable prefix', '--stsgs').action(outputCSS)
}
