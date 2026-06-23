/**
 * @stsgs/prompting -- Barrel Export
 * Complete prompting library for AI-assisted development.
 *
 * 5 modules:
 *   core/           -- types, techniques (20), frameworks (11), system-prompt (5 layers)
 *   templates/      -- intent-templates (12), agent-templates (12), flow-templates (8)
 *   evaluation/     -- scoring (6 dims), blind-compare, benchmark (CORE-EEAT 40)
 *   agents/         -- cognitive-formulas (20), orchestration (12), resilience (8)
 *   instructions.ts -- behavioral rules (6) + ai-rules (4) with typed API
 */

// ─── Core ────────────────────────────────────────────────────
export type {
  PromptContext,
  PromptTone,
  OutputFormat,
  PromptBlock,
  SystemPromptLayer,
  PromptTechnique,
  TechniqueCategory,
  PromptFramework,
  FrameworkStep,
  IntentType,
  IntentMatch,
  AgentRole,
  FlowStep,
  FlowValidation,
  FlowTemplate,
  Grade,
  PromptScore,
  ScoreDimension,
  BlindCompareResult,
  BenchmarkResult,
  BenchmarkCheck,
  CognitiveFormula,
  CognitiveCategory,
  OrchestrationPattern,
  OrchestrationStep,
  RetryConfig,
  CircuitState,
  ResilienceResult,
} from './core/types'

// ─── Techniques (20) ────────────────────────────────────────
export {
  getTechniques,
  getTechnique,
  getTechniquesForFormat,
  getTechniquesByDifficulty,
  techniques,
} from './core/techniques'

// ─── Frameworks (11) ────────────────────────────────────────
export {
  getFrameworks,
  getFramework,
  getFrameworksByComplexity,
  buildFromFramework,
  frameworks,
} from './core/frameworks'

// ─── System Prompt Architect (5 layers) ─────────────────────
export {
  buildSystemPrompt,
  buildSystemPromptCustom,
  buildPromptBlocks,
  composeBlocks,
  buildMinimalSystemPrompt,
  validateContext,
} from './core/system-prompt'

// ─── Intent Templates (12 intents + matchIntent) ────────────
export {
  matchIntent,
  getIntentTypes,
  getIntentTemplate,
  INTENTS,
} from './templates/intent-templates'

// ─── Agent Templates (12 roles) ─────────────────────────────
export {
  getAgentRoles,
  getAgentRole,
  getBestAgentForIntent,
  getRoleSystemPrompt,
  agentRoles,
} from './templates/agent-templates'

// ─── Flow Templates (8 flows) ───────────────────────────────
export {
  getFlowTemplates,
  getFlowTemplate,
  getFlowStepPrompt,
  shouldContinueFlow,
  flowTemplates,
} from './templates/flow-templates'

// ─── Scoring (6 dimensions, S/A/B/C/D/F) ───────────────────
export {
  scorePrompt,
  quickScore,
  getScoreDimensions,
  estimateTokens,
  DIMENSIONS,
  numericToGrade,
} from './evaluation/scoring'

// ─── Blind Compare ─────────────────────────────────────────
export {
  blindCompare,
  rankPrompts,
  findWeakestLink,
} from './evaluation/blind-compare'

// ─── Benchmark (CORE-EEAT 40 checks) ───────────────────────
export {
  runBenchmark,
  quickBenchmark,
  getChecksByCategory,
  getBenchmarkCategories,
  CHECKS,
} from './evaluation/benchmark'

// ─── Cognitive Formulas (20) ────────────────────────────────
export {
  getCognitiveFormulas,
  getFormulasByCategory,
  getCognitiveFormula,
  applyFormula,
  getCognitiveCategories,
  formulas,
} from './agents/cognitive-formulas'

// ─── Orchestration Patterns (12) ────────────────────────────
export {
  getOrchestrationPatterns,
  getOrchestrationPattern,
  getPatternsByTopology,
  renderPatternSteps,
  patterns,
} from './agents/orchestration'

// ─── Instructions (6 behavioral + 4 architectural) ────────
export type {
  InstructionCategory,
  InstructionMeta,
  InstructionEntry,
} from './instructions'
export {
  getAllInstructions,
  getInstructionMeta,
  getInstruction,
  getInstructionContent,
  getInstructionsByCategory,
  searchInstructions,
  getInstructionIds,
  getAllInstructionContent,
  INSTRUCTIONS,
  AI_RULES,
} from './instructions'

// ─── Resilience (retry, circuit breaker, timeout, debounce, throttle, fallback, bulkhead) ───
export {
  withRetry,
  CircuitBreaker,
  withTimeout,
  withResilience,
  debounce,
  throttle,
  fallback,
  bulkhead,
} from './agents/resilience'
