'use client'

import { BarChart3 } from 'lucide-react'
import { STATUS_DISTRIBUTION } from '@/data/dashboard-constants'

const GAP = 4 // gap in stroke-units between segments

export function StatusDistributionCard({ statusDistribution }: { statusDistribution?: typeof STATUS_DISTRIBUTION }) {
  const distributionData = statusDistribution || STATUS_DISTRIBUTION
  const r = 50
  const sw = 12
  const C = 2 * Math.PI * r
  const totalAgents = distributionData.reduce((sum, s) => sum + s.count, 0)
  const activeSegments = distributionData.filter(s => s.count > 0)
  const totalGap = GAP * activeSegments.length
  const available = C - totalGap

  let acc = 0
  const segments = activeSegments.map((s) => {
    const len = (s.count / totalAgents) * available
    const offset = acc
    acc += len + GAP
    return { ...s, len, offset }
  })

  return (
    <div
      data-src="src/components/dashboard/status-distribution-card.tsx"
      className="rounded-xl p-4 relative overflow-hidden"
      style={{ background: 'rgba(26,26,26,0.6)', border: '1px solid rgba(51,51,51,0.5)' }}
    >
      <div
        className="absolute top-0 left-0 bottom-0 w-[3px] rounded-l-xl"
        style={{ background: '#06B6D4', opacity: 0.5 }}
      />
      <h3 className="text-[10px] font-semibold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: '#64748B' }}>
        <BarChart3 className="w-3.5 h-3.5" style={{ color: '#06B6D4' }} />
        Status Distribution
      </h3>

      {/* Donut chart */}
      <div className="flex items-center justify-center" style={{ height: 150 }}>
        <svg width="150" height="150" viewBox="0 0 150 150">
          {/* Track */}
          <circle cx="75" cy="75" r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={sw} />

          {/* Segments */}
          {segments.map((seg, i) => (
            <circle
              key={i}
              cx="75" cy="75" r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={sw}
              strokeDasharray={`${seg.len} ${C - seg.len}`}
              strokeDashoffset={-seg.offset}
              strokeLinecap="round"
              transform="rotate(-90 75 75)"
              style={{ opacity: 0.85, transition: 'opacity 0.2s' }}
            >
              <title>{seg.label}: {seg.count} ({Math.round((seg.count / totalAgents) * 100)}%)</title>
            </circle>
          ))}

          {/* Center text */}
          <text x="75" y="70" textAnchor="middle" dominantBaseline="middle" fill="#FFFFFF" fontSize="24" fontWeight="700">
            {totalAgents}
          </text>
          <text x="75" y="88" textAnchor="middle" dominantBaseline="middle" fill="#64748B" fontSize="9" fontWeight="500" letterSpacing={1}>
            AGENTS
          </text>
        </svg>
      </div>

      {/* Legend — only non-zero statuses */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-2">
        {distributionData.filter(s => s.count > 0).map((status) => (
          <div key={status.label} className="flex items-center gap-1.5">
            <span
              className="rounded-full flex-shrink-0"
              style={{ width: 7, height: 7, background: status.color }}
            />
            <span style={{ fontSize: 10, color: '#B0B0B0', flex: 1 }}>{status.label}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: status.color }}>
              {status.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}