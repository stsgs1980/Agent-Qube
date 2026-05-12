/**
 * @stsgs/prompting -- Barrel Export
 * Complete prompting library for AI-assisted development.
 *
 * 18 files across 4 modules:
 *   core/        -- types, techniques, frameworks, system-prompt
 *   templates/   -- intent-templates, agent-templates, flow-templates
 *   evaluation/  -- scoring, blind-compare, benchmark
 *   agents/      -- cognitive-formulas, orchestration, resilience
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

// ─── Resilience (retry, circuit breaker, timeout) ───────────
export {
  withRetry,
  CircuitBreaker,
  withTimeout,
  withResilience,
} from './agents/resilience'
