/**
 * Prompt parser — keyword-based NLP for layout inference.
 * Extracted from scoring.ts for anti-monolith compliance.
 */

import type { ParsedPrompt } from './types'

// ─── Goal Keywords ────────────────────────────────────────────

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

// ─── Content Keywords ─────────────────────────────────────────

const CONTENT_KEYWORDS: Record<string, string[]> = {
  cards: ['card', 'карточк', 'item', 'tile', 'pricing', 'тариф'],
  data: ['data', 'данн', 'chart', 'график', 'table', 'таблиц', 'metric', 'метрик'],
  text: ['text', 'текст', 'article', 'стать', 'post', 'пост', 'content', 'контент'],
  media: ['photo', 'фото', 'image', 'изображ', 'video', 'видео', 'visual'],
  forms: ['form', 'форм', 'input', 'ввод', 'login', 'логин', 'register', 'регистраци', 'signup'],
  mixed: ['mixed', 'разн', 'complex', 'комплекс', 'динамич', 'dynamic', 'генерир', 'generat', 'компонент', 'component', 'модул', 'module', 'виджет', 'widget', 'структур', 'layout', 'библиотек', 'library', 'контекст', 'context', 'механизм', 'mechanism', 'config', 'конфигур'],
}

// ─── Structural Keywords ──────────────────────────────────────

const SIDEBAR_KW = ['sidebar', 'сайдбар', 'боковая', 'nav', 'навигация', 'menu', 'меню', 'маршрутиз', 'routing', 'навигац', 'структур']
const FOOTER_KW = ['footer', 'футер', 'подвал', 'bottom']

// ─── Prompt Parser ────────────────────────────────────────────

export function parsePrompt(prompt: string): ParsedPrompt {
  const lower = prompt.toLowerCase()
  const detected: string[] = []

  // Score ALL goals
  const goalScores: Record<string, number> = {}
  for (const [g, kws] of Object.entries(GOAL_KEYWORDS)) {
    let s = 0
    for (const kw of kws) if (lower.includes(kw)) s += kw.length
    if (s > 0) goalScores[g] = s
  }

  // Primary goal = highest score
  let goal = 'landing', maxG = 0
  for (const [g, s] of Object.entries(goalScores)) { if (s > maxG) { maxG = s; goal = g } }
  if (maxG > 0) detected.push(`goal:${goal}`)

  // Normalize weights
  const totalScore = Object.values(goalScores).reduce((a, b) => a + b, 0)
  const goalWeights: Record<string, number> = {}
  if (totalScore > 0) {
    for (const [g, s] of Object.entries(goalScores)) {
      goalWeights[g] = s / totalScore
      if (g !== goal && s > 0) detected.push(`goal:${g}`)
    }
  } else {
    goalWeights[goal] = 1
  }

  const isMultiGoal = Object.keys(goalWeights).filter(g => goalWeights[g] > 0).length > 1

  // Content type
  let contentType = 'cards', maxC = 0
  for (const [ct, kws] of Object.entries(CONTENT_KEYWORDS)) {
    let s = 0
    for (const kw of kws) if (lower.includes(kw)) s += kw.length
    if (s > maxC) { maxC = s; contentType = ct }
  }
  if (maxC > 0) detected.push(`content:${contentType}`)
  if (isMultiGoal && maxC === 0) contentType = 'mixed'

  // Item count
  let itemCount = 6
  const numMatch = lower.match(/(\d+)\s*(items?|элемент|cards?|карточ|products?|товар|articles?|posts?|photo|фото|video|видео|contacts?)/)
  if (numMatch) {
    itemCount = Math.min(50, Math.max(1, parseInt(numMatch[1], 10)))
    detected.push(`items:${itemCount}`)
  } else {
    const goalItemDefaults: Record<string, number> = {
      ecommerce: 24, social: 24, analytics: 12, crm: 12, saas: 1,
      application: 8, 'dashboard-app': 12, 'admin-panel': 10,
      landing: 6, blog: 8, documentation: 6, portfolio: 6, media: 8,
    }
    if (isMultiGoal) {
      let weightedSum = 0, totalW = 0
      for (const [g, w] of Object.entries(goalWeights)) {
        weightedSum += (goalItemDefaults[g] ?? 6) * w
        totalW += w
      }
      itemCount = totalW > 0 ? Math.round(weightedSum / totalW) : 6
    } else {
      itemCount = goalItemDefaults[goal] ?? 6
    }
  }

  // Structural inference
  const SIDEBAR_GOALS = ['dashboard-app', 'admin-panel', 'crm', 'analytics', 'documentation', 'application']
  const FOOTER_GOALS = ['blog', 'ecommerce', 'documentation', 'landing']
  let needsSidebar = SIDEBAR_GOALS.includes(goal)
  let needsHeader = true
  let needsFooter = FOOTER_GOALS.includes(goal)

  if (isMultiGoal) {
    for (const [g, w] of Object.entries(goalWeights)) {
      if (w > 0.15 && SIDEBAR_GOALS.includes(g)) needsSidebar = true
      if (w > 0.15 && FOOTER_GOALS.includes(g)) needsFooter = true
    }
  }

  for (const kw of SIDEBAR_KW) if (lower.includes(kw)) { needsSidebar = true; detected.push('sidebar'); break }
  for (const kw of FOOTER_KW) if (lower.includes(kw)) { needsFooter = true; detected.push('footer'); break }

  // Auth override
  if (['login', 'signin', 'signup', 'register', 'auth'].some(kw => lower.includes(kw))) {
    needsHeader = false; goal = 'saas'; contentType = 'forms'; itemCount = 1
    detected.push('auth'); goalWeights['saas'] = 1
  }

  return { goal, contentType, itemCount, needsSidebar, needsHeader, needsFooter, detected, goalWeights }
}
