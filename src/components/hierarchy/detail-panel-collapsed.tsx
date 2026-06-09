'use client'

import React from 'react'
import { PanelRightOpen } from 'lucide-react'
import { STATUS_COLORS, type AgentData } from './types'

export function DetailPanelCollapsed({
  agent,
  onToggle,
}: {
  agent: AgentData | null
  onToggle: () => void
}) {
  return (
    <div
      style={{
        flexShrink: 0,
        background: '#0A0A0A',
        borderLeft: '1px solid rgba(51,51,51,0.25)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 12,
        gap: 12,
      }}
      className="w-0 lg:w-9 overflow-hidden"
    >
      <button
        onClick={onToggle}
        title="Show detail panel"
        style={{
          width: 28, height: 28, borderRadius: 6,
          border: '1px solid rgba(51,51,51,0.4)',
          background: 'rgba(255,255,255,0.03)',
          color: '#64748B', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'color 0.15s, border-color 0.15s, background 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#06B6D4'; e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)'; e.currentTarget.style.background = 'rgba(6,182,212,0.06)' }}
        onMouseLeave={e => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.borderColor = 'rgba(51,51,51,0.4)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
      >
        <PanelRightOpen size={14} />
      </button>
      {agent && (
        <>
          <div style={{
            width: 5, height: 5, borderRadius: '50%',
            background: STATUS_COLORS[agent.status] || STATUS_COLORS.offline,
            boxShadow: agent.status === 'active' ? `0 0 6px ${STATUS_COLORS[agent.status]}` : 'none',
          }} />
          <div style={{
            writingMode: 'vertical-rl', textOrientation: 'mixed',
            fontSize: 9, color: '#64748B', letterSpacing: 1,
            overflow: 'hidden', textOverflow: 'ellipsis', maxHeight: 120,
          }}>
            {agent.name}
          </div>
        </>
      )}
    </div>
  )
}
