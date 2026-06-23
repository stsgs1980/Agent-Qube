/**
 * @stsgs/prompting -- Circuit Breaker Pattern
 * Prevents cascading failures by tracking error rates and
 * opening the circuit when the failure threshold is exceeded.
 */

import type { CircuitState, ResilienceResult } from '../core/types'

// ─── Circuit Breaker ─────────────────────────────────────────

export interface CircuitBreakerConfig {
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

export { DEFAULT_CIRCUIT_CONFIG }
