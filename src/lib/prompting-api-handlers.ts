import { NextResponse } from 'next/server'
import {
  getCognitiveFormulas,
  getFormulasByCategory,
  getCognitiveFormula,
  applyFormula,
  getCognitiveCategories,
  getOrchestrationPatterns,
  getOrchestrationPattern,
  getPatternsByTopology,
  getTechniques,
  getTechnique,
  getFrameworks,
  getFramework,
  getAgentRoles,
  getBestAgentForIntent,
  matchIntent,
  getIntentTypes,
  scorePrompt,
  quickScore,
  runBenchmark,
  quickBenchmark,
  getFlowTemplates,
  getFlowTemplate,
  getInstructionIds,
  getInstructionContent,
  searchInstructions,
} from '@/lib/prompting'

export const AVAILABLE_SECTIONS = [
  'formulas', 'patterns', 'techniques', 'frameworks', 'roles',
  'intent', 'score', 'quick-score', 'benchmark', 'flows',
  'instructions', 'apply-formula',
] as const

type SectionHandler = (
  id: string | null,
  query: string | null,
  searchParams: URLSearchParams,
) => NextResponse

function handleFormulas(id: string | null, _query: string | null, searchParams: URLSearchParams): NextResponse {
  if (id) {
    const formula = getCognitiveFormula(id)
    return formula
      ? NextResponse.json(formula)
      : NextResponse.json({ error: 'Formula not found' }, { status: 404 })
  }
  const category = searchParams.get('category') as Parameters<typeof getFormulasByCategory>[0] | null
  const formulas = category ? getFormulasByCategory(category) : getCognitiveFormulas()
  return NextResponse.json({ formulas, categories: getCognitiveCategories() })
}

function handlePatterns(id: string | null, _query: string | null, searchParams: URLSearchParams): NextResponse {
  if (id) {
    const pattern = getOrchestrationPattern(id)
    return pattern
      ? NextResponse.json(pattern)
      : NextResponse.json({ error: 'Pattern not found' }, { status: 404 })
  }
  const topology = searchParams.get('topology') as Parameters<typeof getPatternsByTopology>[0] | null
  const patterns = topology ? getPatternsByTopology(topology) : getOrchestrationPatterns()
  return NextResponse.json(patterns)
}

function handleTechniques(id: string | null, _query: string | null, _searchParams: URLSearchParams): NextResponse {
  if (id) {
    const technique = getTechnique(id)
    return technique
      ? NextResponse.json(technique)
      : NextResponse.json({ error: 'Technique not found' }, { status: 404 })
  }
  return NextResponse.json(getTechniques())
}

function handleFrameworks(id: string | null, _query: string | null, _searchParams: URLSearchParams): NextResponse {
  if (id) {
    const framework = getFramework(id)
    return framework
      ? NextResponse.json(framework)
      : NextResponse.json({ error: 'Framework not found' }, { status: 404 })
  }
  return NextResponse.json(getFrameworks())
}

function handleRoles(id: string | null, query: string | null, _searchParams: URLSearchParams): NextResponse {
  if (query) {
    const intent = matchIntent(query)
    const bestRole = getBestAgentForIntent(intent.intent)
    return NextResponse.json({ intent, bestRole })
  }
  return NextResponse.json(getAgentRoles())
}

function handleIntent(id: string | null, query: string | null, _searchParams: URLSearchParams): NextResponse {
  void id
  if (!query) return NextResponse.json({ intents: getIntentTypes() })
  return NextResponse.json(matchIntent(query))
}

function handleScore(id: string | null, query: string | null, _searchParams: URLSearchParams): NextResponse {
  void id
  if (!query) return NextResponse.json({ error: 'query parameter required' }, { status: 400 })
  return NextResponse.json(scorePrompt(query))
}

function handleQuickScore(id: string | null, query: string | null, _searchParams: URLSearchParams): NextResponse {
  void id
  if (!query) return NextResponse.json({ error: 'query parameter required' }, { status: 400 })
  return NextResponse.json({ score: quickScore(query) })
}

function handleBenchmark(id: string | null, query: string | null, searchParams: URLSearchParams): NextResponse {
  void id
  if (!query) return NextResponse.json({ error: 'query parameter required' }, { status: 400 })
  const quick = searchParams.get('quick') === 'true'
  const result = quick ? quickBenchmark(query) : runBenchmark(query)
  return NextResponse.json(result)
}

function handleFlows(id: string | null, _query: string | null, _searchParams: URLSearchParams): NextResponse {
  if (id) {
    const flow = getFlowTemplate(id)
    return flow
      ? NextResponse.json(flow)
      : NextResponse.json({ error: 'Flow not found' }, { status: 404 })
  }
  return NextResponse.json(getFlowTemplates())
}

function handleInstructions(id: string | null, query: string | null, _searchParams: URLSearchParams): NextResponse {
  if (id) {
    const content = getInstructionContent(id)
    return content
      ? NextResponse.json({ id, content })
      : NextResponse.json({ error: 'Instruction not found' }, { status: 404 })
  }
  if (query) return NextResponse.json(searchInstructions(query))
  return NextResponse.json({ ids: getInstructionIds() })
}

function handleApplyFormula(id: string | null, _query: string | null, searchParams: URLSearchParams): NextResponse {
  if (!id) return NextResponse.json({ error: 'id parameter required' }, { status: 400 })
  const varsParam = searchParams.get('vars')
  if (!varsParam) return NextResponse.json({ error: 'vars parameter required (JSON)' }, { status: 400 })
  try {
    const vars = JSON.parse(varsParam)
    const result = applyFormula(id, vars)
    return result
      ? NextResponse.json({ result })
      : NextResponse.json({ error: 'Formula not found' }, { status: 404 })
  } catch {
    return NextResponse.json({ error: 'Invalid vars JSON' }, { status: 400 })
  }
}

const sectionHandlers: Record<string, SectionHandler> = {
  formulas: handleFormulas,
  patterns: handlePatterns,
  techniques: handleTechniques,
  frameworks: handleFrameworks,
  roles: handleRoles,
  intent: handleIntent,
  score: handleScore,
  'quick-score': handleQuickScore,
  benchmark: handleBenchmark,
  flows: handleFlows,
  instructions: handleInstructions,
  'apply-formula': handleApplyFormula,
}

export function handlePromptingSection(
  section: string | null,
  id: string | null,
  query: string | null,
  searchParams: URLSearchParams,
): NextResponse {
  if (!section || !(section in sectionHandlers)) {
    return NextResponse.json({
      sections: [...AVAILABLE_SECTIONS],
      usage: '?section=<name>&id=<optional>&query=<optional>',
    })
  }
  return sectionHandlers[section](id, query, searchParams)
}