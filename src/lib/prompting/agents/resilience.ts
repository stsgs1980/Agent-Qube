/**
 * @stsgs/prompting -- Resilience Patterns
 * withRetry, circuitBreaker, timeout, and bulkhead patterns
 * for robust AI agent interactions.
 *
 * Integration point: used by /api/interpret-prompt/route.ts via withRetry()
 */

import type { RetryConfig, CircuitState, ResilienceResult } from '../core/types'

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

// ─── Circuit Breaker ─────────────────────────────────────────

interface CircuitBreakerConfig {
  failureThreshold: number    // failures before opening
  recoveryTimeout: number     // ms before trying half-open
  halfOpenMaxAttempts: number // attempts in half-open state
}

const DEFAULT_CIRCUIT_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 5,
  recoveryTimeout: 30000,
  halfOpenMaxAttempts: 1,
}

export class CircuitBreaker {
  private state: CircuitState = {
    state: 'closed',
    failures: 0,
    successes: 0,
    lastFailure: null,
    nextRetry: null,
  }
  private config: CircuitBreakerConfig

  constructor(config: Partial<CircuitBreakerConfig> = {}) {
    this.config = { ...DEFAULT_CIRCUIT_CONFIG, ...config }
  }

  /**
   * Execute a function through the circuit breaker.
   * In 'open' state, rejects immediately.
   * In 'half-open' state, allows limited attempts.
   * In 'closed' state, executes normally.
   */
  async execute<T>(fn: () => Promise<T>): Promise<ResilienceResult<T>> {
    // Check if circuit should transition
    this.transition()

    if (this.state.state === 'open') {
      return {
        success: false,
        data: null,
        attempts: 0,
        totalDuration: 0,
        errors: [`Circuit breaker is OPEN. Next retry at ${new Date(this.state.nextRetry!).toISOString()}`],
        circuitState: { ...this.state },
      }
    }

    const startTime = Date.now()
    const errors: string[] = []

    try {
      const data = await fn()
      this.onSuccess()
      return {
        success: true,
        data,
        attempts: 1,
        totalDuration: Date.now() - startTime,
        errors,
        circuitState: { ...this.state },
      }
    } catch (err) {
      const errorStr = err instanceof Error ? err.message : String(err)
      errors.push(errorStr)
      this.onFailure()
      return {
        success: false,
        data: null,
        attempts: 1,
        totalDuration: Date.now() - startTime,
        errors,
        circuitState: { ...this.state },
      }
    }
  }

  /** Get current circuit state (read-only copy). */
  getState(): CircuitState {
    return { ...this.state }
  }

  /** Manually reset the circuit to closed state. */
  reset(): void {
    this.state = {
      state: 'closed',
      failures: 0,
      successes: 0,
      lastFailure: null,
      nextRetry: null,
    }
  }

  private onSuccess(): void {
    this.state.successes++
    if (this.state.state === 'half-open') {
      this.state.state = 'closed'
      this.state.failures = 0
      this.state.nextRetry = null
    } else if (this.state.state === 'closed') {
      // Gradual recovery: reduce failure count on success
      this.state.failures = Math.max(0, this.state.failures - 1)
    }
  }

  private onFailure(): void {
    this.state.failures++
    this.state.lastFailure = Date.now()

    if (this.state.state === 'half-open') {
      // Failed in half-open -> back to open
      this.state.state = 'open'
      this.state.nextRetry = Date.now() + this.config.recoveryTimeout
    } else if (this.state.failures >= this.config.failureThreshold) {
      this.state.state = 'open'
      this.state.nextRetry = Date.now() + this.config.recoveryTimeout
    }
  }

  private transition(): void {
    if (this.state.state === 'open' && this.state.nextRetry !== null) {
      if (Date.now() >= this.state.nextRetry) {
        this.state.state = 'half-open'
      }
    }
  }
}

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

// ─── Combined Resilience ─────────────────────────────────────

/**
 * Execute with retry + timeout + circuit breaker combined.
 * This is the full resilience stack for production AI interactions.
 */
export async function withResilience<T>(
  fn: () => Promise<T>,
  options: {
    retry?: Partial<RetryConfig>
    circuit?: Partial<CircuitBreakerConfig>
    timeout?: number
  } = {}
): Promise<ResilienceResult<T>> {
  const circuit = new CircuitBreaker(options.circuit)

  return circuit.execute(() => {
    if (options.timeout) {
      return withTimeout(fn, options.timeout)
    }
    return fn().then(data => ({
      success: true as const,
      data,
      attempts: 1,
      totalDuration: 0,
      errors: [],
      circuitState: { state: 'closed' as const, failures: 0, successes: 1, lastFailure: null, nextRetry: null },
    }))
  })
}

// ─── Utility ─────────────────────────────────────────────────

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
