'use client'

import React from 'react'
import { RefreshCw, Plus, ChevronRight } from 'lucide-react'

// ─── Header bar with P-MAS branding, WS status, Refresh, Add Agent ─────────────

export function HierarchyHeader({
  wsConnected,
  onRefresh,
  onAddAgent,
}: {
  wsConnected: boolean
  onRefresh: () => void
  onAddAgent: () => void
}) {
  return (
    <div style={{
      background: '#0A0A0A', borderBottom: '1px solid rgba(51,51,51,0.5)',
      padding: '0 20px', height: 48, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', position: 'relative', flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 800, color: '#06B6D4',
        }}>P</div>
        <div>
          <span style={{ fontSize: 13, fontWeight: 700 }}>P-</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#06B6D4' }}>MAS</span>
        </div>
        <div style={{ fontSize: 11, color: '#64748B', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span>Dashboard</span>
          <ChevronRight size={10} color="#555" />
          <span style={{ color: '#fff', fontWeight: 600 }}>Hierarchy</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 10,
          background: wsConnected ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)',
          border: wsConnected ? '1px solid rgba(34,197,94,0.15)' : '1px solid rgba(239,68,68,0.15)',
          fontSize: 9, fontWeight: 700, color: wsConnected ? '#22C55E' : '#EF4444',
        }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: wsConnected ? '#22C55E' : '#EF4444', boxShadow: wsConnected ? '0 0 4px #22C55E' : '0 0 4px #EF4444', animation: 'pulse 2s ease-in-out infinite' }} />
          {wsConnected ? 'LIVE' : 'OFFLINE'}
        </div>
        <button onClick={onRefresh} style={{
          padding: '5px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600,
          background: '#1A1A1A', border: '1px solid rgba(51,51,51,0.4)', color: '#64748B',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
        }}><RefreshCw size={10} />Refresh</button>
        <button onClick={onAddAgent} style={{
          padding: '5px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600,
          background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.15)',
          color: '#06B6D4', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
        }}><Plus size={10} />Add Agent</button>
      </div>
    </div>
  )
}
