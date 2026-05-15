import ZAI from 'z-ai-web-dev-sdk'
import {
  buildSystemPrompt,
  applyFormula,
  withRetry,
  withTimeout,
  CircuitBreaker,
  type PromptContext,
} from '@/lib/prompting'

// ─── ZAI singleton (server-side only) ─────────────────────────

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null

export async function getZAI() {
  if (!zaiInstance) zaiInstance = await ZAI.create()
  return zaiInstance
}

// ─── Formula ID mapping (mirrors /api/agents/prompt) ──────────

const FORMULA_MAP: Record<string, string> = {
  CoT: 'cf-first-principles', ToT: 'cf-anchoring-break',
  GoT: 'cf-functional-decomposition', AoT: 'cf-abstraction-layers',
  SoT: 'cf-precision-drill', CoVe: 'cf-self-audit',
  Reflexion: 'cf-devils-advocate', SelfConsistency: 'cf-confirmation-discount',
  SelfRefine: 'cf-pre-mortem', ReWOO: 'cf-inversion',
  ReAct: 'cf-boundary-check', MoA: 'cf-stakeholder-map',
  LATS: 'cf-scamper', PoT: 'cf-precision-drill',
  DSPy: 'cf-meta-prompting', PromptChaining: 'cf-functional-decomposition',
  LeastToMost: 'cf-accumulation-register', StepBack: 'cf-time-machine',
  PlanAndSolve: 'cf-pre-mortem', MetaCoT: 'cf-devils-advocate',
}

// ─── Circuit breaker for LLM calls ────────────────────────────

const llmCircuit = new CircuitBreaker({ failureThreshold: 5, recoveryTimeout: 30000 })

// ─── Build agent system prompt with cognitive formula ─────────

export function buildAgentSystemPrompt(agent: {
  name: string; role: string; roleGroup: string; description: string; formula: string
}): string {
  const ctx: PromptContext = {
    role: agent.role,
    domain: agent.roleGroup,
    audience: 'developer',
    tone: 'technical',
    language: 'English',
    constraints: [
      `Cognitive formula: ${agent.formula}`,
      agent.description ? `Specialization: ${agent.description}` : '',
    ].filter(Boolean),
    outputFormat: 'json',
  }
  const base = buildSystemPrompt(ctx)
  const formulaId = FORMULA_MAP[agent.formula] || 'cf-first-principles'
  const applied = applyFormula(formulaId, {
    topic: agent.role, problem: agent.description || agent.role,
    goal: agent.description || agent.role, project: agent.name,
    decision: agent.description || agent.role, system: agent.name,
    deliverable: 'structured output',
  })
  return applied ? `${base}\n\n## Cognitive Framework\n${applied}` : base
}

// ─── Call LLM with resilience ─────────────────────────────────

export async function callLLM(systemPrompt: string, userPrompt: string): Promise<string> {
  const zai = await getZAI()
  const result = await llmCircuit.execute(() =>
    withRetry(() =>
      withTimeout(async () => {
        const completion = await zai.chat.completions.create({
          messages: [
            { role: 'assistant', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          thinking: { type: 'disabled' },
        })
        const content = completion.choices[0]?.message?.content
        if (!content) throw new Error('Empty LLM response')
        return content
      }, 60000),
      { maxAttempts: 3, baseDelay: 1000 }
    )
  )
  if (!result.success) throw new Error(result.errors.join('; '))
  return result.data
}

// ─── Parse LLM JSON response ──────────────────────────────────

export function parseLLMOutput(raw: string, previousOutput: Record<string, unknown>): Record<string, unknown> {
  const jsonMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  const jsonStr = jsonMatch ? jsonMatch[1].trim() : raw
  try {
    return { ...previousOutput, ...JSON.parse(jsonStr) }
  } catch {
    return { ...previousOutput, _llmOutput: raw }
  }
}
