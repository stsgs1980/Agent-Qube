'use client'

import { useState, useEffect } from 'react'
import { Activity } from 'lucide-react'
import { HealthBar, HealthChip } from './health-card-parts'

function useBarAnimation() {
  const [widths, setWidths] = useState([0, 0, 0])
  useEffect(() => {
    const t = [
      setTimeout(() => setWidths(p => {
        const n = [...p];
        n[0] = 34;
        return n;
      } ), 100),
      setTimeout(() => setWidths(p => {
        const n = [...p]
        n[1] = 67
        return n
      }), 200),
      setTimeout(() => setWidths(p => {
        const n = [...p]
        n[2] = 23
        return n
      }), 300),
    ]
    return () => t.forEach(clearTimeout)
  }, [])
  return widths
}

const BAR_DEFS = [
  { label: 'CPU', value: 34, color: '#06B6D4' },
  { label: 'Memory', value: 67, color: '#0891B2' },
  { label: 'Network', value: 23, color: '#0E7490' },
]

const CHIP_DEFS = [
  { label: 'Uptime', value: '99.7%', color: '#22D3EE', pulse: true },
  { label: 'Connections', value: '55', color: '#06B6D4' },
  { label: 'Errors', value: '0.3%', color: '#22D3EE' },
]

export function SystemHealthCard() {
  const widths = useBarAnimation()
  const bars = BAR_DEFS.map((b, i) => ({ ...b, width: widths[i] }))

  return (
    <div data-src="src/components/dashboard/system-health-card.tsx"
      style={{ background: 'rgba(20, 20, 20, 0.7)', border: '1px solid rgba(51, 51, 51, 0.4)',
        borderRadius: 10, padding: '16px 18px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
        <Activity style={{ width: 13, height: 13, color: '#0891B2' }} />
        <span style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#64748B' }}>System Health</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {bars.map(bar => <HealthBar key={bar.label} bar={bar} />)}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(51,51,51,0.3)' }}>
        {CHIP_DEFS.map(chip => <HealthChip key={chip.label} chip={chip} />)}
      </div>
    </div>
  )
}