'use client'

import { useState, useEffect } from 'react'
import { QUICK_STATS } from '@/data/dashboard-constants'
import { MiniSparkline } from './mini-sparkline'

function KPICard({ kpi, mounted, idx }: {
  kpi: { label: string; value: string; color: string; change: string; changeColor: string; icon: string; sparkData?: number[] }
  mounted: boolean; idx: number
}) {
  return (
    <div key={kpi.label}
      style={{ position: 'relative', background: 'rgba(20, 20, 20, 0.7)', border: '1px solid rgba(51, 51, 51, 0.4)',
        borderRadius: 10, padding: '14px 16px', overflow: 'hidden',
        opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity 0.4s ease ${idx * 60}ms, transform 0.4s ease ${idx * 60}ms` }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${kpi.color}40`; e.currentTarget.style.boxShadow = `0 0 20px ${kpi.color}08, inset 0 1px 0 ${kpi.color}10` }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(51, 51, 51, 0.4)'; e.currentTarget.style.boxShadow = 'none' }}>
      <div style={{ position: 'absolute', top: 0, left: 16, right: 16, height: 1,
        background: `linear-gradient(90deg, transparent, ${kpi.color}60, transparent)` }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span style={{ fontSize: 11, color: kpi.color, opacity: 0.7, lineHeight: 1 }}>{kpi.icon}</span>
        <span style={{ fontSize: 9, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600 }}>{kpi.label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
        <div>
          <span style={{ fontSize: 26, fontWeight: 800, color: kpi.color, lineHeight: 1, letterSpacing: '-0.5px' }}>{kpi.value}</span>
          <div style={{ fontSize: 9, color: kpi.changeColor, marginTop: 4, fontWeight: 500 }}>{kpi.change}</div>
        </div>
        {kpi.sparkData && (
          <div style={{ flexShrink: 0, marginBottom: 2 }}>
            <MiniSparkline data={kpi.sparkData} color={kpi.color} width={52} height={20} />
          </div>
        )}
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 40,
        background: `linear-gradient(to top, ${kpi.color}04, transparent)`, pointerEvents: 'none' }} />
    </div>
  )
}

export function KPIStrip({ quickStats }: { quickStats?: typeof QUICK_STATS }) {
  const stats = quickStats || QUICK_STATS
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(t)
  }, [])

  const kpis = [
    { label: 'Total Agents', value: String(stats[0]?.numericValue ?? '26'), color: '#06B6D4', change: '+2 this week', changeColor: '#22D3EE', sparkData: [22, 23, 24, 24, 25, 26], icon: '⬡' },
    { label: 'Active Now', value: String(stats[4]?.numericValue ?? '16'), color: '#22D3EE', change: `${stats[5]?.numericValue ?? 4} idle / ${stats[2] ? '' : '1 paused'}`, changeColor: '#64748B', icon: '◉' },
    { label: 'Tasks Running', value: String(stats[6]?.numericValue ?? '12'), color: '#0891B2', change: '187 completed', changeColor: '#22D3EE', icon: '⟐' },
    { label: 'Success Rate', value: '94.7%', color: '#22D3EE', change: '+0.3%', changeColor: '#22D3EE', sparkData: [90, 92, 91, 93, 94, 95], icon: '△' },
    { label: 'Avg Response', value: '1.2s', color: '#B0B0B0', change: '-0.3s', changeColor: '#22D3EE', icon: '↻' },
  ]

  return (
    <div data-src="src/components/dashboard/kpi-strip.tsx" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
      {kpis.map((kpi, idx) => <KPICard key={kpi.label} kpi={kpi} mounted={mounted} idx={idx} />)}
    </div>
  )
}