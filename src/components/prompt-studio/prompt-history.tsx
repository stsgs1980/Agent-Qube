'use client'

import { useEffect } from 'react'
import { Clock, Trash2, ChevronRight, ChevronLeft, History, TrendingUp } from 'lucide-react'
import { ScoreTrend } from './score-trend'
import { usePromptHistory } from '@/hooks/use-prompt-history'
import type { PromptHistoryEntry } from '@/hooks/use-prompt-history'

interface PromptHistoryProps {
  onSelect: (prompt: string) => void
  collapsed?: boolean
  onToggleCollapse?: () => void
  onDataChange?: (entries: Array<{ id: string; prompt: string; avgScore: number; createdAt: string }>) => void
}

export function PromptHistory({ onSelect, collapsed, onToggleCollapse, onDataChange }: PromptHistoryProps) {
  const { history, loading, clearAll } = usePromptHistory()

  useEffect(() => {
    if (onDataChange && history.length > 0) onDataChange(history)
  }, [history, onDataChange])

  if (collapsed) {
    return (
      <button onClick={onToggleCollapse} className="flex items-center gap-1 px-2 py-2 rounded-lg text-xs transition-all hover:scale-105" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(51,51,51,0.3)', color: '#64748B' }}>
        <ChevronLeft size={14} /><History size={14} />
      </button>
    )
  }

  return (
    <div className="flex flex-col h-full" style={{ width: '280px', minWidth: '280px', background: '#0A0A0A', borderLeft: '1px solid rgba(51,51,51,0.3)' }}>
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(51,51,51,0.3)' }}>
        <div className="flex items-center gap-2">
          <History size={14} style={{ color: '#06B6D4' }} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#94A3B8' }}>History</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono" style={{ background: 'rgba(6,182,212,0.1)', color: '#06B6D4' }}>{history.length}</span>
          {history.length > 0 && <TrendingUp size={10} style={{ color: '#06B6D4' }} />}
        </div>
        <div className="flex items-center gap-1.5">
          {history.length > 0 && (
            <button onClick={clearAll} className="p-1.5 rounded transition-all hover:scale-110" style={{ color: '#64748B' }} title="Clear history">
              <Trash2 size={12} />
            </button>
          )}
          {onToggleCollapse && (
            <button onClick={onToggleCollapse} className="p-1.5 rounded transition-all hover:scale-110" style={{ color: '#64748B' }}>
              <ChevronRight size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Score Trend */}
      {history.length >= 2 && (
        <div className="px-4 py-3 flex-shrink-0" style={{ borderBottom: '1px solid rgba(51,51,51,0.3)' }}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <TrendingUp size={10} style={{ color: '#06B6D4' }} />
            <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#64748B' }}>Score Trend</span>
          </div>
          <ScoreTrend history={history} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}>
        {loading ? (
          <div className="px-4 py-6 text-center text-xs" style={{ color: '#475569' }}>Loading...</div>
        ) : history.length === 0 ? (
          <div className="px-4 py-6 text-center text-xs" style={{ color: '#475569' }}>No history yet. Execute a workflow to see results here.</div>
        ) : (
          <div className="p-2 space-y-1">
            {history.map((entry) => (
              <HistoryItem key={entry.id} entry={entry} onSelect={onSelect} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function HistoryItem({ entry, onSelect }: { entry: PromptHistoryEntry; onSelect: (prompt: string) => void }) {
  const scoreColor = entry.avgScore >= 80 ? '#22C55E' : entry.avgScore >= 50 ? '#EAB308' : entry.avgScore > 0 ? '#EF4444' : '#475569'

  return (
    <button onClick={() => onSelect(entry.prompt)} className="w-full text-left p-3 rounded-lg transition-all hover:scale-[1.01]" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(51,51,51,0.2)' }}>
      <p className="text-xs text-white truncate mb-2">{entry.prompt}</p>
      <div className="flex items-center gap-2 flex-wrap">
        {entry.intent && <IntentBadge intent={entry.intent} />}
        <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0" style={{ background: `rgba(${hexToRgb(scoreColor)},0.15)`, color: scoreColor, border: `1px solid ${scoreColor}` }}>
          {entry.avgScore || '-'}
        </span>
        {entry.verdict && <VerdictBadge verdict={entry.verdict} />}
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        <Clock size={10} style={{ color: '#475569' }} />
        <span className="text-[10px]" style={{ color: '#475569' }}>{relativeTime(entry.createdAt)}</span>
      </div>
    </button>
  )
}

function IntentBadge({ intent }: { intent: string }) {
  return (
    <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase" style={{ background: 'rgba(6,182,212,0.1)', color: '#06B6D4', border: '1px solid rgba(6,182,212,0.2)' }}>
      {intent.replace(/-/g, ' ')}
    </span>
  )
}

function VerdictBadge({ verdict }: { verdict: string }) {
  const v = verdict.toLowerCase()
  const style = v === 'approved' ? { bg: 'rgba(34,197,94,0.1)', color: '#22C55E' }
    : v === 'rejected' ? { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' }
    : { bg: 'rgba(234,179,8,0.1)', color: '#EAB308' }
  return (
    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase" style={{ background: style.bg, color: style.color }}>
      {verdict}
    </span>
  )
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '')
  return `${parseInt(h.substring(0, 2), 16)},${parseInt(h.substring(2, 4), 16)},${parseInt(h.substring(4, 6), 16)}`
}
