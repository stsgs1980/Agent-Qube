import ZAI from 'z-ai-web-dev-sdk'
import {
  buildSystemPrompt,
  applyFormula,
  scorePrompt,
  getInstructionContent,
  withRetry,
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

// ─── Build agent system prompt with cognitive formula + instructions ─

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

  // Inject architectural instructions for better LLM behavior
  const coreRules = getInstructionContent('ai-rules-core')
  const enforcementRules = getInstructionContent('ai-rules-enforcement')
  let instructionsBlock = ''
  if (coreRules) {
    instructionsBlock += '\n\n## Architecture Rules\n' + coreRules
  }
  if (enforcementRules) {
    instructionsBlock += '\n\n## Code Enforcement\n' + enforcementRules
  }

  return applied
    ? `${base}${instructionsBlock}\n\n## Cognitive Framework\n${applied}`
    : `${base}${instructionsBlock}`
}

// ─── Score prompt before sending to LLM ───────────────────────

export function evaluatePromptBeforeCall(systemPrompt: string, userPrompt: string): {
  score: number
  grade: string
  shouldProceed: boolean
  suggestions: string[]
} {
  const sysResult = scorePrompt(systemPrompt)
  const userResult = scorePrompt(userPrompt)
  const combined = Math.round((sysResult.numeric * 0.6) + (userResult.numeric * 0.4))
  const grade = sysResult.overall

  // Don't send prompts below D grade
  const shouldProceed = combined >= 25

  return {
    score: combined,
    grade,
    shouldProceed,
    suggestions: [...sysResult.suggestions, ...userResult.suggestions].slice(0, 5),
  }
}

// ─── Timeout helper (throws on timeout, compatible with retry) ──

function withTimeoutThrow<T>(fn: () => Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    fn()
      .then(result => { clearTimeout(timer); resolve(result) })
      .catch(err => { clearTimeout(timer); reject(err) })
  })
}

// ─── Call LLM with resilience ─────────────────────────────────
//
// Properly composes: timeout (throws) → retry (catches throws) →
// circuit breaker (tracks successes/failures).
// Previous version nested ResilienceResult objects, causing retries
// and circuit breaker to never trigger.

export async function callLLM(systemPrompt: string, userPrompt: string): Promise<string> {
  // Evaluate prompt quality before calling
  const eval_ = evaluatePromptBeforeCall(systemPrompt, userPrompt)
  if (!eval_.shouldProceed) {
    throw new Error(`Prompt quality too low (score: ${eval_.score}, grade: ${eval_.grade}). Suggestions: ${eval_.suggestions.join('; ')}`)
  }

  const zai = await getZAI()

  // Circuit breaker wraps the entire retry+timeout stack.
  // On final failure, the retry result is unwrapped and thrown
  // so the circuit breaker correctly tracks failures.
  const circuitResult = await llmCircuit.execute(async () => {
    const retryResult = await withRetry(
      () => withTimeoutThrow(async () => {
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

    // Unwrap retry result — throw if failed so circuit breaker
    // correctly registers the failure and can open the circuit.
    if (!retryResult.success) {
      throw new Error(retryResult.errors.join('; '))
    }
    return retryResult.data!
  })

  if (!circuitResult.success) {
    throw new Error(circuitResult.errors.join('; '))
  }
  return circuitResult.data!
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
