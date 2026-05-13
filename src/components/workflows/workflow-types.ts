import { Hand, Zap, Calendar, Radio, Cpu, Shield, RefreshCw, GitBranch, Sparkles } from 'lucide-react'

export interface WorkflowStep {
  id: string; order: number; name: string; agentId: string | null; roleGroup: string | null
  action: 'process' | 'review' | 'transform' | 'delegate' | 'broadcast' | 'decision'
  inputSchema: Record<string, any>; outputSchema: Record<string, any>; condition: Record<string, any>
  fallbackStepId: string | null; timeout: number; retryPolicy: Record<string, any>; config: Record<string, any>
}

export interface WorkflowStats {
  totalExecutions: number; completedExecutions: number; runningExecutions: number; failedExecutions: number; successRate: number
}

export interface RecentExecution { id: string; status: string; startedAt: string | null; completedAt: string | null }

export interface WorkflowData {
  id: string; name: string; description: string
  status: 'draft' | 'active' | 'paused' | 'archived'
  triggerType: 'manual' | 'event' | 'schedule' | 'webhook' | 'agent'
  triggerConfig: Record<string, any>; version: number; tags: string[]
  stepCount: number; steps: WorkflowStep[]; stats: WorkflowStats; recentExecutions: RecentExecution[]
}

export interface StepExecution {
  id: string; stepId: string; agentId: string | null
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped' | 'waiting_feedback'
  inputData: string; outputData: string; error: string | null
  startedAt: string | null; completedAt: string | null; messages: AgentMessage[]
}

export interface AgentMessage {
  id: string; fromAgentId: string; toAgentId: string
  type: 'request' | 'response' | 'feedback' | 'error' | 'status' | 'context_update'
  content: string; metadata: string; timestamp: string
}

export interface ExecutionData {
  id: string; workflowId: string; status: string; taskContext: string
  input: string; output: string; error: string | null
  startedAt: string | null; completedAt: string | null; steps: StepExecution[]
}

export interface WorkflowPipelineProps { fullPage?: boolean; onBack?: () => void; onOpenHierarchy?: () => void }

export const ROLE_GROUP_OPTIONS = ['Стратегия', 'Тактика', 'Контроль', 'Исполнение', 'Память', 'Мониторинг', 'Коммуникация', 'Обучение']
export const ACTION_OPTIONS: WorkflowStep['action'][] = ['process', 'review', 'transform', 'delegate', 'broadcast', 'decision']

export const ACTION_COLORS: Record<string, string> = {
  process: '#06B6D4', review: '#EAB308', transform: '#22D3EE', delegate: '#0891B2', broadcast: '#0E7490', decision: '#155E75',
}

export const STATUS_COLORS: Record<string, string> = {
  completed: '#22C55E', running: '#06B6D4', failed: '#EF4444', waiting_feedback: '#EAB308', skipped: '#64748B', pending: '#475569',
}

export const TRIGGER_ICONS: Record<string, any> = { manual: Hand, event: Zap, schedule: Calendar, webhook: Radio, agent: Cpu }
export const ACTION_ICONS: Record<string, any> = { process: Cpu, review: Shield, transform: RefreshCw, delegate: GitBranch, broadcast: Radio, decision: Sparkles }

export const WORKFLOW_STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: 'rgba(71,85,105,0.15)', text: '#64748B', label: 'Draft' },
  active: { bg: 'rgba(6,182,212,0.15)', text: '#06B6D4', label: 'Active' },
  paused: { bg: 'rgba(234,179,8,0.15)', text: '#EAB308', label: 'Paused' },
  archived: { bg: 'rgba(107,114,128,0.15)', text: '#6B7280', label: 'Archived' },
}

export function safeJsonParse(str: string | null | undefined, fallback: any = {}): any {
  if (!str) return fallback
  try { return JSON.parse(str) } catch { return fallback }
}

export function formatDuration(start: string | null, end: string | null): string {
  if (!start || !end) return '—'
  const ms = new Date(end).getTime() - new Date(start).getTime()
  if (ms < 1000) return `${ms}ms`
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
  return `${(ms / 60000).toFixed(1)}m`
}

export function formatTime(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function successRateColor(rate: number): string {
  if (rate >= 80) return '#22C55E'
  if (rate >= 60) return '#EAB308'
  return '#EF4444'
}
