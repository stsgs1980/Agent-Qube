'use client'

import { Award, ShieldCheck, AlertTriangle, Lightbulb } from 'lucide-react'
import { safeJsonParse } from './workflow-types'

interface LLMEvalData {
  score?: number
  verdict?: string
  issues?: string[]
  suggestions?: string[]
  summary?: string
}

function scoreColor(score: number): string {
  if (score >= 80) return '#22C55E'
  if (score >= 50) return '#EAB308'
  return '#EF4444'
}

function verdictColor(verdict: string): string {
  if (verdict === 'approved') return '#22C55E'
  if (verdict === 'needs-work') return '#EAB308'
  if (verdict === 'rejected') return '#EF4444'
  return '#64748B'
}

export function hasLLMEval(outputData: string): boolean {
  if (!outputData || outputData === '{}') return false
  const parsed = safeJsonParse(outputData) as LLMEvalData
  return typeof parsed.score === 'number' || typeof parsed.verdict === 'string'
}

export function LLMEvalDisplay({ outputData }: { outputData: string }) {
  const data = safeJsonParse(outputData) as LLMEvalData
  if (typeof data.score !== 'number' && !data.verdict) return null

  const sc = typeof data.score === 'number' ? scoreColor(data.score) : '#64748B'
  const vc = data.verdict ? verdictColor(data.verdict) : '#64748B'
  const issueCount = Array.isArray(data.issues) ? data.issues.length : 0

  return (
    <div className="px-3 pb-3 space-y-2 mt-1">
      <div className="flex flex-wrap items-center gap-2">
        {typeof data.score === 'number' && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold"
            style={{ background: `${sc}15`, color: sc, border: `1px solid ${sc}30` }}>
            <Award size={9} /> {data.score}/100
          </span>
        )}
        {data.verdict && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold capitalize"
            style={{ background: `${vc}15`, color: vc, border: `1px solid ${vc}30` }}>
            <ShieldCheck size={9} /> {data.verdict}
          </span>
        )}
        {issueCount > 0 && (
          <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
            <AlertTriangle size={9} /> {issueCount} issue{issueCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      {data.summary && (
        <p className="text-[9px] leading-relaxed" style={{ color: '#B0B0B0' }}>{data.summary}</p>
      )}
      {Array.isArray(data.issues) && data.issues.length > 0 && (
        <div className="space-y-1">
          {data.issues.map((issue, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[9px]" style={{ color: '#F87171' }}>
              <AlertTriangle size={8} className="flex-shrink-0 mt-0.5" /> {issue}
            </div>
          ))}
        </div>
      )}
      {Array.isArray(data.suggestions) && data.suggestions.length > 0 && (
        <div className="space-y-1">
          {data.suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-1.5 text-[9px]" style={{ color: '#60A5FA' }}>
              <Lightbulb size={8} className="flex-shrink-0 mt-0.5" /> {s}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
