'use client'

import { ROLE_CONFIG } from '@/components/hierarchy/types'
import type { PromptAnalysis } from '@/hooks/use-prompt-analysis'
import { ArrowRight } from 'lucide-react'

interface IntentDisplayProps {
  analysis: PromptAnalysis
}

export function IntentDisplay({ analysis }: IntentDisplayProps) {
  const { intent, runnerUpIntents, recommendedFormula, formulaReason, agentChain, bestRole } = analysis

  return (
    <div className="space-y-6">
      <SectionLabel>System Analysis</SectionLabel>

      {/* Intent Detection */}
      <Card>
        <CardTitle>Intent Detection</CardTitle>
        <div className="space-y-3 mt-4">
          <IntentBar intent={intent.intent} confidence={intent.confidence} primary />
          {runnerUpIntents.map((r) => (
            <IntentBar key={r.intent} intent={r.intent} confidence={r.confidence} />
          ))}
        </div>
        {intent.keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {intent.keywords.slice(0, 5).map((kw) => (
              <span key={kw} className="px-3 py-1 rounded text-xs font-medium" style={{ background: 'rgba(6,182,212,0.1)', color: '#06B6D4', border: '1px solid rgba(6,182,212,0.2)' }}>{kw}</span>
            ))}
          </div>
        )}
      </Card>

      {/* Recommended Formula */}
      <Card>
        <CardTitle>Recommended Formula</CardTitle>
        {recommendedFormula ? (
          <div className="mt-3">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-white text-sm font-semibold">{recommendedFormula.name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: 'rgba(6,182,212,0.12)', color: '#06B6D4' }}>{recommendedFormula.category}</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>{recommendedFormula.description.slice(0, 180)}...</p>
            <div className="mt-3 px-3 py-2 rounded-lg" style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.1)' }}>
              <span className="text-[11px] font-semibold" style={{ color: '#06B6D4' }}>Why: </span>
              <span className="text-[11px]" style={{ color: '#94A3B8' }}>{formulaReason}</span>
            </div>
          </div>
        ) : (
          <p className="text-xs mt-2" style={{ color: '#64748B' }}>No formula recommendation available</p>
        )}
      </Card>

      {/* Agent Chain */}
      <Card>
        <CardTitle>Agent Chain</CardTitle>
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {agentChain.map((agent, i) => {
            const config = ROLE_CONFIG[agent.roleGroup] || ROLE_CONFIG.Execution
            return (
              <div key={agent.id} className="flex items-center gap-2 flex-shrink-0">
                <div className="flex flex-col items-center gap-1.5 px-3 py-3 rounded-lg min-w-[80px]" style={{ background: `rgba(${config.colorRgb},0.08)`, border: `1px solid rgba(${config.colorRgb},0.2)` }}>
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold" style={{ background: `rgba(${config.colorRgb},0.2)`, color: config.color }}>{agent.name.charAt(0)}</span>
                  <span className="text-xs font-medium text-white text-center leading-tight">{agent.name}</span>
                  <span className="text-[10px] font-medium" style={{ color: config.color }}>{config.label}</span>
                </div>
                {i < agentChain.length - 1 && <ArrowRight size={14} style={{ color: '#475569' }} className="flex-shrink-0" />}
              </div>
            )
          })}
        </div>
        <div className="mt-3 text-xs" style={{ color: '#64748B' }}>
          Primary: <span className="font-medium" style={{ color: '#94A3B8' }}>{bestRole.name}</span> -- best suited for {intent.intent} tasks
        </div>
      </Card>
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────

function IntentBar({ intent, confidence, primary = false }: { intent: string; confidence: number; primary?: boolean }) {
  const displayConfidence = Math.min(100, Math.max(0, confidence))
  return (
    <div className="flex items-center gap-3">
      <span className={`text-xs font-medium min-w-[100px] ${primary ? 'text-white' : ''}`} style={primary ? {} : { color: '#64748B' }}>{formatIntent(intent)}</span>
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${displayConfidence}%`, background: primary ? '#06B6D4' : 'rgba(6,182,212,0.35)' }} />
      </div>
      <span className={`text-xs font-mono min-w-[38px] text-right ${primary ? 'font-bold' : ''}`} style={{ color: primary ? '#06B6D4' : '#64748B' }}>{displayConfidence}%</span>
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

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-5" style={{ background: '#0A0A0A', border: '1px solid rgba(51,51,51,0.3)' }}>
      {children}
    </div>
  )
}

function CardTitle({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: '#94A3B8' }}>{children}</span>
}

function formatIntent(intent: string): string {
  return intent.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
