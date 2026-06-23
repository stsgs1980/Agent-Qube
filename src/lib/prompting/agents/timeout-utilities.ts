/**
 * @stsgs/prompting -- Timeout, Debounce, Throttle, Fallback, Bulkhead
 * Utility patterns for robust AI agent interactions.
 */

import type { ResilienceResult } from '../core/types'

// ─── Timeout ─────────────────────────────────────────────────

/**
 * Execute a function with a timeout. Rejects if the function
 * takes longer than the specified duration.
 */
export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number
): Promise<ResilienceResult<T>> {
  const startTime = Date.now()

  return new Promise<ResilienceResult<T>>(resolve => {
    let settled = false

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true
        resolve({
          success: false,
          data: null,
          attempts: 1,
          totalDuration: Date.now() - startTime,
          errors: [`Timeout after ${timeoutMs}ms`],
          circuitState: { state: 'closed', failures: 1, successes: 0, lastFailure: Date.now(), nextRetry: null },
        })
      }
    }, timeoutMs)

    fn()
      .then(data => {
        if (!settled) {
          settled = true
          clearTimeout(timer)
          resolve({
            success: true,
            data,
            attempts: 1,
            totalDuration: Date.now() - startTime,
            errors: [],
            circuitState: { state: 'closed', failures: 0, successes: 1, lastFailure: null, nextRetry: null },
          })
        }
      })
      .catch(err => {
        if (!settled) {
          settled = true
          clearTimeout(timer)
          resolve({
            success: false,
            data: null,
            attempts: 1,
            totalDuration: Date.now() - startTime,
            errors: [err instanceof Error ? err.message : String(err)],
            circuitState: { state: 'closed', failures: 1, successes: 0, lastFailure: Date.now(), nextRetry: null },
          })
        }
      })
  })
}

// ─── Debounce ───────────────────────────────────────────────

/**
 * Debounce: delay execution until `delay` ms of inactivity.
 * Useful for live-preview / auto-save scenarios.
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// ─── Throttle ────────────────────────────────────────────────

/**
 * Throttle: execute at most once per `limit` ms window.
 * Useful for rate-limited API calls.
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args)
      inThrottle = true
      setTimeout(() => { inThrottle = false }, limit)
    }
  }
}

// ─── Fallback ────────────────────────────────────────────────

/**
 * Fallback: try `primary`, on failure invoke `secondary`.
 * Optionally pass a `condition` to control when fallback is used.
 */
export async function fallback<T>(
  primary: () => Promise<T>,
  secondary: () => Promise<T>,
  condition: (error: Error) => boolean = () => true
): Promise<T> {
  try {
    return await primary()
  } catch (error) {
    if (error instanceof Error && condition(error)) {
      return await secondary()
    }
    throw error
  }
}

// ─── Bulkhead ────────────────────────────────────────────────

/**
 * Bulkhead: limit concurrent executions to `concurrency`.
 * Excess calls are queued and executed FIFO.
 */
export function bulkhead(concurrency: number) {
  let running = 0
  const queue: Array<() => void> = []

  return async function <T>(fn: () => Promise<T>): Promise<T> {
    if (running >= concurrency) {
      await new Promise<void>(resolve => queue.push(resolve))
    }
    running++
    try {
      return await fn()
    } finally {
      running--
      if (queue.length > 0) {
        const next = queue.shift()!
        next()
      }
    }
  }
}
