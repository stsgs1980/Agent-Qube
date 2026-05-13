/**
 * P-MAS Resilience Layer — Extended with @stsgs/prompting
 *
 * Unified exports for the API resilience toolkit integrated from agent-toolkit.
 * Now also exports prompting resilience patterns (withRetry, CircuitBreaker, etc.)
 * alongside the existing P-MAS resilience modules.
 *
 * Usage:
 *   import { fetchWithRetry, CircuitBreaker, withPromptRetry, PromptCircuitBreaker } from '@/lib/resilience';
 */

// ─── Existing P-MAS resilience ──────────────────────────────
export { fetchWithRetry, defaultRetryConfig } from "./api-retry";
export type { RetryConfig } from "./api-retry";

export { CircuitBreaker, defaultCircuitBreakerConfig } from "./circuit-breaker";
export type { CircuitState, CircuitBreakerConfig } from "./circuit-breaker";

export {
  checkApiHealth,
  checkMultipleEndpoints,
  FailureTracker,
  ResponseTimeMonitor,
  defaultHealthMonitorConfig,
} from "./health-check";
export type { HealthCheckResult, HealthMonitorConfig } from "./health-check";

export { Provider, FallbackManager } from "./fallback-manager";
export type { ProviderConfig, ChatMessage, ChatOptions } from "./fallback-manager";

// ─── Prompting resilience (from @stsgs/prompting) ───────────
export {
  withRetry as withPromptRetry,
  withTimeout,
  withResilience,
  debounce,
  throttle,
  fallback,
  bulkhead,
} from './prompting/agents/resilience';

// Re-export prompting CircuitBreaker under a different name to avoid conflict
export { CircuitBreaker as PromptCircuitBreaker } from './prompting/agents/resilience';
