import type { LucideIcon } from 'lucide-react'

// ─── Core domain types ──────────────────────────────────────────────────────────

export interface AgentData {
  id: string
  name: string
  role: string
  roleGroup: string
  status: string
  formula: string
  parentId?: string | null
  twinId?: string | null
  skills: string
  description: string
  avatar: string
  children?: AgentData[]
  tasks?: unknown[]
}

export type EdgeType = 'command' | 'sync' | 'twin' | 'delegate' | 'supervise' | 'broadcast'

export type ViewMode = 'hierarchy' | 'radial' | 'grid'

export interface ConnectionData {
  id: string
  from: string
  to: string
  type: EdgeType
  strength?: number
}

export interface NodePosition {
  id: string
  x: number
  y: number
  width: number
  height: number
}

// ─── Role configuration ──────────────────────────────────────────────────────────

export const ROLE_CONFIG: Record<string, { color: string; colorRgb: string; label: string; level: number }> = {
  'Strategy':      { color: '#67E8F9', colorRgb: '103,232,249', label: 'Strategy',   level: 0 },
  'Tactics':        { color: '#22D3EE', colorRgb: '34,211,238',  label: 'Tactics',    level: 1 },
  'Control':       { color: '#06B6D4', colorRgb: '6,182,212',   label: 'Control',    level: 2 },
  'Execution':     { color: '#0891B2', colorRgb: '8,145,178',   label: 'Execution',  level: 3 },
  'Memory':         { color: '#0E7490', colorRgb: '14,116,144',  label: 'Memory',     level: 4 },
  'Monitoring':     { color: '#155E75', colorRgb: '21,94,117',   label: 'Monitoring', level: 4 },
  'Communication':   { color: '#164E63', colorRgb: '22,78,99',    label: 'Communication', level: 4 },
  'Learning':       { color: '#0C4A6E', colorRgb: '12,74,110',   label: 'Learning',   level: 4 },
}

export const ROLE_ORDER = ['Strategy', 'Tactics', 'Control', 'Execution', 'Memory', 'Monitoring', 'Communication', 'Learning']

export const STATUS_COLORS: Record<string, string> = {
  active: '#22D3EE',
  idle: '#6B7280',
  error: '#EF4444',
  offline: '#4B5563',
  paused: '#F59E0B',
  standby: '#8B5CF6',
}

export const EDGE_CONFIG: Record<EdgeType, { strokeDasharray: string; label: string; color: string; defaultVisible: boolean }> = {
  command:   { strokeDasharray: '',        label: 'Command',   color: '#22D3EE', defaultVisible: true },
  sync:      { strokeDasharray: '5 5',     label: 'Sync',     color: '#64748B', defaultVisible: true },
  twin:      { strokeDasharray: '8 4',     label: 'Twin',     color: '#0891B2', defaultVisible: true },
  delegate:  { strokeDasharray: '6 3',     label: 'Delegate', color: '#0891B2', defaultVisible: false },
  supervise: { strokeDasharray: '2 4',     label: 'Supervise',color: '#475569', defaultVisible: false },
  broadcast: { strokeDasharray: '12 4 2 4',label: 'Broadcast',color: '#0E7490', defaultVisible: false },
}

// ─── Formula descriptions ────────────────────────────────────────────────────────

export const FORMULA_DESC: Record<string, string> = {
  CoT: 'Chain of Thought — step-by-step reasoning decomposition',
  ToT: 'Tree of Thoughts — explores multiple reasoning paths',
  GoT: 'Graph of Thoughts — models reasoning as a directed graph',
  AoT: 'Algorithm of Thoughts — algorithmic reasoning via LLM',
  SoT: 'Skeleton of Thought — outline first, then fill details',
  CoVe: 'Chain of Verification — validates outputs with self-checks',
  ReWOO: 'Research without Observation — plans then executes',
  Reflexion: 'Self-reflection — learns from past mistakes',
  ReAct: 'Reasoning + Action — interleaves thought and action',
  MoA: 'Mixture of Agents — combines multiple agent outputs',
  SelfRefine: 'Self-Refine — iteratively improves its own output',
  LATS: 'Language Agent Tree Search — MCTS + LLM reasoning',
  SelfConsistency: 'Self-Consistency — multiple paths + majority vote',
  PoT: 'Program of Thought — reasons via code execution',
  DSPy: 'DSPy — Declarative Self-Improving Prompt Optimization',
  PromptChaining: 'Prompt Chaining — Sequential task decomposition',
  LeastToMost: 'Least-to-Most — Progressive complexity reasoning',
  StepBack: 'Step-Back — Abstract before solving',
  PlanAndSolve: 'Plan-and-Solve — Two-phase approach',
  MetaCoT: 'Meta-Co-T — Meta-reasoning over CoT',
}

// ─── Node data type for ReactFlow ────────────────────────────────────────────────

export interface AgentNodeData extends AgentData {
  isHighlighted?: boolean
  isDimmed?: boolean
  skillCount?: number
  taskCount?: number
  [key: string]: unknown
}
