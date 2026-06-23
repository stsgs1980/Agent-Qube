/**
 * System prompts and response validator for interpret-prompt API.
 * Extracted from route.ts per STD-FE-001 (200-line limit).
 */
import { matchIntent, getInstructionContent, scorePrompt } from '@/lib/prompting'

export const BASE_SYSTEM_PROMPT = `You are a layout advisor AI for @stsgs/ui component library. Parse the user's natural language description and extract structured layout context.

Respond with ONLY valid JSON (no markdown, no explanation). Shape:

{
  "goal": "<primary goal: landing | dashboard-app | blog | ecommerce | documentation | portfolio | social | media | saas | crm | analytics | admin-panel>",
  "contentType": "<cards | text | data | media | forms | mixed>",
  "itemCount": <number>,
  "needsSidebar": <boolean>,
  "needsHeader": <boolean>,
  "needsFooter": <boolean>,
  "goalWeights": { "<goal>": <weight>, ... },
  "confidence": <0-100>,
  "detected": ["<keywords found>"],
  "explanation": "<one sentence>"
}

CRITICAL RULES:

needsSidebar — MUST be true for: dashboard, dashboard-app, admin-panel, CRM, analytics, any page with navigation trees or data panels. Only false for: landing, portfolio, simple media pages. When in doubt, prefer true.

itemCount heuristics:
- landing: 4-8 sections
- dashboard / admin-panel: 6-12 widgets/cards
- CRM / analytics: 8-16 data items
- ecommerce: 12-24 products
- blog: 6-12 posts
- documentation: 8-20 pages
- portfolio: 4-10 projects
- saas: 6-12 (landing+features+pricing)
- social: 10-24 feed items
- media: 8-16 items
When the prompt describes a COMBO (e.g. "SaaS landing with dashboard"), ADD the ranges.

goalWeights — REQUIRED. Weighted distribution. Values 0-1, MUST sum to ~1.0.
Examples:
- "SaaS landing with dashboard" -> {"saas": 0.4, "dashboard-app": 0.6}
- "blog with ecommerce shop" -> {"blog": 0.35, "ecommerce": 0.65}
- "admin panel" -> {"admin-panel": 1.0}

Other rules:
- needsHeader: true for almost everything. Only false for login/auth/modal pages.
- needsFooter: true for landing, blog, ecommerce, docs, portfolio, saas. False for dashboard-app, admin-panel, CRM, analytics.
- confidence: 0-100 based on prompt specificity.
- Support English and Russian prompts.`

export const RETRY_PROMPT = `Parse this description into JSON. Output ONLY a JSON object with keys: goal, contentType, itemCount, needsSidebar, needsHeader, needsFooter, goalWeights, confidence, detected, explanation. goalWeights values must sum to ~1.0. Dashboards/admin/CRM/analytics ALWAYS have needsSidebar:true.`

const VALID_GOALS = [
  'landing', 'dashboard-app', 'blog', 'ecommerce', 'documentation',
  'portfolio', 'social', 'media', 'saas', 'crm', 'analytics', 'admin-panel',
]
const VALID_CONTENT_TYPES = ['cards', 'text', 'data', 'media', 'forms', 'mixed']

/** Build enhanced system prompt with intent context + instructions from @stsgs/prompting */
export function buildEnhancedSystemPrompt(userPrompt: string): string {
  const intent = matchIntent(userPrompt)
  let systemPrompt = BASE_SYSTEM_PROMPT

  // Inject detected intent context (using actual IntentMatch fields)
  if (intent && intent.confidence > 0) {
    systemPrompt += `\n\nDETECTED INTENT: "${intent.intent}" (confidence: ${intent.confidence}%)`
    if (intent.keywords.length > 0) {
      systemPrompt += `\nMatched keywords: ${intent.keywords.join(', ')}`
    }
    if (intent.metadata && Object.keys(intent.metadata).length > 0) {
      systemPrompt += `\nExtracted parameters: ${JSON.stringify(intent.metadata)}`
    }
    systemPrompt += `\nIntent template: ${intent.template}`
  }

  // Inject behavioral instructions for better LLM behavior
  const diagnosticRule = getInstructionContent('diagnostic-disclosure')
  if (diagnosticRule) {
    systemPrompt += '\n\n## Behavioral Rule\n' +
      diagnosticRule
        .split('\n')
        .filter(line => line.trim() && !line.startsWith('#'))
        .slice(0, 5) // Take first 5 substantive lines
        .join('\n')
  }

  return systemPrompt
}

/** Score the user prompt quality (for feedback) */
export function evaluatePromptQuality(prompt: string): {
  score: number
  grade: string
  suggestions: string[]
} {
  const result = scorePrompt(prompt)
  return {
    score: result.numeric,
    grade: result.overall,
    suggestions: result.suggestions.slice(0, 5),
  }
}

/** Parse and validate LLM response into structured layout context */
export function parseAndValidate(raw: string) {
  let jsonStr = raw
  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (jsonMatch) {
    jsonStr = jsonMatch[1].trim()
  }

  const parsed = JSON.parse(jsonStr)

  if (!VALID_GOALS.includes(parsed.goal)) parsed.goal = 'landing'
  if (!VALID_CONTENT_TYPES.includes(parsed.contentType)) parsed.contentType = 'cards'
  parsed.itemCount = Math.max(1, Math.min(50, Number(parsed.itemCount) || 6))
  parsed.needsSidebar = Boolean(parsed.needsSidebar)
  parsed.needsHeader = Boolean(parsed.needsHeader)
  parsed.needsFooter = Boolean(parsed.needsFooter)
  parsed.confidence = Math.max(0, Math.min(100, Number(parsed.confidence) || 50))

  // Validate / normalize goalWeights
  if (
    !parsed.goalWeights ||
    typeof parsed.goalWeights !== 'object' ||
    Array.isArray(parsed.goalWeights)
  ) {
    parsed.goalWeights = { [parsed.goal]: 1.0 }
  } else {
    const cleaned: Record<string, number> = {}
    for (const [k, v] of Object.entries(parsed.goalWeights)) {
      if (VALID_GOALS.includes(k) && typeof v === 'number' && v > 0) {
        cleaned[k] = v
      }
    }
    if (Object.keys(cleaned).length === 0) {
      cleaned[parsed.goal] = 1.0
    }
    const sum = Object.values(cleaned).reduce((a, b) => a + b, 0)
    if (sum > 0 && Math.abs(sum - 1.0) > 0.05) {
      for (const k of Object.keys(cleaned)) {
        cleaned[k] = Math.round((cleaned[k] / sum) * 100) / 100
      }
    }
    parsed.goalWeights = cleaned
  }

  return parsed
}
