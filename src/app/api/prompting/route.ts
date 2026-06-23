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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')
    const id = searchParams.get('id')
    const query = searchParams.get('query')

    switch (section) {
      // ── Cognitive Formulas ────────────────────────────────
      case 'formulas': {
        if (id) {
          const formula = getCognitiveFormula(id)
          return formula
            ? NextResponse.json(formula)
            : NextResponse.json({ error: 'Formula not found' }, { status: 404 })
        }
        const category = searchParams.get('category') as Parameters<typeof getFormulasByCategory>[0] | null
        const formulas = category ? getFormulasByCategory(category) : getCognitiveFormulas()
        return NextResponse.json({
          formulas,
          categories: getCognitiveCategories(),
        })
      }

      // ── Orchestration Patterns ────────────────────────────
      case 'patterns': {
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

      // ── Techniques ───────────────────────────────────────
      case 'techniques': {
        if (id) {
          const technique = getTechnique(id)
          return technique
            ? NextResponse.json(technique)
            : NextResponse.json({ error: 'Technique not found' }, { status: 404 })
        }
        const techniques = getTechniques()
        return NextResponse.json(techniques)
      }

      // ── Frameworks ───────────────────────────────────────
      case 'frameworks': {
        if (id) {
          const framework = getFramework(id)
          return framework
            ? NextResponse.json(framework)
            : NextResponse.json({ error: 'Framework not found' }, { status: 404 })
        }
        return NextResponse.json(getFrameworks())
      }

      // ── Agent Roles ──────────────────────────────────────
      case 'roles': {
        if (query) {
          const intent = matchIntent(query)
          const bestRole = getBestAgentForIntent(intent.intent)
          return NextResponse.json({ intent, bestRole })
        }
        return NextResponse.json(getAgentRoles())
      }

      // ── Intent Matching ──────────────────────────────────
      case 'intent': {
        if (!query) {
          return NextResponse.json({ intents: getIntentTypes() })
        }
        const match = matchIntent(query)
        return NextResponse.json(match)
      }

      // ── Scoring ──────────────────────────────────────────
      case 'score': {
        if (!query) {
          return NextResponse.json({ error: 'query parameter required' }, { status: 400 })
        }
        const score = scorePrompt(query)
        return NextResponse.json(score)
      }

      // ── Quick Score ──────────────────────────────────────
      case 'quick-score': {
        if (!query) {
          return NextResponse.json({ error: 'query parameter required' }, { status: 400 })
        }
        const score = quickScore(query)
        return NextResponse.json({ score })
      }

      // ── Benchmark ────────────────────────────────────────
      case 'benchmark': {
        if (!query) {
          return NextResponse.json({ error: 'query parameter required' }, { status: 400 })
        }
        const quick = searchParams.get('quick') === 'true'
        const result = quick ? quickBenchmark(query) : runBenchmark(query)
        return NextResponse.json(result)
      }

      // ── Flow Templates ───────────────────────────────────
      case 'flows': {
        if (id) {
          const flow = getFlowTemplate(id)
          return flow
            ? NextResponse.json(flow)
            : NextResponse.json({ error: 'Flow not found' }, { status: 404 })
        }
        return NextResponse.json(getFlowTemplates())
      }

      // ── Instructions ─────────────────────────────────────
      case 'instructions': {
        if (id) {
          const content = getInstructionContent(id)
          return content
            ? NextResponse.json({ id, content })
            : NextResponse.json({ error: 'Instruction not found' }, { status: 404 })
        }
        if (query) {
          return NextResponse.json(searchInstructions(query))
        }
        return NextResponse.json({ ids: getInstructionIds() })
      }

      // ── Apply Formula ────────────────────────────────────
      case 'apply-formula': {
        if (!id) {
          return NextResponse.json({ error: 'id parameter required' }, { status: 400 })
        }
        const varsParam = searchParams.get('vars')
        if (!varsParam) {
          return NextResponse.json({ error: 'vars parameter required (JSON)' }, { status: 400 })
        }
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

      default:
        return NextResponse.json({
          sections: [
            'formulas',
            'patterns',
            'techniques',
            'frameworks',
            'roles',
            'intent',
            'score',
            'quick-score',
            'benchmark',
            'flows',
            'instructions',
            'apply-formula',
          ],
          usage: '?section=<name>&id=<optional>&query=<optional>',
        })
    }
  } catch (error) {
    console.error('Prompting API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
