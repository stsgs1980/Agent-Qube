import { Brain, Shield, Target, Zap, Activity, Database, Sparkles, Network, ArrowRight, ArrowLeftRight, Diamond, Workflow, Eye, Megaphone, Building2, BarChart3, ClipboardList, Radio, Search, TrendingUp, ShieldCheck, Flame, Bug, CheckCircle, BookOpen, HardDrive, FileSearch, Monitor, Bell, Gauge, GitBranch, RefreshCcw, Binary, type LucideIcon } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Agent {
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
  children?: Agent[]
  tasks?: unknown[]
}

export type EdgeType = 'command' | 'sync' | 'twin' | 'delegate' | 'supervise' | 'broadcast'

export interface Connection {
  id: string
  from: string
  to: string
  type: EdgeType
  strength?: number
}

export type ViewMode = 'hierarchy' | 'radial' | 'grid'

export interface ContextMenuState {
  visible: boolean
  x: number
  y: number
  agentId: string | null
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const ROLE_CONFIG: Record<string, { color: string; colorRgb: string; icon: LucideIcon; label: string }> = {
  '\u0421\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u044f': { color: '#67E8F9', colorRgb: '103,232,249', icon: Brain, label: 'Strategy' },
  '\u0422\u0430\u043a\u0442\u0438\u043a\u0430': { color: '#22D3EE', colorRgb: '34,211,238', icon: Target, label: 'Tactics' },
  '\u041a\u043e\u043d\u0442\u0440\u043e\u043b\u044c': { color: '#06B6D4', colorRgb: '6,182,212', icon: Shield, label: 'Control' },
  '\u0418\u0441\u043f\u043e\u043b\u043d\u0435\u043d\u0438\u0435': { color: '#06B6D4', colorRgb: '6,182,212', icon: Zap, label: 'Execution' },
  '\u041f\u0430\u043c\u044f\u0442\u044c': { color: '#0891B2', colorRgb: '8,145,178', icon: Database, label: 'Memory' },
  '\u041c\u043e\u043d\u0438\u0442\u043e\u0440\u0438\u043d\u0433': { color: '#0E7490', colorRgb: '14,116,144', icon: Activity, label: 'Monitoring' },
  '\u041a\u043e\u043c\u043c\u0443\u043d\u0438\u043a\u0430\u0446\u0438\u044f': { color: '#155E75', colorRgb: '21,94,117', icon: Network, label: 'Communication' },
  '\u041e\u0431\u0443\u0447\u0435\u043d\u0438\u0435': { color: '#164E63', colorRgb: '22,78,99', icon: Sparkles, label: 'Learning' },
}

export const ROLE_ORDER = ['\u0421\u0442\u0440\u0430\u0442\u0435\u0433\u0438\u044f', '\u0422\u0430\u043a\u0442\u0438\u043a\u0430', '\u041a\u043e\u043d\u0442\u0440\u043e\u043b\u044c', '\u0418\u0441\u043f\u043e\u043b\u043d\u0435\u043d\u0438\u0435', '\u041f\u0430\u043c\u044f\u0442\u044c', '\u041c\u043e\u043d\u0438\u0442\u043e\u0440\u0438\u043d\u0433', '\u041a\u043e\u043c\u043c\u0443\u043d\u0438\u043a\u0430\u0446\u0438\u044f', '\u041e\u0431\u0443\u0447\u0435\u043d\u0438\u0435']

export const STATUS_COLORS: Record<string, string> = {
  active: '#22D3EE',
  idle: '#6B7280',
  error: '#EF4444',
  offline: '#4B5563',
  paused: '#F59E0B',
  standby: '#8B5CF6',
}

export const FORMULA_COLORS: Record<string, string> = {
  CoT: '#999999', ToT: '#999999', GoT: '#999999', AoT: '#999999', SoT: '#999999',
  CoVe: '#888888', Reflexion: '#888888', SelfConsistency: '#888888', SelfRefine: '#888888',
  ReWOO: '#777777', ReAct: '#777777', PromptChaining: '#777777', PlanAndSolve: '#777777', StepBack: '#777777', LeastToMost: '#777777',
  MoA: '#666666', LATS: '#666666', PoT: '#666666', DSPy: '#666666', MetaCoT: '#666666',
}

export const EDGE_CONFIG: Record<EdgeType, { strokeDasharray: string | undefined; label: string; icon: LucideIcon; color: string }> = {
  command: { strokeDasharray: undefined, label: 'Command', icon: ArrowRight, color: '#67E8F9' },
  sync: { strokeDasharray: '3 5', label: 'Sync', icon: ArrowLeftRight, color: '#64748B' },
  twin: { strokeDasharray: '8 4', label: 'Twin', icon: Diamond, color: '#22D3EE' },
  delegate: { strokeDasharray: '6 3', label: 'Delegate', icon: Workflow, color: '#0891B2' },
  supervise: { strokeDasharray: '2 4', label: 'Supervise', icon: Eye, color: '#475569' },
  broadcast: { strokeDasharray: '12 4 2 4', label: 'Broadcast', icon: Megaphone, color: '#0E7490' },
}

export const AVATAR_ICON_MAP: Record<string, LucideIcon> = {
  'building-2': Building2, 'bar-chart-3': BarChart3, 'sparkles': Sparkles,
  'target': Target, 'clipboard-list': ClipboardList, 'radio': Radio,
  'search': Search, 'trending-up': TrendingUp, 'shield-check': ShieldCheck,
  'zap': Zap, 'flame': Flame, 'bug': Bug, 'check-circle': CheckCircle,
  'brain': Brain, 'shield': Shield, 'activity': Activity, 'book-open': BookOpen,
  'hard-drive': HardDrive, 'file-search': FileSearch, 'monitor': Monitor,
  'bell': Bell, 'gauge': Gauge, 'network': Network, 'megaphone': Megaphone,
  'workflow': Workflow, 'git-branch': GitBranch, 'refresh-ccw': RefreshCcw,
  'binary': Binary,
}

export function getAvatarIcon(avatarName: string): LucideIcon {
  return AVATAR_ICON_MAP[avatarName] || Brain
}

export interface FlowParticle {
  id: number
  progress: number
  speed: number
}
