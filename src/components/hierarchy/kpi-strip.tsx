'use client'

import React from 'react'
import type { AgentData } from './types'

export function KPIStrip({ agents }: { agents: AgentData[] }) {
  const byStatus: Record<string, number> = {}
  for (const a of agents) {
    byStatus[a.status] = (byStatus[a.status] || 0) + 1
  }

  const items = [
    { color: '#fff', value: agents.length, label: 'Total' },
    { color: '#22D3EE', value: byStatus.active || 0, label: 'Active' },
    { color: '#64748B', value: byStatus.idle || 0, label: 'Idle' },
    { color: '#F59E0B', value: byStatus.paused || 0, label: 'Paused' },
    { color: '#EF4444', value: byStatus.error || 0, label: 'Error' },
    { color: '#8B5CF6', value: byStatus.standby || 0, label: 'Standby' },
  ]

  return (
    <div className="flex flex-wrap gap-3 lg:gap-6" style={{ background: '#0A0A0A', borderTop: '1px solid rgba(51,51,51,0.25)', minHeight: 32, display: 'flex', alignItems: 'center', padding: '0 20px', flexShrink: 0 }}>
      {items.map(item => (
        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.color }} />
          <span style={{ fontSize: 12, fontWeight: 800, color: item.color }}>{item.value}</span>
          <span style={{ fontSize: 9, color: '#555' }}>{item.label}</span>
        </div>
      ))}
    </div>
  )
}
