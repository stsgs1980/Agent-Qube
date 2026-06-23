import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

import {
  getCognitiveFormula,
  applyFormula,
  matchIntent,
  getBestAgentForIntent,
  buildSystemPrompt,
  type PromptContext,
} from '@/lib/prompting'

/**
 * POST /api/agents/prompt
 *
 * Generate a system prompt for a given agent using the @stsgs/prompting library.
 * Links the agent's cognitive formula (CoT, ToT, etc.) with prompting templates.
 *
 * Body: { agentId: string } | { formula: string, role: string, roleGroup: string, description: string }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Resolve agent data
    let formula: string
    let role: string
    let roleGroup: string
    let description: string
    let name: string

    if (body.agentId) {
      const agent = await db.agent.findUnique({ where: { id: body.agentId } })
      if (!agent) {
        return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
      }
      formula = agent.formula
      role = agent.role
      roleGroup = agent.roleGroup
      description = agent.description
      name = agent.name
    } else {
      formula = body.formula || 'CoT'
      role = body.role || 'Agent'
      roleGroup = body.roleGroup || 'Execution'
      description = body.description || ''
      name = body.name || 'Agent'
    }

    // ── 1. Build system prompt using 5-layer architecture ──
    const ctx: PromptContext = {
      role,
      domain: roleGroup,
      audience: 'developer',
      tone: 'technical',
      language: 'English',
      constraints: [
        `Cognitive formula: ${formula}`,
        description ? `Specialization: ${description}` : '',
      ].filter(Boolean),
      outputFormat: 'markdown',
    }
    const systemPrompt = buildSystemPrompt(ctx)

    // ── 2. Resolve cognitive formula from prompting library ──
    // Map Agent Qube formula abbreviations to prompting library formula IDs
    const formulaIdMap: Record<string, string> = {
      CoT: 'cf-first-principles',
      ToT: 'cf-anchoring-break',
      GoT: 'cf-functional-decomposition',
      AoT: 'cf-abstraction-layers',
      SoT: 'cf-precision-drill',
      CoVe: 'cf-self-audit',
      Reflexion: 'cf-devils-advocate',
      SelfConsistency: 'cf-confirmation-discount',
      SelfRefine: 'cf-pre-mortem',
      ReWOO: 'cf-inversion',
      ReAct: 'cf-boundary-check',
      MoA: 'cf-stakeholder-map',
      LATS: 'cf-scamper',
      PoT: 'cf-precision-drill',
      DSPy: 'cf-meta-prompting',
      PromptChaining: 'cf-functional-decomposition',
      LeastToMost: 'cf-accumulation-register',
      StepBack: 'cf-time-machine',
      PlanAndSolve: 'cf-pre-mortem',
      MetaCoT: 'cf-devils-advocate',
    }

    const promptingFormulaId = formulaIdMap[formula] || 'cf-first-principles'
    const cognitiveFormula = getCognitiveFormula(promptingFormulaId)

    // ── 3. Match intent for best agent role ──
    const intentMatch = description ? matchIntent(description) : null
    const bestRole = intentMatch ? getBestAgentForIntent(intentMatch.intent) : null

    // ── 4. Apply formula template with agent-specific vars ──
    const formulaTemplate = cognitiveFormula
      ? applyFormula(promptingFormulaId, {
          topic: role,
          problem: description || role,
          goal: description || role,
          project: name,
          decision: description || role,
          system: name,
          deliverable: 'solution',
        })
      : null

    return NextResponse.json({
      agent: { name, formula, role, roleGroup, description },
      systemPrompt,
      cognitiveFormula: cognitiveFormula
        ? { id: cognitiveFormula.id, name: cognitiveFormula.name, category: cognitiveFormula.category }
        : null,
      formulaTemplate,
      intentMatch: intentMatch
        ? { intent: intentMatch.intent, confidence: intentMatch.confidence, keywords: intentMatch.keywords }
        : null,
      bestAgentRole: bestRole
        ? { id: bestRole.id, name: bestRole.name, temperature: bestRole.temperature }
        : null,
    })
  } catch (error) {
    console.error('Agent prompt generation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
