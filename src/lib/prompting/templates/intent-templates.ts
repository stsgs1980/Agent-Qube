/**
 * @stsgs/prompting -- 12 Intent Templates + matchIntent()
 * Analyzes user prompts to detect intent, extract parameters,
 * and route to appropriate templates.
 */

import type { IntentType, IntentMatch } from '../core/types'

// ─── Intent Definitions ──────────────────────────────────────

interface IntentDefinition {
  type: IntentType
  keywords: Array<{ en: string[]; ru?: string[] }>
  template: string
  confidenceBoost: number
  parameterExtractors: Record<string, RegExp[]>
}

const INTENTS: IntentDefinition[] = [
  {
    type: 'layout-advice',
    keywords: [
      { en: ['layout', 'page layout', 'grid', 'dashboard', 'sidebar', 'landing', 'admin', 'design', 'wireframe', 'mockup'], ru: ['макет', 'раскладка', 'дизайн', 'дашборд', 'сайдбар', 'лендинг'] },
      { en: ['build me', 'create a', 'design a', 'make a'], ru: ['создай', 'построй', 'сделай', 'нарисуй'] },
    ],
    template:
      'Parse the following layout description and extract structured parameters:\n\n' +
      'Return JSON with: goal, contentType, itemCount, needsSidebar, needsHeader, needsFooter, confidence, detected[], explanation.',
    confidenceBoost: 10,
    parameterExtractors: {
      goal: [/landing|лендинг/i, /dashboard|дашборд|admin/i, /blog/i, /ecommerce|shop|store|магазин/i, /docs|documentation|документаци/i, /portfolio/i, /crm/i, /analytics/i],
      contentType: [/card|grid|catalog|каталог/i, /text|article|blog|стать/i, /data|chart|graph|metric/i, /image|media|gallery|фото/i, /form|input|ввод/i],
    },
  },
  {
    type: 'component-query',
    keywords: [
      { en: ['component', 'widget', 'ui element', 'button', 'form', 'modal', 'dialog', 'table', 'card', 'navigation'], ru: ['компонент', 'виджет', 'кнопка', 'форма', 'таблица', 'карточка', 'навигация'] },
    ],
    template:
      'Find the best matching component for: {query}.\n' +
      'Return JSON: { name, description, props[], category, codeExample }.',
    confidenceBoost: 5,
    parameterExtractors: {},
  },
  {
    type: 'code-generation',
    keywords: [
      { en: ['generate code', 'write code', 'create function', 'implement', 'build a function', 'code for', 'write a script'], ru: ['сгенерируй код', 'напиши код', 'создай функцию', 'реализуй', 'напиши скрипт'] },
    ],
    template:
      'Generate production-ready code for: {query}.\n' +
      'Include: imports, type definitions, error handling, and inline comments.\n' +
      'Follow existing project patterns and conventions.',
    confidenceBoost: 5,
    parameterExtractors: {},
  },
  {
    type: 'code-review',
    keywords: [
      { en: ['review', 'analyze code', 'code quality', 'refactor', 'improve', 'optimize', 'clean up'], ru: ['ревью', 'проанализируй код', 'качество кода', 'рефакторинг', 'улучши', 'оптимизируй'] },
    ],
    template:
      'Perform a thorough code review focusing on:\n' +
      '1. Type safety and correctness\n' +
      '2. Error handling completeness\n' +
      '3. Performance considerations\n' +
      '4. Code organization and readability\n' +
      '5. Security vulnerabilities\n\n' +
      'Rate each issue as Critical/High/Medium/Low with specific line references.',
    confidenceBoost: 5,
    parameterExtractors: {},
  },
  {
    type: 'debugging',
    keywords: [
      { en: ['bug', 'error', 'fix', 'debug', 'not working', 'broken', 'crash', 'exception', 'failure'], ru: ['баг', 'ошибка', 'починить', 'дебаг', 'не работает', 'сломано', 'падает'] },
    ],
    template:
      'Diagnose and fix the following issue:\n\n' +
      '{error_details}\n\n' +
      'Steps:\n1. Identify root cause\n2. Explain why it happens\n3. Provide the fix\n4. Suggest prevention',
    confidenceBoost: 8,
    parameterExtractors: {},
  },
  {
    type: 'explanation',
    keywords: [
      { en: ['explain', 'what is', 'how does', 'why', 'tell me about', 'describe', 'elaborate'], ru: ['объясни', 'что такое', 'как работает', 'почему', 'расскажи', 'опиши'] },
    ],
    template:
      'Explain the following concept clearly and thoroughly:\n\n' +
      '{query}\n\n' +
      'Structure:\n1. One-sentence summary\n2. Detailed explanation\n3. Real-world analogy\n4. Code example (if applicable)\n5. Common pitfalls',
    confidenceBoost: 3,
    parameterExtractors: {},
  },
  {
    type: 'translation',
    keywords: [
      { en: ['translate', 'convert to', 'in english', 'in russian', 'localize', 'i18n'], ru: ['переведи', 'перевод', 'на английском', 'на русском', 'локализуй'] },
    ],
    template:
      'Translate the following text maintaining the original meaning, tone, and formatting:\n\n' +
      '{text}\n\n' +
      'Rules:\n- Preserve technical terms in the original language when appropriate\n' +
      '- Maintain markdown formatting\n- Keep code blocks unchanged',
    confidenceBoost: 8,
    parameterExtractors: {},
  },
  {
    type: 'summarization',
    keywords: [
      { en: ['summarize', 'summary', 'tldr', 'brief', 'overview', 'key points', 'condensed'], ru: ['суммаризируй', 'кратко', 'обзор', 'ключевые моменты', 'выжимка'] },
    ],
    template:
      'Summarize the following content in a structured format:\n\n' +
      '{content}\n\n' +
      'Output format:\n- Summary (2-3 sentences)\n- Key Points (bullet list)\n- Action Items (if any)\n- Open Questions (if any)',
    confidenceBoost: 5,
    parameterExtractors: {},
  },
  {
    type: 'data-analysis',
    keywords: [
      { en: ['analyze data', 'statistics', 'metrics', 'trends', 'insights', 'report', 'aggregation'], ru: ['анализ данных', 'статистика', 'метрики', 'тренды', 'инсайты', 'отчёт'] },
    ],
    template:
      'Analyze the following data and provide insights:\n\n' +
      '{data}\n\n' +
      'Include:\n1. Key metrics and their values\n2. Trends and patterns\n3. Anomalies or outliers\n4. Recommendations based on data',
    confidenceBoost: 5,
    parameterExtractors: {},
  },
  {
    type: 'creative-writing',
    keywords: [
      { en: ['write', 'story', 'article', 'content', 'copy', 'headline', 'description', 'narrative'], ru: ['напиши', 'статья', 'контент', 'копирайтинг', 'заголовок', 'описание'] },
    ],
    template:
      'Write compelling content for the following request:\n\n' +
      '{query}\n\n' +
      'Guidelines:\n- Match the specified tone and audience\n- Use concrete language over abstractions\n- Lead with the most important information\n- End with a clear call to action',
    confidenceBoost: 3,
    parameterExtractors: {},
  },
  {
    type: 'refactoring',
    keywords: [
      { en: ['refactor', 'restructure', 'reorganize', 'simplify', 'extract', 'decompose', 'clean code'], ru: ['рефакторинг', 'реструктуризация', 'упрости', 'выдели', 'декомпозиция'] },
    ],
    template:
      'Refactor the following code following clean code principles:\n\n' +
      '{code}\n\n' +
      'Goals:\n1. Reduce complexity (cyclomatic < 10 per function)\n2. Improve readability (self-documenting names)\n3. Eliminate duplication (DRY)\n4. Maintain exact same behavior',
    confidenceBoost: 7,
    parameterExtractors: {},
  },
  {
    type: 'testing',
    keywords: [
      { en: ['test', 'spec', 'unit test', 'integration test', 'e2e', 'coverage', 'assert', 'jest', 'playwright', 'vitest'], ru: ['тест', 'спецификация', 'юнит тест', 'интеграционный тест', 'покрытие'] },
    ],
    template:
      'Generate comprehensive tests for:\n\n' +
      '{code_or_description}\n\n' +
      'Coverage requirements:\n- Happy path (main functionality)\n- Edge cases (empty, null, boundary values)\n- Error cases (invalid input, network failures)\n- Type safety (TypeScript compilation)',
    confidenceBoost: 6,
    parameterExtractors: {},
  },
]

// ─── Public API ──────────────────────────────────────────────

/**
 * Analyze a user prompt and detect the most likely intent.
 * Returns the best IntentMatch with confidence score and matched keywords.
 *
 * Integration point: used by /api/interpret-prompt/route.ts
 */
export function matchIntent(prompt: string): IntentMatch {
  const lower = prompt.toLowerCase().trim()
  if (!lower) {
    return {
      intent: 'explanation',
      confidence: 0,
      keywords: [],
      template: INTENTS.find(i => i.type === 'explanation')!.template,
      metadata: {},
    }
  }

  const scores: Array<{ intent: IntentDefinition; score: number; matched: string[] }> = []

  for (const intentDef of INTENTS) {
    let score = 0
    const matched: string[] = []

    for (const kwGroup of intentDef.keywords) {
      for (const kw of kwGroup.en) {
        if (lower.includes(kw.toLowerCase())) {
          score += kw.split(' ').length // multi-word keywords score higher
          matched.push(kw)
        }
      }
      if (kwGroup.ru) {
        for (const kw of kwGroup.ru) {
          if (lower.includes(kw.toLowerCase())) {
            score += kw.split(' ').length
            matched.push(kw)
          }
        }
      }
    }

    score += intentDef.confidenceBoost
    scores.push({ intent: intentDef, score, matched })
  }

  scores.sort((a, b) => b.score - a.score)
  const best = scores[0]

  // Calculate confidence as percentage (normalize against max possible)
  const maxPossibleScore = Math.max(
    best.intent.keywords.reduce((sum, kg) => sum + kg.en.length + (kg.ru?.length ?? 0), 0) + best.intent.confidenceBoost,
    1
  )
  const confidence = Math.min(100, Math.round((best.score / maxPossibleScore) * 100))

  // Extract parameters if available
  const metadata: Record<string, unknown> = {}
  for (const [param, patterns] of Object.entries(best.intent.parameterExtractors)) {
    const values: string[] = []
    for (const pattern of patterns) {
      if (pattern.test(prompt)) {
        const match = prompt.match(pattern)
        if (match) values.push(match[0])
      }
    }
    if (values.length > 0) metadata[param] = values
  }

  return {
    intent: best.intent.type,
    confidence,
    keywords: best.matched,
    template: best.intent.template.replace('{query}', prompt).replace('{content}', prompt).replace('{text}', prompt).replace('{code}', prompt).replace('{code_or_description}', prompt).replace('{error_details}', prompt).replace('{data}', prompt),
    metadata,
  }
}

/**
 * Get all available intent types.
 */
export function getIntentTypes(): IntentType[] {
  return INTENTS.map(i => i.type)
}

/**
 * Get the template for a specific intent type.
 */
export function getIntentTemplate(type: IntentType): string | undefined {
  return INTENTS.find(i => i.type === type)?.template
}

export { INTENTS }
