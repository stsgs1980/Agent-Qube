# Task: Connect @stsgs/prompting to Real API Endpoints

**Task ID**: connect-prompting-to-api
**Agent**: code-agent
**Date**: 2026-03-04

## Summary

Examined the `@stsgs/prompting` library and its connection to API endpoints via `z-ai-web-dev-sdk`. Found and fixed a critical resilience composition bug that prevented retries and circuit breakers from functioning.

## Current Connection Status (Pre-Fix)

### SDK Installation
- **`z-ai-web-dev-sdk` v0.0.17** — ✅ Already installed in `package.json`

### API Routes Using SDK
- **`/api/interpret-prompt`** — ✅ Already using `ZAI.create()` singleton + `zai.chat.completions.create()`
- **`/api/workflows/execute-llm`** — ✅ Already using `ZAI.create()` singleton + `zai.chat.completions.create()`
- **`/api/workflows/execute`** — Uses simulated execution (intentional, separate endpoint)

### @stsgs/prompting Integration Points
- `matchIntent()` from `templates/intent-templates` → used in `interpret-prompt/prompts.ts`
- `buildSystemPrompt()` from `core/system-prompt` → used in `execute-llm/helpers.ts`
- `applyFormula()` from `agents/cognitive-formulas` → used in `execute-llm/helpers.ts`
- `scorePrompt()` from `evaluation/scoring` → used in both routes
- `getInstructionContent()` from `instructions` → used in both routes
- `withRetry`, `withTimeout`, `CircuitBreaker` from `agents/resilience` → used in both routes

## Bug Found: Nested ResilienceResult Objects

### Problem
Both routes composed resilience utilities incorrectly:

```typescript
// BROKEN: withTimeout returns ResilienceResult<T>, not T
const result = await circuitBreaker.execute(() =>
  withRetry(() =>
    withTimeout(async () => { ... return content }, 30000),
    { maxAttempts: 2, baseDelay: 1000 }
  )
)
// result.data is ResilienceResult<ResilienceResult<string>>, NOT string!
```

This caused:
1. **Retries never triggered** — `withTimeout` catches errors and returns `{success: false}` instead of throwing, so `withRetry` never sees an error to retry on
2. **Circuit breaker never opened** — the inner function always resolves (never throws), so the circuit breaker always records success
3. **Result data was wrong type** — `result.data` was a nested `ResilienceResult` object instead of a string, causing `parseAndValidate()` to receive an object instead of a string

### Fix
Replaced the nested composition with a proper pattern:

```typescript
// FIXED: withTimeoutThrow throws on timeout (compatible with retry)
const circuitResult = await circuitBreaker.execute(async () => {
  const retryResult = await withRetry(
    () => withTimeoutThrow(async () => { ... return content }, 30000),
    { maxAttempts: 2, baseDelay: 1000 }
  )
  // Unwrap retry result — throw if failed so circuit breaker tracks it
  if (!retryResult.success) throw new Error(retryResult.errors.join('; '))
  return retryResult.data!
})
const llmResponse: string = circuitResult.data!
```

Key changes:
- Created `withTimeoutThrow()` helper that throws on timeout instead of returning `ResilienceResult`
- Unwrap `withRetry` result before returning to circuit breaker (throw on failure)
- Properly typed `llmResponse` as `string` (not nested objects)

## Files Modified
1. `src/app/api/interpret-prompt/route.ts` — Fixed resilience composition
2. `src/app/api/workflows/execute-llm/helpers.ts` — Fixed resilience composition

## Verification
- ✅ Lint passes on all modified files (0 errors)
- ✅ Lint passes on entire prompting library (0 errors)
- ✅ Dev server starts and responds 200
- ✅ `POST /api/interpret-prompt` returns valid JSON with `success: true`
- ✅ LLM correctly classifies intents (dashboard → dashboard-app, ecommerce → ecommerce, admin → admin-panel)
- ✅ Prompt quality scoring works
- ✅ No client-side code modified
- ✅ SDK used only in backend (API routes)

## SDK Usage Pattern Confirmed
The `z-ai-web-dev-sdk` uses `assistant` role for system-like prompts (not `system`), which matches the SDK's demo pattern in `skills/LLM/scripts/chat.ts`. This is correct for this SDK.
