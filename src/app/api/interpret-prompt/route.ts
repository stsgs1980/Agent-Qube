import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { withRetry, CircuitBreaker } from '@/lib/prompting'
import { buildEnhancedSystemPrompt, evaluatePromptQuality, parseAndValidate } from './prompts'

// ─── ZAI singleton (server-side only) ─────────────────────────

let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null

async function getZAI() {
  if (!zaiInstance) zaiInstance = await ZAI.create()
  return zaiInstance
}

// ─── Circuit breaker for LLM calls ────────────────────────────

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

// ─── POST /api/interpret-prompt ───────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt } = body

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // ── 1. Build enhanced system prompt with intent + instructions ──
    const systemPrompt = buildEnhancedSystemPrompt(prompt.trim())

    // ── 2. Evaluate prompt quality (feedback for the user) ──
    const quality = evaluatePromptQuality(prompt.trim())

    // ── 3. Call LLM with resilience (retry + timeout + circuit breaker) ──
    //
    // Proper composition: timeout (throws) → retry (catches) → circuit
    // breaker (tracks failures). Previous version nested ResilienceResult
    // objects, causing retries and circuit breaker to never trigger.
    const zai = await getZAI()
    const circuitResult = await interpretCircuit.execute(async () => {
      const retryResult = await withRetry(
        () => withTimeoutThrow(async () => {
          const completion = await zai.chat.completions.create({
            messages: [
              { role: 'assistant', content: systemPrompt },
              { role: 'user', content: prompt.trim() },
            ],
            thinking: { type: 'disabled' },
          })
          const content = completion.choices[0]?.message?.content
          if (!content) throw new Error('Empty LLM response')
          return content
        }, 30000),
        { maxAttempts: 2, baseDelay: 1000 }
      )

      // Unwrap retry result — throw if failed so circuit breaker
      // correctly registers the failure and can open the circuit.
      if (!retryResult.success) {
        throw new Error(retryResult.errors.join('; '))
      }
      return retryResult.data!
    })

    if (!circuitResult.success) {
      return NextResponse.json(
        { error: 'LLM call failed', details: circuitResult.errors.join('; ') },
        { status: 502 }
      )
    }

    const llmResponse: string = circuitResult.data!

    // ── 4. Parse and validate response ──
    try {
      const parsed = parseAndValidate(llmResponse)

      return NextResponse.json({
        success: true,
        source: 'llm',
        result: parsed,
        promptQuality: quality,
      })
    } catch {
      return NextResponse.json({
        success: false,
        error: 'Failed to parse AI response as JSON',
        raw: llmResponse,
        promptQuality: quality,
      })
    }
  } catch (error) {
    console.error('Interpret prompt error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
