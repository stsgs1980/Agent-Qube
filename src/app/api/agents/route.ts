import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

import {
  getCognitiveFormula,
  matchIntent,
  getBestAgentForIntent,
  buildMinimalSystemPrompt,
} from '@/lib/prompting'

export async function GET() {
  try {
    const agents = await db.agent.findMany({
      include: { children: true, tasks: true },
      orderBy: { createdAt: 'asc' }
    })
    return NextResponse.json(agents)
  } catch (error) {
    console.error('Failed to fetch agents:', error)
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // ── Prompting integration: auto-suggest formula and role ──
    let promptingMeta: Record<string, unknown> = {}
    if (body.description || body.role) {
      try {
        const intentText = `${body.role || ''} ${body.description || ''}`.trim()
        const intentMatch = matchIntent(intentText)
        const bestRole = getBestAgentForIntent(intentMatch.intent)

        promptingMeta = {
          intentMatch: {
            intent: intentMatch.intent,
            confidence: intentMatch.confidence,
            keywords: intentMatch.keywords,
          },
          suggestedRole: bestRole
            ? { id: bestRole.id, name: bestRole.name, temperature: bestRole.temperature }
            : null,
        }
      } catch {
        // Prompting integration is optional, don't block agent creation
      }
    }

    // Generate a minimal system prompt for the agent based on its role
    let generatedSystemPrompt: string | null = null
    if (body.role) {
      try {
        generatedSystemPrompt = buildMinimalSystemPrompt(body.role, 'markdown')
      } catch {
        // System prompt generation is optional
      }
    }

    // Resolve cognitive formula metadata
    let formulaMeta: Record<string, unknown> | null = null
    if (body.formula) {
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
      const pfId = formulaIdMap[body.formula] || 'cf-first-principles'
      const cf = getCognitiveFormula(pfId)
      if (cf) {
        formulaMeta = { id: cf.id, name: cf.name, category: cf.category, description: cf.description }
      }
    }

    const agent = await db.agent.create({
      data: {
        name: body.name,
        role: body.role,
        roleGroup: body.roleGroup,
        status: body.status || 'active',
        formula: body.formula,
        parentId: body.parentId || null,
        twinId: body.twinId || null,
        skills: body.skills || '',
        description: body.description || '',
        avatar: body.avatar || '',
      }
    })

    return NextResponse.json({
      ...agent,
      prompting: {
        ...promptingMeta,
        formulaMeta,
        generatedSystemPrompt,
      },
    }, { status: 201 })
  } catch (error) {
    console.error('Failed to create agent:', error)
    return NextResponse.json({ error: 'Failed to create agent' }, { status: 500 })
  }
}
