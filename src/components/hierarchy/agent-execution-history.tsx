'use client'

import React, { useState } from 'react'
import { Zap, CheckCircle2, XCircle, SkipForward, Clock, TrendingUp, BarChart3 } from 'lucide-react'
import { ROLE_CONFIG } from './types'
import type { AgentData } from './types'
import { useExecutionHistory } from '@/hooks/use-execution-history'

// ─── Score color ────────────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 8) return '#22D3EE'
  if (score >= 6) return '#10B981'
  if (score >= 4) return '#F59E0B'
  return '#EF4444'
}

function statusIcon(status: string) {
  switch (status) {
    case 'completed': return <CheckCircle2 size={10} color="#10B981" />
    case 'failed': return <XCircle size={10} color="#EF4444" />
    case 'skipped': return <SkipForward size={10} color="#64748B" />
    case 'running': return <Zap size={10} color="#22D3EE" />
    default: return <Clock size={10} color="#64748B" />
  }
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return '--'
  const diff = Date.now() - new Date(dateStr).getTime()
  if (diff < 60000) return 'just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return `${Math.floor(diff / 86400000)}d ago`
}

// ─── Agent Execution History ────────────────────────────────────────────────

export function AgentExecutionHistory({ agent }: { agent: AgentData }) {
  const { stats, executions, loading } = useExecutionHistory(agent.id)
  const [expanded, setExpanded] = useState<string | null>(null)

  const config = ROLE_CONFIG[agent.roleGroup] || ROLE_CONFIG['Execution']

  if (loading) {
    return (
      <Section title="Execution History">
        <div style={{ fontSize: 10, color: '#555' }}>Loading...</div>
      </Section>
    )
  }

  if (!stats || stats.totalRuns === 0) {
    return (
      <Section title="Execution History">
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0' }}>
          <Clock size={12} color="#333" />
          <span style={{ fontSize: 10, color: '#555' }}>No executions yet</span>
        </div>
      </Section>
    )
  }

  return (
    <Section title="Execution History">
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 8 }}>
        <StatBox label="Total Runs" value={stats.totalRuns} color={config.color} />
        <StatBox label="Success Rate" value={`${stats.successRate}%`} color={stats.successRate >= 80 ? '#10B981' : stats.successRate >= 50 ? '#F59E0B' : '#EF4444'} />
        <StatBox label="Avg Score" value={stats.avgScore.toFixed(1)} color={scoreColor(stats.avgScore)} icon={<TrendingUp size={8} />} />
        <StatBox label="Last Run" value={timeAgo(stats.lastExecutedAt)} color="#64748B" icon={<Clock size={8} />} />
      </div>

      {/* Score bar */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <span style={{ fontSize: 8, color: '#555', fontWeight: 600 }}>AVERAGE SCORE</span>
          <span style={{ fontSize: 9, color: scoreColor(stats.avgScore), fontWeight: 700 }}>{stats.avgScore.toFixed(1)}/10</span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: 'rgba(51,51,51,0.3)', overflow: 'hidden' }}>
          <div style={{ width: `${Math.min(stats.avgScore * 10, 100)}%`, height: '100%', borderRadius: 2, background: scoreColor(stats.avgScore), transition: 'width 0.5s ease' }} />
        </div>
      </div>

      {/* Recent executions list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, maxHeight: 200, overflowY: 'auto' }} className="terrain-scroll">
        {executions.slice(0, 10).map(exec => (
          <div
            key={exec.id}
            onClick={() => setExpanded(expanded === exec.id ? null : exec.id)}
            style={{
              background: expanded === exec.id ? 'rgba(51,51,51,0.15)' : 'rgba(51,51,51,0.06)',
              border: `1px solid ${expanded === exec.id ? 'rgba(51,51,51,0.3)' : 'transparent'}`,
              borderRadius: 4,
              padding: '4px 6px',
              cursor: 'pointer',
              transition: 'background 0.15s, border-color 0.15s',
            }}
          >
            {/* Row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {statusIcon(exec.status)}
              <span style={{ fontSize: 9, fontWeight: 600, color: '#B0B0B0', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {exec.stepName}
              </span>
              {exec.score > 0 && (
                <span style={{ fontSize: 9, fontWeight: 700, color: scoreColor(exec.score) }}>
                  {exec.score.toFixed(1)}
                </span>
              )}
              <span style={{ fontSize: 7, color: '#555', flexShrink: 0 }}>
                {timeAgo(exec.completedAt || exec.startedAt)}
              </span>
            </div>

            {/* Expanded details */}
            {expanded === exec.id && (
              <div style={{ marginTop: 4, paddingLeft: 14, borderTop: '1px solid rgba(51,51,51,0.15)', paddingTop: 4 }}>
                {exec.summary && (
                  <div style={{ fontSize: 8, color: '#888', marginBottom: 3, lineHeight: 1.4 }}>{exec.summary}</div>
                )}
                {exec.verdict && (
                  <div style={{ fontSize: 8, marginBottom: 2 }}>
                    <span style={{ color: '#555', fontWeight: 600 }}>Verdict: </span>
                    <span style={{ color: exec.verdict === 'approve' ? '#10B981' : exec.verdict === 'reject' ? '#EF4444' : '#F59E0B', fontWeight: 600 }}>{exec.verdict}</span>
                  </div>
                )}
                {exec.issues.length > 0 && (
                  <div style={{ fontSize: 8, color: '#EF4444', marginBottom: 2 }}>
                    <span style={{ fontWeight: 600 }}>Issues: </span>
                    {exec.issues.join('; ')}
                  </div>
                )}
                <div style={{ fontSize: 7, color: '#444', display: 'flex', gap: 6 }}>
                  <span>Action: {exec.stepAction}</span>
                  <span>Status: {exec.status}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      {executions.length > 10 && (
        <div style={{ fontSize: 8, color: '#555', marginTop: 4, textAlign: 'center' }}>
          Showing 10 of {executions.length} executions
        </div>
      )}
    </Section>
  )
}

// ─── Stat Box ───────────────────────────────────────────────────────────────

function StatBox({ label, value, color, icon }: { label: string; value: string | number; color: string; icon?: React.ReactNode }) {
  return (
    <div style={{
      background: 'rgba(51,51,51,0.08)',
      border: '1px solid rgba(51,51,51,0.15)',
      borderRadius: 4,
      padding: '4px 6px',
    }}>
      <div style={{ fontSize: 7, color: '#555', fontWeight: 600, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 3 }}>
        {icon}{label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, color, marginTop: 1, display: 'flex', alignItems: 'center', gap: 3 }}>
        <BarChart3 size={8} color={color} opacity={0.5} />
        {value}
      </div>
    </div>
  )
}

// ─── Section wrapper ────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(51,51,51,0.2)' }}>
      <div style={{ fontSize: 8, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{title}</div>
      {children}
    </div>
  )
}
