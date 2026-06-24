import ZAI from 'z-ai-web-dev-sdk'
import { withRetry, CircuitBreaker } from '@/lib/prompting'

// ─── ZAI singleton (server-side only) ─────────────────────────────────

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null

export async function getInterpretZAI() {
  if (!zaiInstance) zaiInstance = await ZAI.create()
  return zaiInstance
}

// ─── Circuit breaker ────────────────────────────────────────────────

const interpretCircuit = new CircuitBreaker({ failureThreshold: 5, recoveryTimeout: 30000 })

// ─── Timeout helper (throws on timeout, compatible with retry) ──

function withTimeoutThrow<T>(fn: () => Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    fn()
      .then(result => { clearTimeout(timer); resolve(result) })
      .catch(err => { clearTimeout(timer); reject(err) })
  })
}

// ─── Call LLM with resilience ───────────────────────────────────────

export async function callInterpretLLM(systemPrompt: string, userPrompt: string) {
  const zai = await getInterpretZAI()
  const circuitResult = await interpretCircuit.execute(async () => {
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
      }, 30000),
      { maxAttempts: 2, baseDelay: 1000 }
    )

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