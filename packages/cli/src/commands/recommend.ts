/**
 * stsgs recommend — Get layout recommendations from the terminal
 *
 * Usage:
 *   stsgs recommend "admin dashboard with sidebar"
 *   stsgs recommend "SaaS landing with blog" --top 3
 *   stsgs recommend "ecommerce store" --json
 */

import type { Command } from 'commander'

interface Recipe { name: string; structure: string; category: string; bestFor: string[]; conflicts: string[]; regions: string[] }

const RECIPES: Recipe[] = [
  { name: 'Sidebar Left', structure: 'sidebar-left', category: 'classic', bestFor: ['admin-panel', 'dashboard-app', 'documentation'], conflicts: ['landing', 'portfolio'], regions: ['sidebar', 'main'] },
  { name: 'Sidebar Right', structure: 'sidebar-right', category: 'classic', bestFor: ['admin-panel', 'dashboard-app', 'documentation'], conflicts: ['landing', 'portfolio'], regions: ['main', 'sidebar'] },
  { name: 'Top Navigation', structure: 'top-nav', category: 'classic', bestFor: ['landing', 'blog', 'portfolio', 'documentation'], conflicts: ['dashboard-app'], regions: ['header', 'main', 'footer'] },
  { name: 'Two Columns', structure: 'two-columns', category: 'classic', bestFor: ['landing', 'documentation', 'portfolio'], conflicts: [], regions: ['left', 'right'] },
  { name: 'Three Columns', structure: 'three-columns', category: 'classic', bestFor: ['admin-panel', 'dashboard-app', 'documentation'], conflicts: ['landing'], regions: ['left', 'center', 'right'] },
  { name: 'Holy Grail', structure: 'holy-grail', category: 'classic', bestFor: ['documentation', 'blog', 'ecommerce'], conflicts: [], regions: ['header', 'sidebar', 'main', 'aside', 'footer'] },
  { name: 'Split Screen', structure: 'split-screen', category: 'classic', bestFor: ['landing', 'portfolio', 'ecommerce'], conflicts: ['admin-panel', 'dashboard-app'], regions: ['left', 'right'] },
  { name: 'Cards Grid', structure: 'cards-grid', category: 'classic', bestFor: ['landing', 'ecommerce', 'blog', 'portfolio'], conflicts: [], regions: ['header', 'content'] },
  { name: 'Magazine', structure: 'magazine', category: 'classic', bestFor: ['blog', 'landing', 'documentation'], conflicts: ['admin-panel', 'dashboard-app'], regions: ['hero', 'primary', 'secondary'] },
  { name: 'Fullscreen Hero', structure: 'fullscreen-hero', category: 'classic', bestFor: ['landing', 'portfolio'], conflicts: ['admin-panel', 'dashboard-app'], regions: ['content'] },
  { name: 'Dashboard', structure: 'dashboard', category: 'application', bestFor: ['dashboard-app', 'admin-panel', 'analytics', 'crm'], conflicts: ['landing', 'portfolio'], regions: ['header', 'sidebar', 'main'] },
  { name: 'Bento Grid', structure: 'bento-grid', category: 'bento', bestFor: ['dashboard-app', 'landing', 'portfolio'], conflicts: [], regions: ['hero', 'card-1', 'card-2', 'card-3', 'card-4', 'card-5'] },
  { name: 'Bento Sidebar', structure: 'bento-sidebar', category: 'bento', bestFor: ['dashboard-app', 'admin-panel'], conflicts: ['landing', 'portfolio'], regions: ['sidebar', 'hero', 'card-1', 'card-2', 'card-3'] },
  { name: 'Bento Hero', structure: 'bento-hero', category: 'bento', bestFor: ['landing', 'portfolio'], conflicts: ['admin-panel'], regions: ['hero', 'feature-1', 'feature-2', 'feature-3', 'feature-4'] },
  { name: 'Bento Masonry', structure: 'bento-masonry', category: 'bento', bestFor: ['portfolio', 'landing', 'blog'], conflicts: ['admin-panel'], regions: ['content'] },
  { name: 'Masonry Grid', structure: 'masonry-grid', category: 'artistic', bestFor: ['portfolio', 'blog', 'ecommerce', 'landing'], conflicts: ['admin-panel', 'dashboard-app'], regions: ['content'] },
  { name: 'Asymmetric Grid', structure: 'asymmetric-grid', category: 'artistic', bestFor: ['landing', 'blog', 'portfolio', 'documentation'], conflicts: [], regions: ['primary', 'secondary'] },
  { name: 'Span Grid', structure: 'span-grid', category: 'artistic', bestFor: ['ecommerce', 'landing', 'blog'], conflicts: ['admin-panel'], regions: ['featured', 'card-1', 'card-2', 'card-3', 'card-4'] },
  { name: 'Overlap Grid', structure: 'overlap-grid', category: 'artistic', bestFor: ['portfolio', 'landing'], conflicts: ['admin-panel', 'dashboard-app', 'ecommerce'], regions: ['background', 'foreground'] },
  { name: 'Responsive Grid', structure: 'responsive-grid', category: 'artistic', bestFor: ['ecommerce', 'blog', 'portfolio', 'landing'], conflicts: [], regions: ['content'] },
  { name: 'Login Split', structure: 'login-split', category: 'application', bestFor: ['saas'], conflicts: ['dashboard-app', 'admin-panel', 'blog'], regions: ['left', 'right'] },
  { name: 'Scroll Snap Grid', structure: 'scroll-snap-grid', category: 'artistic', bestFor: ['landing', 'ecommerce', 'media', 'social'], conflicts: [], regions: ['content'] },
  { name: 'Dense Packing', structure: 'dense-packing', category: 'bento', bestFor: ['ecommerce', 'media', 'portfolio'], conflicts: [], regions: ['content'] },
  { name: 'Full Bleed', structure: 'full-bleed', category: 'classic', bestFor: ['blog', 'documentation', 'landing'], conflicts: ['dashboard-app'], regions: ['header', 'main', 'footer'] },
  { name: 'Golden Ratio Grid', structure: 'golden-ratio-grid', category: 'mathematical', bestFor: ['blog', 'documentation', 'portfolio', 'landing'], conflicts: ['admin-panel'], regions: ['primary', 'secondary'] },
  { name: 'Animated Grid', structure: 'animated-grid', category: 'advanced', bestFor: ['dashboard-app', 'saas', 'analytics'], conflicts: [], regions: ['hero', 'card-1', 'card-2', 'card-3'] },
  { name: 'Container Query Grid', structure: 'container-query-grid', category: 'advanced', bestFor: ['saas', 'dashboard-app', 'analytics', 'application'], conflicts: [], regions: ['content'] },
  { name: 'Subgrid Sync', structure: 'subgrid-sync', category: 'advanced', bestFor: ['dashboard-app', 'analytics', 'crm', 'application'], conflicts: ['landing', 'portfolio'], regions: ['header', 'sidebar', 'main'] },
  { name: 'Nav Logo Action', structure: 'nav-logo-action', category: 'application', bestFor: ['landing', 'saas', 'documentation', 'application'], conflicts: [], regions: ['header', 'main'] },
  { name: 'Form Label Input', structure: 'form-label-input', category: 'application', bestFor: ['saas', 'admin-panel', 'crm'], conflicts: ['landing', 'portfolio', 'media'], regions: ['header', 'main'] },
]

const GOAL_PREFS: Record<string, { prefer: string[]; avoid: string[] }> = {
  landing: { prefer: ['fullscreen-hero', 'split-screen', 'bento-hero', 'magazine', 'scroll-snap-grid', 'nav-logo-action'], avoid: ['dashboard', 'sidebar-left', 'sidebar-right', 'bento-sidebar', 'form-label-input'] },
  'admin-panel': { prefer: ['dashboard', 'sidebar-left', 'bento-sidebar', 'animated-grid', 'form-label-input'], avoid: ['fullscreen-hero', 'split-screen', 'bento-hero', 'honeycomb-grid', 'overlap-grid'] },
  blog: { prefer: ['top-nav', 'holy-grail', 'magazine', 'full-bleed', 'golden-ratio-grid', 'asymmetric-grid'], avoid: ['dashboard', 'bento-sidebar', 'login-split'] },
  ecommerce: { prefer: ['cards-grid', 'responsive-grid', 'holy-grail', 'scroll-snap-grid', 'dense-packing', 'nav-logo-action'], avoid: ['fullscreen-hero', 'overlap-grid', 'login-split'] },
  'dashboard-app': { prefer: ['dashboard', 'sidebar-left', 'bento-grid', 'bento-sidebar', 'animated-grid', 'subgrid-sync'], avoid: ['fullscreen-hero', 'split-screen', 'honeycomb-grid', 'overlap-grid'] },
  documentation: { prefer: ['sidebar-left', 'holy-grail', 'top-nav', 'full-bleed', 'nav-logo-action', 'golden-ratio-grid'], avoid: ['fullscreen-hero', 'overlap-grid', 'honeycomb-grid'] },
  portfolio: { prefer: ['bento-grid', 'bento-hero', 'masonry-grid', 'asymmetric-grid', 'overlap-grid', 'bento-masonry'], avoid: ['dashboard', 'sidebar-left', 'form-label-input', 'login-split'] },
  saas: { prefer: ['login-split', 'dashboard', 'sidebar-left', 'animated-grid', 'container-query-grid', 'nav-logo-action'], avoid: ['honeycomb-grid', 'overlap-grid'] },
  crm: { prefer: ['dashboard', 'sidebar-left', 'three-columns', 'form-label-input', 'animated-grid', 'subgrid-sync'], avoid: ['fullscreen-hero', 'overlap-grid', 'honeycomb-grid'] },
  analytics: { prefer: ['dashboard', 'bento-grid', 'subgrid-sync', 'bento-sidebar', 'container-query-grid'], avoid: ['fullscreen-hero', 'split-screen', 'honeycomb-grid', 'overlap-grid'] },
  application: { prefer: ['dashboard', 'sidebar-left', 'container-query-grid', 'animated-grid', 'bento-sidebar', 'subgrid-sync', 'nav-logo-action'], avoid: ['fullscreen-hero', 'split-screen', 'login-split', 'honeycomb-grid'] },
}

const GOAL_KW: Record<string, string[]> = {
  landing: ['landing', 'лендинг', 'promo', 'home page', 'splash'],
  'dashboard-app': ['dashboard', 'дашборд', 'панель', 'control panel', 'monitor', 'kpi'],
  blog: ['blog', 'блог', 'статьи', 'articles', 'посты', 'posts', 'news'],
  ecommerce: ['shop', 'магазин', 'store', 'catalog', 'product', 'ecommerce', 'товары'],
  documentation: ['docs', 'документация', 'documentation', 'api reference', 'guide'],
  portfolio: ['portfolio', 'портфолио', 'showcase', 'gallery', 'галерея'],
  social: ['social', 'feed', 'лента', 'timeline', 'community'],
  media: ['media', 'медиа', 'photo', 'фото', 'video', 'видео'],
  saas: ['saas', 'sass', 'cloud app', 'subscription', 'pricing', 'тарифы'],
  crm: ['crm', 'contacts', 'client', 'customer', 'lead'],
  analytics: ['analytics', 'аналитик', 'chart', 'график', 'report', 'statistics'],
  'admin-panel': ['admin', 'админ', 'settings', 'настройки', 'manage', 'управлен'],
  application: ['приложен', 'app', 'application', 'system', 'platform', 'платформ'],
}

interface Parsed { goal: string; contentType: string; itemCount: number; needsSidebar: boolean; needsHeader: boolean; needsFooter: boolean; goalWeights: Record<string, number> }

function parsePrompt(prompt: string): Parsed {
  const lower = prompt.toLowerCase()
  const gs: Record<string, number> = {}
  for (const [g, kws] of Object.entries(GOAL_KW)) { let s = 0; for (const kw of kws) if (lower.includes(kw)) s += kw.length; if (s > 0) gs[g] = s }
  let goal = 'landing', maxG = 0
  for (const [g, s] of Object.entries(gs)) { if (s > maxG) { maxG = s; goal = g } }
  const total = Object.values(gs).reduce((a, b) => a + b, 0)
  const goalWeights: Record<string, number> = total > 0 ? Object.fromEntries(Object.entries(gs).map(([g, s]) => [g, s / total])) : { [goal]: 1 }
  let needsSidebar = ['dashboard-app', 'admin-panel', 'crm', 'analytics', 'documentation', 'application'].includes(goal)
  let needsFooter = ['blog', 'ecommerce', 'documentation', 'landing'].includes(goal)
  for (const kw of ['sidebar', 'сайдбар', 'nav', 'навигация', 'menu', 'меню']) if (lower.includes(kw)) { needsSidebar = true; break }
  for (const kw of ['footer', 'футер', 'подвал']) if (lower.includes(kw)) { needsFooter = true; break }
  const defaults: Record<string, number> = { ecommerce: 24, analytics: 12, crm: 12, saas: 1, 'dashboard-app': 12, 'admin-panel': 10, landing: 6, blog: 8, media: 8 }
  const numMatch = lower.match(/(\d+)\s*(items?|cards?|products?|articles?|photo|video)/)
  const itemCount = numMatch ? Math.min(50, Math.max(1, parseInt(numMatch[1], 10))) : (defaults[goal] ?? 6)
  const CK: Record<string, string[]> = { cards: ['card', 'pricing', 'тариф'], data: ['data', 'chart', 'график', 'table'], text: ['text', 'article', 'стать', 'post'], media: ['photo', 'фото', 'image', 'video'], forms: ['form', 'login', 'register', 'signup'], mixed: ['mixed', 'complex', 'dynamic'] }
  let contentType = 'cards', maxC = 0
  for (const [ct, kws] of Object.entries(CK)) { let s = 0; for (const kw of kws) if (lower.includes(kw)) s += kw.length; if (s > maxC) { maxC = s; contentType = ct } }
  return { goal, contentType, itemCount, needsSidebar, needsHeader: true, needsFooter, goalWeights }
}

const W = { goalMatch: 25, goalConflict: -35, contentAffinity: 15, itemCountFit: 10, structureMatch: 15 }
const CA: Record<string, string[]> = {
  cards: ['cards-grid', 'responsive-grid', 'bento-grid', 'masonry-grid', 'dense-packing'],
  text: ['top-nav', 'holy-grail', 'magazine', 'golden-ratio-grid', 'full-bleed'],
  data: ['dashboard', 'sidebar-left', 'bento-grid', 'subgrid-sync', 'animated-grid'],
  media: ['masonry-grid', 'bento-masonry', 'fullscreen-hero', 'split-screen', 'scroll-snap-grid'],
  forms: ['sidebar-left', 'top-nav', 'two-columns', 'form-label-input', 'login-split'],
  mixed: ['dashboard', 'holy-grail', 'sidebar-left', 'bento-grid', 'container-query-grid'],
}

interface Scored { structure: string; name: string; category: string; score: number; verdict: string; reason: string; regions: string[]; bestFor: string[] }

function scoreRecipe(r: Recipe, p: Parsed): Scored {
  let score = 50; const reasons: string[] = []
  if (r.bestFor.includes(p.goal)) { score += W.goalMatch; reasons.push(`Optimized for ${p.goal}`) }
  if (r.conflicts.includes(p.goal)) { score += W.goalConflict; reasons.push(`Conflicts with ${p.goal}`) }
  const prefs = GOAL_PREFS[p.goal]
  if (prefs) { if (prefs.prefer.includes(r.structure)) { score += 8; reasons.push(`Popular for ${p.goal}`) }; if (prefs.avoid.includes(r.structure)) { score -= 5; reasons.push(`Rarely used for ${p.goal}`) } }
  if ((CA[p.contentType] ?? []).includes(r.structure)) { score += W.contentAffinity; reasons.push(`Good for ${p.contentType}`) }
  if (p.itemCount <= 1 && ['fullscreen-hero', 'split-screen', 'top-nav', 'login-split'].includes(r.structure)) { score += W.itemCountFit; reasons.push('Single-item focus') }
  else if (p.itemCount <= 6 && ['bento-grid', 'bento-hero', 'span-grid', 'magazine', 'dense-packing'].includes(r.structure)) { score += W.itemCountFit; reasons.push('Small collection') }
  else if (p.itemCount > 6 && ['cards-grid', 'responsive-grid', 'masonry-grid', 'container-query-grid'].includes(r.structure)) { score += W.itemCountFit; reasons.push('Large collection') }
  let sb = 0
  if (p.needsSidebar) { const has = r.regions.includes('sidebar'); sb += has ? 5 : -5; if (has) reasons.push('Has sidebar') }
  if (p.needsHeader) sb += r.regions.includes('header') ? 5 : -3
  if (p.needsFooter) sb += r.regions.includes('footer') ? 5 : -3
  score = Math.max(0, Math.min(100, score + Math.max(-W.structureMatch, Math.min(W.structureMatch, sb))))
  let verdict = 'warning'; if (r.conflicts.includes(p.goal)) verdict = 'error'; else if (score >= 70) verdict = 'recommended'
  return { structure: r.structure, name: r.name, category: r.category, score, verdict, reason: reasons.length > 0 ? reasons.join('. ') : 'Neutral match', regions: r.regions, bestFor: r.bestFor }
}

export function recommendCommand(program: Command) {
  program
    .command('recommend')
    .description('Get layout recommendations for a project description')
    .argument('<prompt>', 'Natural language description of what you want to build')
    .option('-t, --top <number>', 'Number of recommendations', '5')
    .option('-j, --json', 'Output as JSON')
    .option('--verbose', 'Show detailed scoring breakdown')
    .action(action)
}

async function action(prompt: string, options: { top: string; json?: boolean; verbose?: boolean }) {
  const { default: chalk } = await import('chalk')
  const { default: ora } = await import('ora')
  const spinner = ora('Analyzing prompt...').start()
  const parsed = parsePrompt(prompt)
  const topN = Math.max(1, Math.min(RECIPES.length, parseInt(options.top, 10) || 5))
  const scored = RECIPES.map(r => scoreRecipe(r, parsed)).sort((a, b) => b.score - a.score).slice(0, topN)
  spinner.stop()
  if (options.json) {
    console.log(JSON.stringify({ prompt, parsed, recommendations: scored.map(s => ({ name: s.name, structure: s.structure, score: s.score, verdict: s.verdict, reason: s.reason, bestFor: s.bestFor })) }, null, 2)); return
  }
  console.log(chalk.bold(`\n  Layout Recommendations for "${prompt}"\n`))
  for (let i = 0; i < scored.length; i++) {
    const s = scored[i]
    const badge = s.verdict === 'recommended' ? chalk.green('[RECOMMENDED]') : s.verdict === 'error' ? chalk.red('[AVOID]') : chalk.yellow('[OK]')
    console.log(`  ${chalk.dim(`${i + 1}.`)} ${chalk.bold(s.name.padEnd(22))} Score: ${chalk.cyan(String(s.score).padStart(3))}   ${badge}`)
    console.log(`     ${chalk.dim(s.category)} | ${chalk.dim(s.regions.join(':'))}`)
    console.log(`     Best for: ${chalk.dim(s.bestFor.join(', '))}`)
    if (options.verbose) console.log(`     ${chalk.dim(s.reason)}`)
    console.log()
  }
}
