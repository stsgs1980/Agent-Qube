'use client'

import { useState, useCallback } from 'react'
import type { ExecutionData, StepResult } from '@/hooks/use-prompt-analysis'
import { CheckCircle2, XCircle, Clock, ChevronDown, ChevronRight, Loader2, SkipForward, AlertTriangle, Copy, Check, FileJson, FileText } from 'lucide-react'

// ─── Step evaluation shape from LLM ────────────────────────

interface StepEval {
  score?: number
  status?: string
  summary?: string
  issues?: string[]
  suggestions?: string[]
  verdict?: string
  [key: string]: unknown
}

function parseEval(data: string): StepEval | null {
  try { return JSON.parse(data) }
  catch { return null }
}

function getScoreColor(score: number | undefined): string {
  if (!score) return '#475569'
  return score >= 80 ? '#22C55E' : score >= 50 ? '#EAB308' : '#EF4444'
}

// ─── Main Component ────────────────────────────────────────

interface ExecutionResultProps {
  result: ExecutionData
}

export function ExecutionResult({ result }: ExecutionResultProps) {
  const completedSteps = result.steps.filter((s) => s.status === 'completed')
  const failedCount = result.steps.filter((s) => s.status === 'failed').length
  const scores = completedSteps.map((s) => parseEval(s.outputData)?.score).filter((s): s is number => typeof s === 'number')
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null
  const totalIssues = completedSteps.reduce((acc, s) => acc + (parseEval(s.outputData)?.issues?.length || 0), 0)

  return (
    <div className="space-y-5 mt-6">
      <SectionLabel>Execution Result</SectionLabel>
      <div className="rounded-xl p-5" style={{ background: '#0A0A0A', border: '1px solid rgba(51,51,51,0.3)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {avgScore !== null && <ScoreCircle score={avgScore} />}
            <div>
              <StatusBadge status={result.status} />
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-xs" style={{ color: '#64748B' }}>{completedSteps.length}/{result.steps.length} steps</span>
                {failedCount > 0 && <span className="text-xs" style={{ color: '#EF4444' }}>{failedCount} failed</span>}
                {totalIssues > 0 && <span className="text-xs" style={{ color: '#EAB308' }}>{totalIssues} issues</span>}
              </div>
            </div>
          </div>
          <span className="text-xs font-mono" style={{ color: '#475569' }}>ID: {result.id.slice(-8)}</span>
        </div>
        <div className="space-y-2">
          {result.steps.map((step, i) => (
            <EvalStepRow key={step.id} step={step} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Score Circle ──────────────────────────────────────────

function ScoreCircle({ score }: { score: number }) {
  const color = getScoreColor(score)
  const label = score >= 80 ? 'Good' : score >= 50 ? 'Fair' : 'Poor'
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: `rgba(${hexToRgb(color)},0.1)`, border: `2px solid ${color}` }}>
        <span className="text-lg font-bold" style={{ color }}>{score}</span>
      </div>
      <span className="text-[10px] font-bold uppercase" style={{ color }}>{label}</span>
    </div>
  )
}

function StepBadges({ eval_, step, scoreColor, issueCount }: { eval_: StepEval | null; step: StepResult; scoreColor: string; issueCount: number }) {
  return (
    <>
      {eval_?.score !== undefined && step.status === 'completed' && (
        <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: `rgba(${hexToRgb(scoreColor)},0.12)`, color: scoreColor }}>{eval_.score}</span>
      )}
      {issueCount > 0 && (
        <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444' }}>
          <AlertTriangle size={10} />{issueCount}
        </span>
      )}
      {eval_?.verdict && step.status === 'completed' && <VerdictBadge verdict={eval_.verdict} />}
    </>
  )
}

function StepExpandedContent({ step, eval_ }: { step: StepResult; eval_: StepEval | null }) {
  return (
    <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: 'rgba(51,51,51,0.2)' }}>
      {step.status === 'completed' && eval_ ? (
        <EvalDetail eval_={eval_} rawData={step.outputData} />
      ) : step.status === 'skipped' ? (
        <p className="text-xs py-2" style={{ color: '#64748B' }}>Skipped — no available agent for this step</p>
      ) : (
        <RawDataBlock data={step.outputData} />
      )}
      {step.error && (
        <div className="px-3 py-2 rounded-lg text-xs" style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>Error: {step.error}</div>
      )}
    </div>
  )
}

// ─── Eval Step Row ─────────────────────────────────────────

function EvalStepRow({ step, index }: { step: StepResult; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const eval_ = parseEval(step.outputData)
  const duration = getDuration(step.startedAt, step.completedAt)
  const scoreColor = getScoreColor(eval_?.score)
  const issueCount = eval_?.issues?.length || 0

  return (
    <div className="rounded-lg overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(51,51,51,0.2)' }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-white/[0.02]"
      >
        <StepStatusIcon status={step.status} />
        <span className="text-xs font-semibold" style={{ color: '#94A3B8' }}>{index + 1}</span>
        <span className="text-sm font-medium text-white flex-1">{step.name}</span>
        <StepBadges eval_={eval_} step={step} scoreColor={scoreColor} issueCount={issueCount} />
        <span className="text-xs font-medium" style={{ color: '#64748B' }}>{step.agentName}</span>
        {duration && <span className="text-xs font-mono" style={{ color: '#475569' }}>{duration}</span>}
        {expanded ? <ChevronDown size={14} style={{ color: '#475569' }} /> : <ChevronRight size={14} style={{ color: '#475569' }} />}
      </button>
      {expanded && <StepExpandedContent step={step} eval_={eval_} />}
    </div>
  )
}

// ─── Eval Detail (structured view) ─────────────────────────

function EvalDetail({ eval_, rawData }: { eval_: StepEval; rawData: string }) {
  const scoreColor = getScoreColor(eval_.score)

  return (
    <div className="space-y-3">
      {eval_.summary && (
        <div className="px-3 py-2.5 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(51,51,51,0.2)' }}>
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Summary</span>
          <p className="text-xs text-white mt-1">{eval_.summary}</p>
        </div>
      )}
      <EvalMetaRow eval_={eval_} scoreColor={scoreColor} />
      {eval_.issues && eval_.issues.length > 0 && <IssuesList issues={eval_.issues} />}
      {eval_.suggestions && eval_.suggestions.length > 0 && <SuggestionsList suggestions={eval_.suggestions} />}
      <RawDataBlock data={rawData} />
    </div>
  )
}

function EvalMetaRow({ eval_, scoreColor }: { eval_: StepEval; scoreColor: string }) {
  return (
    <div className="flex items-center gap-3">
      {typeof eval_.score === 'number' && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: `rgba(${hexToRgb(scoreColor)},0.08)`, border: `1px solid rgba(${hexToRgb(scoreColor)},0.2)` }}>
          <span className="text-[10px] font-bold uppercase" style={{ color: '#475569' }}>Score</span>
          <span className="text-sm font-bold" style={{ color: scoreColor }}>{eval_.score}/100</span>
        </div>
      )}
      {eval_.verdict && <VerdictBadge verdict={eval_.verdict} large />}
      {eval_.status && <StatusPill status={eval_.status} />}
    </div>
  )
}

function IssuesList({ issues }: { issues: string[] }) {
  return (
    <div className="px-3 py-2.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#EF4444' }}>Issues ({issues.length})</span>
      <ul className="mt-1.5 space-y-1">
        {issues.map((issue, i) => (
          <li key={i} className="text-xs flex items-start gap-2" style={{ color: '#FCA5A5' }}>
            <XCircle size={12} className="mt-0.5 flex-shrink-0" style={{ color: '#EF4444' }} />{issue}
          </li>
        ))}
      </ul>
    </div>
  )
}

function SuggestionsList({ suggestions }: { suggestions: string[] }) {
  return (
    <div className="px-3 py-2.5 rounded-lg" style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)' }}>
      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#06B6D4' }}>Suggestions ({suggestions.length})</span>
      <ul className="mt-1.5 space-y-1">
        {suggestions.map((s, i) => (
          <li key={i} className="text-xs flex items-start gap-2" style={{ color: '#67E8F9' }}>
            <CheckCircle2 size={12} className="mt-0.5 flex-shrink-0" style={{ color: '#06B6D4' }} />{s}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── Raw Data Block (collapsible) ──────────────────────────

function RawDataBlock({ data }: { data: string }) {
  const [show, setShow] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(data)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* ignore */ }
  }, [data])

  return (
    <div>
      <div className="flex items-center gap-2">
        <button onClick={() => setShow(!show)} className="flex items-center gap-1 text-[10px] font-medium transition-all hover:opacity-80" style={{ color: '#475569' }}>
          {show ? <FileText size={10} /> : <FileJson size={10} />}
          {show ? 'Hide raw JSON' : 'Show raw JSON'}
        </button>
        {show && (
          <button onClick={handleCopy} className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium transition-all hover:opacity-80"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#64748B', border: '1px solid rgba(51,51,51,0.3)' }}>
            {copied ? <><Check size={10} style={{ color: '#22C55E' }} />Copied</> : <><Copy size={10} />Copy</>}
          </button>
        )}
      </div>
      {show && (
        <pre className="mt-2 px-3 py-2.5 rounded-lg text-xs font-mono overflow-x-auto max-h-40" style={{ background: 'rgba(0,0,0,0.4)', color: '#94A3B8', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>{formatJson(data)}</pre>
      )}
    </div>
  )
}

// ─── Verdict Badge ─────────────────────────────────────────

function VerdictBadge({ verdict, large }: { verdict: string; large?: boolean }) {
  const map: Record<string, { bg: string; color: string; border: string }> = {
    approved: { bg: 'rgba(34,197,94,0.1)', color: '#22C55E', border: 'rgba(34,197,94,0.3)' },
    'needs-work': { bg: 'rgba(234,179,8,0.1)', color: '#EAB308', border: 'rgba(234,179,8,0.3)' },
    rejected: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444', border: 'rgba(239,68,68,0.3)' },
  }
  const style = map[verdict.toLowerCase()] || map['needs-work']
  const cls = large ? 'px-3 py-1.5 text-xs' : 'px-2 py-0.5 text-[10px]'
  return (
    <span className={`${cls} font-bold uppercase rounded`} style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}>{verdict}</span>
  )
}

// ─── Status Pill ───────────────────────────────────────────

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    pass: { bg: 'rgba(34,197,94,0.08)', color: '#22C55E' },
    warning: { bg: 'rgba(234,179,8,0.08)', color: '#EAB308' },
    fail: { bg: 'rgba(239,68,68,0.08)', color: '#EF4444' },
  }
  const s = map[status.toLowerCase()] || map.warning
  return (
    <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded" style={{ background: s.bg, color: s.color }}>{status}</span>
  )
}

// ─── Helpers ───────────────────────────────────────────────

function StepStatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'completed': return <CheckCircle2 size={16} style={{ color: '#22C55E' }} />
    case 'failed': return <XCircle size={16} style={{ color: '#EF4444' }} />
    case 'running': return <Loader2 size={16} className="animate-spin" style={{ color: '#06B6D4' }} />
    case 'skipped': return <SkipForward size={16} style={{ color: '#64748B' }} />
    default: return <Clock size={16} style={{ color: '#475569' }} />
  }
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    completed: { bg: 'rgba(34,197,94,0.08)', text: '#22C55E', border: 'rgba(34,197,94,0.2)' },
    failed: { bg: 'rgba(239,68,68,0.08)', text: '#EF4444', border: 'rgba(239,68,68,0.2)' },
    running: { bg: 'rgba(6,182,212,0.08)', text: '#06B6D4', border: 'rgba(6,182,212,0.2)' },
  }
  const c = colors[status] || colors.running
  return <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase" style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>{status}</span>
}

function getDuration(start: string | null, end: string | null): string | null {
  if (!start || !end) return null
  const ms = new Date(end).getTime() - new Date(start).getTime()
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-1">
      <div className="h-px flex-1" style={{ background: 'rgba(51,51,51,0.3)' }} />
      <span className="text-[11px] font-semibold tracking-widest uppercase" style={{ color: '#64748B' }}>{children}</span>
      <div className="h-px flex-1" style={{ background: 'rgba(51,51,51,0.3)' }} />
    </div>
  )
}

function formatJson(data: string): string {
  try { return JSON.stringify(JSON.parse(data), null, 2) }
  catch { return data }
}

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `${r},${g},${b}`
}