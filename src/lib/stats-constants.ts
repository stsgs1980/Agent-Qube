/**
 * Stats Dashboard Constants
 * Role groups, status config, and known formulas for the stats API.
 */

// ─── Role Group Configuration ──────────────────────────────────────────────────

export const ROLE_GROUP_CONFIG: Record<string, {
  label: string
  color: string
  colorRgb: string
  description: string
}> = {
  'Strategy': {
    label: 'Strategy',
    color: '#67E8F9',
    colorRgb: '103,232,249',
    description: 'Strategic planning, analysis, vision',
  },
  'Tactics': {
    label: 'Tactics',
    color: '#22D3EE',
    colorRgb: '34,211,238',
    description: 'Coordination, planning, communication',
  },
  'Control': {
    label: 'Control',
    color: '#06B6D4',
    colorRgb: '6,182,212',
    description: 'Quality, evaluation, safety',
  },
  'Execution': {
    label: 'Execution',
    color: '#0891B2',
    colorRgb: '8,145,178',
    description: 'Task execution, coding, testing',
  },
  'Memory': {
    label: 'Memory',
    color: '#0E7490',
    colorRgb: '14,116,144',
    description: 'Knowledge base, RAG, context management',
  },
  'Monitoring': {
    label: 'Monitoring',
    color: '#155E75',
    colorRgb: '21,94,117',
    description: 'Observation, alerting, diagnostics',
  },
  'Communication': {
    label: 'Comms',
    color: '#164E63',
    colorRgb: '22,78,99',
    description: 'Inter-agent messaging, routing, protocol translation',
  },
  'Learning': {
    label: 'Learning',
    color: '#0C4A6E',
    colorRgb: '12,74,110',
    description: 'Fine-tuning, feedback loops, skill acquisition',
  },
}

export const ROLE_GROUP_ORDER = [
  'Strategy',
  'Tactics',
  'Control',
  'Execution',
  'Memory',
  'Monitoring',
  'Communication',
  'Learning',
]

// Status colors matching the dashboard design
export const STATUS_CONFIG: { label: string; status: string; color: string }[] = [
  { label: 'Active', status: 'active', color: '#22D3EE' },
  { label: 'Idle', status: 'idle', color: '#64748B' },
  { label: 'Paused', status: 'paused', color: '#EAB308' },
  { label: 'Standby', status: 'standby', color: '#818CF8' },
  { label: 'Error', status: 'error', color: '#F43F5E' },
  { label: 'Offline', status: 'offline', color: '#3F3F46' },
]

// Total known cognitive formulas across all categories
export const ALL_KNOWN_FORMULAS = [
  'CoT', 'ToT', 'GoT', 'AoT', 'SoT',
  'CoVe', 'Reflexion', 'SelfConsistency', 'SelfRefine',
  'ReWOO', 'ReAct', 'PromptChaining', 'PlanAndSolve', 'StepBack', 'LeastToMost',
  'MoA', 'LATS', 'PoT', 'DSPy', 'MetaCoT',
]
