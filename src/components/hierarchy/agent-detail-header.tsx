'use client'

import React from 'react'
import { Brain, X, Pencil, PanelRightClose } from 'lucide-react'
import { ROLE_CONFIG, STATUS_COLORS, FORMULA_DESC, type AgentData } from './types'

interface AgentDetailHeaderProps {
  agent: AgentData
  onToggle: () => void
  onEdit: () => void
  onClose: () => void
}

export function AgentDetailHeader({ agent, onToggle, onEdit, onClose }: AgentDetailHeaderProps) {
  const config = ROLE_CONFIG[agent.roleGroup] || ROLE_CONFIG['Execution']
  const statusColor = STATUS_COLORS[agent.status] || STATUS_COLORS.offline

  return (
    <div style={{ padding: 16, position: 'relative', borderBottom: '1px solid rgba(51,51,51,0.2)' }}>
      <div style={{ height: 2, position: 'absolute', top: 0, left: 0, right: 0, background: `linear-gradient(90deg, transparent, ${config.color}, transparent)`, opacity: 0.6 }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: `rgba(${config.colorRgb}, 0.1)`, border: `1px solid rgba(${config.colorRgb}, 0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Brain size={16} color={config.color} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{agent.name}</div>
            <div style={{ fontSize: 11, color: config.color, fontWeight: 500 }}>{agent.role}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <HeaderButton onClick={onToggle} title="Hide detail panel" icon={<PanelRightClose size={11} />} />
          <HeaderButton onClick={onEdit} title="Edit agent" icon={<Pencil size={11} />} />
          <HeaderButton onClick={onClose} title="Close" icon={<X size={12} />} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}30` }}>
          {agent.status.toUpperCase()}
        </span>
        <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 6px', borderRadius: 4, background: `rgba(${config.colorRgb}, 0.08)`, color: config.color, border: `1px solid rgba(${config.colorRgb}, 0.15)` }}>
          {agent.formula}
        </span>
        <span style={{ fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: 'rgba(51,51,51,0.15)', color: '#B0B0B0', border: '1px solid rgba(51,51,51,0.25)' }}>
          {config.label}
        </span>
      </div>
    </div>
  )
}

function HeaderButton({ onClick, title, icon }: { onClick: () => void; title: string; icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 24, height: 24, borderRadius: 5,
        border: '1px solid rgba(51,51,51,0.4)',
        background: 'rgba(255,255,255,0.03)',
        color: '#B0B0B0', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'color 0.15s, border-color 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = '#06B6D4'; e.currentTarget.style.borderColor = 'rgba(6,182,212,0.3)' }}
      onMouseLeave={e => { e.currentTarget.style.color = '#B0B0B0'; e.currentTarget.style.borderColor = 'rgba(51,51,51,0.4)' }}
    >
      {icon}
    </button>
  )
}
