/**
 * Prompt parser — keyword-based NLP for layout advice.
 * Extracted from scoring.ts per anti-monolith Rule 1.
 */

import type { ParsedPrompt } from './types'

// ─── Goal Keywords ───────────────────────────────────────────

const GOAL_KEYWORDS: Record<string, string[]> = {
  landing: ['landing', 'лендинг', 'promo', 'промо', 'главная', 'home page', 'splash'],
  'dashboard-app': ['dashboard', 'дашборд', 'панель', 'control panel', 'monitor', 'мониторинг', 'kpi'],
  blog: ['blog', 'блог', 'статьи', 'articles', 'посты', 'posts', 'news', 'новости'],
  ecommerce: ['shop', 'магазин', 'store', 'catalog', 'каталог', 'product', 'продукт', 'ecommerce', 'товары'],
  documentation: ['docs', 'документация', 'documentation', 'api reference', 'справка', 'guide', 'гайд'],
  portfolio: ['portfolio', 'портфолио', 'showcase', 'витрина', 'gallery', 'галерея'],
  social: ['social', 'социальн', 'feed', 'лента', 'timeline', 'community'],
  media: ['media', 'медиа', 'photo', 'фото', 'video', 'видео', 'изображен'],
  saas: ['saas', 'sass', 'cloud app', 'облачное', 'subscription', 'подписка', 'pricing', 'тарифы'],
  crm: ['crm', 'contacts', 'контакт', 'client', 'клиент', 'customer', 'lead', 'лид'],
  analytics: ['analytics', 'аналитик', 'chart', 'график', 'report', 'отчёт', 'statistics'],
  'admin-panel': ['admin', 'админ', 'settings', 'настройки', 'manage', 'управлен'],
  application: ['приложен', 'app', 'application', 'систем', 'system', 'маршрутиз', 'routing', 'route', 'фреймворк', 'framework', 'платформ', 'platform', 'архитектур', 'architecture', 'ядро', 'core', 'engine', 'движок'],
}

const CONTENT_KEYWORDS: Record<string, string[]> = {
  cards: ['card', 'карточк', 'item', 'tile', 'pricing', 'тариф'],
  data: ['data', 'данн', 'chart', 'график', 'table', 'таблиц', 'metric', 'метрик'],
  text: ['text', 'текст', 'article', 'стать', 'post', 'пост', 'content', 'контент'],
  media: ['photo', 'фото', 'image', 'изображ', 'video', 'видео', 'visual'],
  forms: ['form', 'форм', 'input', 'ввод', 'login', 'логин', 'register', 'регистраци', 'signup'],
  mixed: ['mixed', 'разн', 'complex', 'комплекс', 'динамич', 'dynamic', 'генерир', 'generat', 'компонент', 'component', 'модул', 'module', 'виджет', 'widget', 'структур', 'layout', 'библиотек', 'library', 'контекст', 'context', 'механизм', 'mechanism', 'config', 'конфигур'],
}

const SIDEBAR_KW = ['sidebar', 'сайдбар', 'боковая', 'nav', 'навигация', 'menu', 'меню', 'маршрутиз', 'routing', 'навигац', 'структур']
const FOOTER_KW = ['footer', 'футер', 'подвал', 'bottom']

// ─── Helpers ─────────────────────────────────────────────────

function scoreKeywords(lower: string, keywordMap: Record<string, string[]>): Record<string, number> {
  const scores: Record<string, number> = {}
  for (const [key, kws] of Object.entries(keywordMap)) {
    let s = 0
    for (const kw of kws) if (lower.includes(kw)) s += kw.length
    if (s > 0) scores[key] = s
  }
  return scores
}

function topKey(scores: Record<string, number>): string {
  let best = '', max = 0
  for (const [k, s] of Object.entries(scores)) {
    if (s > max) {
      max = s
      best = k
    }
  }
  return best
}

function normalizeWeights(scores: Record<string, number>, primary: string): Record<string, number> {
  const total = Object.values(scores).reduce((a, b) => a + b, 0)
  if (total === 0) return { [primary]: 1 }
  const weights: Record<string, number> = {}
  for (const [k, s] of Object.entries(scores)) weights[k] = s / total
  return weights
}

function matchItemCount(lower: string): number | null {
  const m = lower.match(/(\d+)\s*(items?|элемент|cards?|карточ|products?|товар|articles?|posts?|photo|фото|video|видео|contacts?)/)
  return m ? Math.min(50, Math.max(1, parseInt(m[1], 10))) : null
}

function defaultItemCount(goal: string): number {
  const defaults: Record<string, number> = {
    ecommerce: 24, social: 24, analytics: 12, crm: 12, saas: 1,
    application: 8, 'dashboard-app': 12, 'admin-panel': 10,
    landing: 6, blog: 8, documentation: 6, portfolio: 6, media: 8,
  }
  return defaults[goal] ?? 6
}

function weightedItemCount(weights: Record<string, number>): number {
  let sum = 0, totalW = 0
  for (const [g, w] of Object.entries(weights)) {
    sum += defaultItemCount(g) * w
    totalW += w
  }
  return totalW > 0 ? Math.round(sum / totalW) : 6
}

function resolveStructural(goal: string, isMultiGoal: boolean, weights: Record<string, number>, lower: string) {
  const SIDEBAR_GOALS = ['dashboard-app', 'admin-panel', 'crm', 'analytics', 'documentation', 'application']
  const FOOTER_GOALS = ['blog', 'ecommerce', 'documentation', 'landing']
  let needsSidebar = SIDEBAR_GOALS.includes(goal)
  let needsHeader = true
  let needsFooter = FOOTER_GOALS.includes(goal)

  if (isMultiGoal) {
    for (const [g, w] of Object.entries(weights)) {
      if (w > 0.15 && SIDEBAR_GOALS.includes(g)) needsSidebar = true
      if (w > 0.15 && FOOTER_GOALS.includes(g)) needsFooter = true
    }
  }

  if (SIDEBAR_KW.some(kw => lower.includes(kw))) needsSidebar = true
  if (FOOTER_KW.some(kw => lower.includes(kw))) needsFooter = true

  return { needsSidebar, needsHeader, needsFooter }
}

// ─── Prompt Parser ───────────────────────────────────────────

export function parsePrompt(prompt: string): ParsedPrompt {
  const lower = prompt.toLowerCase()
  const detected: string[] = []

  const goalScores = scoreKeywords(lower, GOAL_KEYWORDS)
  let goal = topKey(goalScores) || 'landing'
  if (Object.values(goalScores).some(s => s > 0)) detected.push(`goal:${goal}`)

  const goalWeights = normalizeWeights(goalScores, goal)
  if (goal !== goal) detected.push(`goal:${goal}`)
  const isMultiGoal = Object.keys(goalWeights).filter(g => goalWeights[g] > 0).length > 1

  const contentScores = scoreKeywords(lower, CONTENT_KEYWORDS)
  let contentType = topKey(contentScores) || 'cards'
  if (Object.values(contentScores).some(s => s > 0)) detected.push(`content:${contentType}`)
  if (isMultiGoal && Object.values(contentScores).every(s => s === 0)) contentType = 'mixed'

  const numItems = matchItemCount(lower)
  let itemCount: number
  if (numItems !== null) {
    itemCount = numItems
    detected.push(`items:${itemCount}`)
  } else {
    itemCount = isMultiGoal ? weightedItemCount(goalWeights) : defaultItemCount(goal)
  }

  const { needsSidebar, needsHeader, needsFooter } = resolveStructural(goal, isMultiGoal, goalWeights, lower)

  const AUTH_KW = ['login', 'signin', 'signup', 'register', 'auth']
  if (AUTH_KW.some(kw => lower.includes(kw))) {
    needsHeader = false
    goal = 'saas'
    contentType = 'forms'
    itemCount = 1
    detected.push('auth')
    goalWeights['saas'] = 1
  }

  return { goal, contentType, itemCount, needsSidebar, needsHeader, needsFooter, detected, goalWeights }
}