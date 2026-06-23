'use client'

import { useState, useMemo } from 'react'
import { blindCompare, type BlindCompareResult, type PromptScore } from '@/lib/prompting'
import { GitCompare, Loader2 } from 'lucide-react'

const GC: Record<string, { bg: string; color: string; border: string }> = {
  S: { bg: 'rgba(6,182,212,0.15)', color: '#06B6D4', border: 'rgba(6,182,212,0.3)' },
  A: { bg: 'rgba(34,197,94,0.15)', color: '#22C55E', border: 'rgba(34,197,94,0.3)' },
  B: { bg: 'rgba(234,179,8,0.15)', color: '#EAB308', border: 'rgba(234,179,8,0.3)' },
  C: { bg: 'rgba(249,115,22,0.15)', color: '#F97316', border: 'rgba(249,115,22,0.3)' },
  D: { bg: 'rgba(239,68,68,0.15)', color: '#EF4444', border: 'rgba(239,68,68,0.3)' },
  F: { bg: 'rgba(239,68,68,0.15)', color: '#EF4444', border: 'rgba(239,68,68,0.3)' },
}

interface HistoryPrompt { id: string; prompt: string; avgScore: number; createdAt: string }

export function PromptComparison({ currentPrompt, historyPrompts }: {
  currentPrompt: string; historyPrompts: HistoryPrompt[]
}) {
  const [selectedId, setSelectedId] = useState<string>('')
  const [comparing, setComparing] = useState(false)
  const [result, setResult] = useState<BlindCompareResult | null>(null)
  const selected = historyPrompts.find(h => h.id === selectedId)

  const handleCompare = () => {
    if (!selected) return
    setComparing(true)
    setTimeout(() => {
      setResult(blindCompare(currentPrompt, selected.prompt))
      setComparing(false)
    }, 0)
  }

  const winnerColors = result?.winner === 'a' ? { bg: 'rgba(6,182,212,0.1)', color: '#06B6D4', border: 'rgba(6,182,212,0.3)' }
    : result?.winner === 'b' ? { bg: 'rgba(34,197,94,0.1)', color: '#22C55E', border: 'rgba(34,197,94,0.3)' }
    : { bg: 'rgba(234,179,8,0.1)', color: '#EAB308', border: 'rgba(234,179,8,0.3)' }

  return (
    <div className="space-y-5 mt-6">
      <SectionLabel>Compare</SectionLabel>
      <div className="rounded-xl p-5" style={{ background: '#0A0A0A', border: '1px solid rgba(51,51,51,0.3)' }}>
        <div className="flex items-center gap-3 mb-4">
          <select value={selectedId} onChange={e => { setSelectedId(e.target.value); setResult(null) }}
            className="flex-1 px-3 py-2 rounded-lg text-xs outline-none"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(51,51,51,0.4)', color: '#94A3B8' }}>
            <option value="">Select a history prompt...</option>
            {historyPrompts.map(h => (
              <option key={h.id} value={h.id}>{h.prompt.slice(0, 50)}... ({h.avgScore})</option>
            ))}
          </select>
          <button onClick={handleCompare} disabled={!selected || comparing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105 disabled:opacity-30"
            style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', color: '#06B6D4' }}>
            {comparing ? <Loader2 size={12} className="animate-spin" /> : <GitCompare size={12} />}Compare
          </button>
        </div>

        {result && (
          <>
            <div className="px-4 py-2.5 rounded-lg mb-4 text-xs font-bold text-center"
              style={{ background: winnerColors.bg, color: winnerColors.color, border: `1px solid ${winnerColors.border}` }}>
              {result.winner === 'tie' ? 'TIE' : `Prompt ${result.winner.toUpperCase()} Wins`}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ScoreColumn label="Prompt A (Current)" s={result.scores.a} />
              <ScoreColumn label="Prompt B (History)" s={result.scores.b} />
            </div>
            <div className="mt-3 space-y-1.5">
              {Object.entries(result.deltas).map(([dim, delta]) => (
                <div key={dim} className="flex items-center justify-between text-[11px]">
                  <span style={{ color: '#64748B' }}>{dim}</span>
                  <span className="font-bold" style={{ color: delta > 0 ? '#06B6D4' : delta < 0 ? '#22C55E' : '#475569' }}>
                    {delta > 0 ? '+' : ''}{delta}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed" style={{ color: '#94A3B8' }}>{result.reason}</p>
          </>
        )}
      </div>
    </div>
  )
}

function ScoreColumn({ label, s }: { label: string; s: PromptScore }) {
  const gc = GC[s.overall]
  return (
    <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(51,51,51,0.2)' }}>
      <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: '#64748B' }}>{label}</p>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg font-black" style={{ color: gc.color }}>{s.overall}</span>
        <span className="text-sm font-bold text-white">{s.numeric}</span>
      </div>
      {s.dimensions.map(d => (
        <div key={d.name} className="flex items-center justify-between text-[10px] mb-0.5">
          <span style={{ color: '#475569' }}>{d.name}</span>
          <span style={{ color: GC[d.grade].color }}>{d.score}</span>
        </div>
      ))}
    </div>
  )
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
