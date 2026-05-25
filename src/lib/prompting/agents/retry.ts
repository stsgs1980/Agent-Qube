/**
 * @stsgs/prompting -- Retry with Exponential Backoff
 * Execute async functions with configurable retry and jitter.
 *
 * Integration point: used by /api/interpret-prompt/route.ts via withRetry()
 */

import type { RetryConfig, ResilienceResult } from '../core/types'

// ─── Retry with Exponential Backoff ──────────────────────────

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 30000,
  backoffMultiplier: 2,
  jitter: true,
  retryableErrors: ['ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', '502', '503', '504', '429', 'rate_limit', 'timeout', 'overloaded'],
}

/**
 * Execute an async function with exponential backoff retry.
 * Adds jitter to prevent thundering herd problems.
 *
 * @param fn - The async function to execute
 * @param config - Retry configuration (optional, uses defaults)
 * @returns ResilienceResult with the result or error details
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<ResilienceResult<T>> {
  const cfg = { ...DEFAULT_RETRY_CONFIG, ...config }
  const errors: string[] = []
  const startTime = Date.now()

  for (let attempt = 1; attempt <= cfg.maxAttempts; attempt++) {
    try {
      const data = await fn()
      return {
        success: true,
        data,
        attempts: attempt,
        totalDuration: Date.now() - startTime,
        errors,
        circuitState: { state: 'closed', failures: 0, successes: 1, lastFailure: null, nextRetry: null },
      }
    } catch (err) {
      const errorStr = err instanceof Error ? err.message : String(err)
      errors.push(`Attempt ${attempt}: ${errorStr}`)

      const isRetryable = cfg.retryableErrors.some(e => errorStr.toLowerCase().includes(e.toLowerCase()))

      if (attempt === cfg.maxAttempts || !isRetryable) {
        return {
          success: false,
          data: null,
          attempts: attempt,
          totalDuration: Date.now() - startTime,
          errors,
          circuitState: { state: 'closed', failures: attempt, successes: 0, lastFailure: Date.now(), nextRetry: null },
        }
      }

      // Calculate delay with exponential backoff + jitter
      const baseDelay = cfg.baseDelay * Math.pow(cfg.backoffMultiplier, attempt - 1)
      const clampedDelay = Math.min(baseDelay, cfg.maxDelay)
      const jitterAmount = cfg.jitter ? Math.random() * clampedDelay * 0.3 : 0
      const delay = clampedDelay + jitterAmount

      await sleep(delay)
    }
  }

  return {
    success: false,
    data: null,
    attempts: cfg.maxAttempts,
    totalDuration: Date.now() - startTime,
    errors: ['Max attempts reached'],
    circuitState: { state: 'closed', failures: cfg.maxAttempts, successes: 0, lastFailure: Date.now(), nextRetry: null },
  }
}

// ─── Utility ─────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export { DEFAULT_RETRY_CONFIG }
