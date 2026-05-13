import {
  Brain, Target, Shield, Zap, Database, Activity, Network, Sparkles,
  ArrowRight, ArrowLeftRight, Diamond, Eye, Megaphone, Workflow,
  Clock, CheckCircle2, ListChecks, RotateCcw, BookOpen,
} from 'lucide-react'

// ─── Role Groups ──────────────────────────────────────────────────────────────

export const ROLE_GROUPS = [
  { name: 'Стратегия', label: 'Strategy', color: '#67E8F9', colorRgb: '103,232,249', icon: Brain, agents: 3, activeAgents: 3, formulas: 'ToT, CoVe, GoT', desc: 'Strategic planning, analysis, vision', statusSummary: [{ color: '#22D3EE', label: '3 active' }] },
  { name: 'Тактика', label: 'Tactics', color: '#22D3EE', colorRgb: '34,211,238', icon: Target, agents: 3, activeAgents: 2, formulas: 'ReWOO, ReAct, SelfConsistency', desc: 'Coordination, planning, communication', statusSummary: [{ color: '#22D3EE', label: '2 active' }, { color: '#64748B', label: '1 idle' }] },
  { name: 'Контроль', label: 'Control', color: '#06B6D4', colorRgb: '6,182,212', icon: Shield, agents: 3, activeAgents: 3, formulas: 'Reflexion, CoVe, ReAct', desc: 'Quality, evaluation, safety', statusSummary: [{ color: '#22D3EE', label: '3 active' }] },
  { name: 'Исполнение', label: 'Execution', color: '#06B6D4', colorRgb: '6,182,212', icon: Zap, agents: 5, activeAgents: 4, formulas: 'ReAct, MoA, SelfRefine, PoT', desc: 'Task execution, coding, testing', statusSummary: [{ color: '#22D3EE', label: '4 active' }, { color: '#64748B', label: '1 idle' }] },
  { name: 'Память', label: 'Memory / Knowledge', color: '#0891B2', colorRgb: '8,145,178', icon: Database, agents: 3, activeAgents: 2, formulas: 'CoT, AoT, SoT', desc: 'Knowledge base, RAG, context management', statusSummary: [{ color: '#22D3EE', label: '2 active' }, { color: '#818CF8', label: '1 standby' }] },
  { name: 'Мониторинг', label: 'Monitoring', color: '#0E7490', colorRgb: '14,116,144', icon: Activity, agents: 3, activeAgents: 2, formulas: 'CoT, LATS, GoT', desc: 'Observation, alerting, diagnostics', statusSummary: [{ color: '#22D3EE', label: '2 active' }, { color: '#EAB308', label: '1 paused' }] },
  { name: 'Коммуникация', label: 'Communication', color: '#155E75', colorRgb: '21,94,117', icon: Network, agents: 3, activeAgents: 3, formulas: 'PromptChaining, StepBack, PlanAndSolve', desc: 'Inter-agent messaging, routing, protocol translation', statusSummary: [{ color: '#22D3EE', label: '3 active' }] },
  { name: 'Обучение', label: 'Learning / Training', color: '#164E63', colorRgb: '22,78,99', icon: Sparkles, agents: 3, activeAgents: 2, formulas: 'DSPy, MetaCoT, LeastToMost', desc: 'Fine-tuning, feedback loops, skill acquisition', statusSummary: [{ color: '#22D3EE', label: '2 active' }, { color: '#64748B', label: '1 idle' }] },
]

// ─── Formula Taxonomy ─────────────────────────────────────────────────────────

export const FORMULA_TAXONOMY = [
  {
    category: 'Foundational',
    formulas: [
      { name: 'CoT', full: 'Chain of Thought', color: '#999999' },
      { name: 'ToT', full: 'Tree of Thoughts', color: '#999999' },
      { name: 'GoT', full: 'Graph of Thoughts', color: '#999999' },
      { name: 'AoT', full: 'Algorithm of Thoughts', color: '#999999' },
      { name: 'SoT', full: 'Skeleton of Thought', color: '#999999' },
    ],
  },
  {
    category: 'Verification',
    formulas: [
      { name: 'CoVe', full: 'Chain of Verification', color: '#888888' },
      { name: 'Reflexion', full: 'Self-Reflection', color: '#888888' },
      { name: 'SelfConsistency', full: 'Self-Consistency', color: '#888888' },
      { name: 'SelfRefine', full: 'Self-Refine', color: '#888888' },
    ],
  },
  {
    category: 'Planning',
    formulas: [
      { name: 'ReWOO', full: 'Research w/o Observation', color: '#777777' },
      { name: 'ReAct', full: 'Reasoning + Action', color: '#777777' },
      { name: 'PromptChaining', full: 'Prompt Chaining', color: '#777777' },
      { name: 'PlanAndSolve', full: 'Plan-and-Solve', color: '#777777' },
      { name: 'StepBack', full: 'Step-Back Prompting', color: '#777777' },
      { name: 'LeastToMost', full: 'Least-to-Most', color: '#777777' },
    ],
  },
  {
    category: 'Advanced',
    formulas: [
      { name: 'MoA', full: 'Mixture of Agents', color: '#666666' },
      { name: 'LATS', full: 'Lang Agent Tree Search', color: '#666666' },
      { name: 'PoT', full: 'Program of Thought', color: '#666666' },
      { name: 'DSPy', full: 'Declarative Self-Improving', color: '#666666' },
      { name: 'MetaCoT', full: 'Meta Chain of Thought', color: '#666666' },
    ],
  },
]

// ─── Edge Types ───────────────────────────────────────────────────────────────

export const EDGE_TYPES = [
  { name: 'Command', desc: 'Parent to child directive', color: '#06B6D4', style: 'solid', icon: ArrowRight },
  { name: 'Sync', desc: 'Peer synchronization', color: '#64748B', style: 'dotted', icon: ArrowLeftRight },
  { name: 'Twin', desc: 'Mirror agent link', color: '#22D3EE', style: 'dashed', icon: Diamond },
  { name: 'Delegate', desc: 'Task delegation', color: '#0891B2', style: 'dash-dot', icon: Workflow },
  { name: 'Supervise', desc: 'Oversight feedback', color: '#475569', style: 'fine dot', icon: Eye },
  { name: 'Broadcast', desc: 'One-to-many signal', color: '#0E7490', style: 'long dash', icon: Megaphone },
]

// ─── Quick Stats ──────────────────────────────────────────────────────────────

export const QUICK_STATS = [
  { label: 'Total Agents', value: '26', numericValue: 26, color: '#06B6D4', colorRgb: '6,182,212' },
  { label: 'Role Groups', value: '8', numericValue: 8, color: '#0891B2', colorRgb: '8,145,178' },
  { label: 'Cognitive Formulas', value: '20', numericValue: 20, color: '#6B7280', colorRgb: '107,114,128' },
  { label: 'Edge Types', value: '6', numericValue: 6, color: '#475569', colorRgb: '71,85,105' },
  { label: 'Active Agents', value: '21', numericValue: 21, color: '#06B6D4', colorRgb: '6,182,212' },
  { label: 'Idle Agents', value: '3', numericValue: 3, color: '#6B7280', colorRgb: '107,114,128' },
  { label: 'Tasks', value: '26', numericValue: 26, color: '#22D3EE', colorRgb: '34,211,238' },
  { label: 'Formulas Coverage', value: '100%', numericValue: 100, color: '#0891B2', colorRgb: '8,145,178' },
]

// ─── Activity Events ──────────────────────────────────────────────────────────

export const ACTIVITY_EVENTS = [
  { time: '2s ago', agent: 'Gateway', group: 'Коммуникация', desc: 'routed task to Executor-A' },
  { time: '5s ago', agent: 'Inspector', group: 'Контроль', desc: 'completed quality check on Module X' },
  { time: '12s ago', agent: 'Architect', group: 'Стратегия', desc: 'broadcast strategy update' },
  { time: '18s ago', agent: 'Trainer', group: 'Обучение', desc: 'updated DSPy parameters' },
  { time: '25s ago', agent: 'Observer', group: 'Мониторинг', desc: 'detected memory threshold warning' },
  { time: '31s ago', agent: 'Coordinator', group: 'Тактика', desc: 'delegated 3 tasks to execution group' },
  { time: '45s ago', agent: 'RAG-Specialist', group: 'Память', desc: 'retrieved context for prompt #847' },
  { time: '52s ago', agent: 'Debugger', group: 'Исполнение', desc: 'fixed 2 issues via SelfRefine' },
  { time: '1m ago', agent: 'Diagnostician', group: 'Мониторинг', desc: 'traced latency root cause' },
  { time: '1m ago', agent: 'Alert-Operator', group: 'Мониторинг', desc: 'triggered escalation protocol' },
]

// ─── Formula-Agent Mapping ────────────────────────────────────────────────────

export const GROUP_ABBREVIATIONS = ['Стр', 'Ткт', 'Кнт', 'Исп', 'Пмт', 'Мнц', 'Кмн', 'Обч']
export const GROUP_COLORS = ['#67E8F9', '#22D3EE', '#06B6D4', '#06B6D4', '#0891B2', '#0E7490', '#155E75', '#164E63']

export const FORMULA_AGENT_MAP: { formula: string; groups: number[] }[] = [
  { formula: 'CoT', groups: [4, 5] },
  { formula: 'ToT', groups: [0] },
  { formula: 'GoT', groups: [0, 5] },
  { formula: 'AoT', groups: [4] },
  { formula: 'SoT', groups: [4] },
  { formula: 'CoVe', groups: [0, 2] },
  { formula: 'ReWOO', groups: [1] },
  { formula: 'Reflexion', groups: [2] },
  { formula: 'ReAct', groups: [1, 2, 3] },
  { formula: 'MoA', groups: [3] },
  { formula: 'SelfRefine', groups: [3] },
  { formula: 'LATS', groups: [5] },
  { formula: 'SelfConsistency', groups: [1] },
  { formula: 'PoT', groups: [3] },
  { formula: 'DSPy', groups: [7] },
  { formula: 'PromptChaining', groups: [6] },
  { formula: 'LeastToMost', groups: [7] },
  { formula: 'StepBack', groups: [6] },
  { formula: 'PlanAndSolve', groups: [6] },
  { formula: 'MetaCoT', groups: [7] },
]

// ─── Connection Heatmap ───────────────────────────────────────────────────────

export const CONNECTION_HEATMAP_DATA: number[][] = [
  [  2,   3,   2,   1,   0,   2,   0,   0],
  [  0,   2,   1,   5,   0,   0,   0,   0],
  [  0,   0,   2,   3,   0,   0,   0,   0],
  [  0,   0,   0,   3,   0,   0,   0,   0],
  [  0,   0,   0,   1,   1,   2,   0,   0],
  [  0,   0,   0,   0,   0,   2,   0,   0],
  [  0,   1,   0,   2,   1,   0,   2,   0],
  [  0,   0,   0,   1,   2,   0,   0,   2],
]

// ─── Agent Performance ────────────────────────────────────────────────────────

export const TOP_PERFORMERS = [
  { name: 'Architect', group: 'Стратегия', score: 96 },
  { name: 'Coordinator', group: 'Тактика', score: 94 },
  { name: 'Inspector', group: 'Контроль', score: 91 },
  { name: 'Coder', group: 'Исполнение', score: 89 },
  { name: 'RAG-Specialist', group: 'Память', score: 87 },
  { name: 'Observer', group: 'Мониторинг', score: 85 },
  { name: 'Gateway', group: 'Коммуникация', score: 83 },
  { name: 'Trainer', group: 'Обучение', score: 81 },
]

export const SPARKLINE_DATA: Record<string, number[]> = {
  'Avg Response Time': [12, 10, 14, 8, 11, 9, 13, 7, 10, 8, 12, 9],
  'Success Rate': [90, 92, 91, 93, 94, 93, 95, 94, 94, 95, 94, 95],
  'Tasks Completed': [120, 135, 142, 150, 158, 165, 172, 180, 183, 185, 187, 187],
  'Active Workflows': [8, 9, 10, 11, 10, 12, 11, 13, 12, 11, 12, 12],
  'Error Recovery': [95, 96, 97, 96, 98, 97, 98, 99, 98, 98, 98, 98],
  'Knowledge Utilization': [68, 70, 72, 71, 73, 74, 75, 74, 76, 75, 76, 76],
}

export const PERFORMANCE_METRICS = [
  { label: 'Avg Response Time', value: '1.2s', color: '#06B6D4', icon: Clock },
  { label: 'Success Rate', value: '94.7%', color: '#22D3EE', icon: CheckCircle2 },
  { label: 'Tasks Completed', value: '187', color: '#06B6D4', icon: ListChecks, trendUp: true },
  { label: 'Active Workflows', value: '12', color: '#06B6D4', icon: Workflow },
  { label: 'Error Recovery', value: '98.2%', color: '#22D3EE', icon: RotateCcw },
  { label: 'Knowledge Utilization', value: '76.3%', color: '#6B7280', icon: BookOpen },
]

export const STATUS_DISTRIBUTION = [
  { label: 'Active', count: 21, color: '#22D3EE' },
  { label: 'Idle', count: 3, color: '#64748B' },
  { label: 'Paused', count: 1, color: '#EAB308' },
  { label: 'Standby', count: 1, color: '#818CF8' },
  { label: 'Error', count: 0, color: '#F43F5E' },
  { label: 'Offline', count: 0, color: '#3F3F46' },
]

// ─── Network Activity ─────────────────────────────────────────────────────────

export const NETWORK_ACTIVITY_DATA = [12, 18, 15, 22, 28, 35, 42, 38, 45, 52, 48, 55, 50, 47, 42, 38, 44, 50, 53, 48, 35, 28, 20, 15]

// ─── Agent List ───────────────────────────────────────────────────────────────

export const AGENT_LIST = [
  { name: 'Architect', group: 'Стратегия', status: 'active' as const, role: 'lead' as const },
  { name: 'Analyst', group: 'Стратегия', status: 'active' as const, role: 'active' as const },
  { name: 'Visionary', group: 'Стратегия', status: 'active' as const, role: 'active' as const },
  { name: 'Coordinator', group: 'Тактика', status: 'active' as const, role: 'lead' as const },
  { name: 'Planner', group: 'Тактика', status: 'active' as const, role: 'active' as const },
  { name: 'Communicator', group: 'Тактика', status: 'idle' as const, role: 'idle' as const },
  { name: 'Inspector', group: 'Контроль', status: 'active' as const, role: 'lead' as const },
  { name: 'Evaluator', group: 'Контроль', status: 'active' as const, role: 'active' as const },
  { name: 'Guard', group: 'Контроль', status: 'active' as const, role: 'active' as const },
  { name: 'Executor-A', group: 'Исполнение', status: 'active' as const, role: 'lead' as const },
  { name: 'Executor-B', group: 'Исполнение', status: 'active' as const, role: 'active' as const },
  { name: 'Debugger', group: 'Исполнение', status: 'idle' as const, role: 'idle' as const },
  { name: 'Tester', group: 'Исполнение', status: 'active' as const, role: 'active' as const },
  { name: 'Coder', group: 'Исполнение', status: 'active' as const, role: 'active' as const },
  { name: 'Archivist', group: 'Память', status: 'active' as const, role: 'lead' as const },
  { name: 'RAG-Specialist', group: 'Память', status: 'active' as const, role: 'active' as const },
  { name: 'Context-Manager', group: 'Память', status: 'standby' as const, role: 'standby' as const },
  { name: 'Observer', group: 'Мониторинг', status: 'active' as const, role: 'lead' as const },
  { name: 'Alert-Operator', group: 'Мониторинг', status: 'paused' as const, role: 'paused' as const },
  { name: 'Diagnostician', group: 'Мониторинг', status: 'active' as const, role: 'active' as const },
  { name: 'Gateway', group: 'Коммуникация', status: 'active' as const, role: 'lead' as const },
  { name: 'Protocolist', group: 'Коммуникация', status: 'active' as const, role: 'active' as const },
  { name: 'Dispatcher', group: 'Коммуникация', status: 'active' as const, role: 'active' as const },
  { name: 'Trainer', group: 'Обучение', status: 'active' as const, role: 'lead' as const },
  { name: 'Adapter', group: 'Обучение', status: 'active' as const, role: 'active' as const },
  { name: 'Scorer', group: 'Обучение', status: 'idle' as const, role: 'idle' as const },
]

export const STATUS_DOT_COLORS: Record<string, string> = {
  active: '#22D3EE',
  idle: '#64748B',
  paused: '#EAB308',
  standby: '#818CF8',
  offline: '#3F3F46',
}

export const ROLE_GROUP_ICONS: Record<string, any> = {
  'Стратегия': Brain,
  'Тактика': Target,
  'Контроль': Shield,
  'Исполнение': Zap,
  'Память': Database,
  'Мониторинг': Activity,
  'Коммуникация': Network,
  'Обучение': Sparkles,
}

// ─── Helper ───────────────────────────────────────────────────────────────────

export function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return '255,255,255'
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
}
