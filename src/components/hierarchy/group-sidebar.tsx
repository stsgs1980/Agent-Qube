'use client'

import React from 'react'
import { Users, Activity, List } from 'lucide-react'
import { ROLE_CONFIG, ROLE_ORDER, STATUS_COLORS, type AgentData } from './types'
import { StatCard } from './stat-card'

export function GroupSidebar({
  agents,
  activeFilter,
  onFilterChange,
  selectedAgentId,
  onSelectAgent,
}: {
  agents: AgentData[]
  activeFilter: string | null
  onFilterChange: (group: string | null) => void
  selectedAgentId: string | null
  onSelectAgent: (id: string) => void
}) {
  const groupCounts: Record<string, number> = {}
  for (const a of agents) {
    groupCounts[a.roleGroup] = (groupCounts[a.roleGroup] || 0) + 1
  }

  const stats = {
    total: agents.length,
    active: agents.filter(a => a.status === 'active').length,
    idle: agents.filter(a => a.status === 'idle').length,
    error: agents.filter(a => a.status === 'error').length,
  }

  const filteredAgents = activeFilter
    ? agents.filter(a => a.roleGroup === activeFilter)
    : agents

  return (
    <div style={{ background: '#0A0A0A', borderRight: '1px solid rgba(51,51,51,0.25)', flexDirection: 'column', fontSize: 11 }} className="terrain-scroll hidden lg:flex lg:w-[220px] lg:flex-shrink-0 overflow-y-auto">
      {/* Groups */}
      <div style={{ padding: 12, borderBottom: '1px solid rgba(51,51,51,0.2)' }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Users size={10} color="#555" /> Role Groups
        </div>
        {ROLE_ORDER.map(group => {
          const cfg = ROLE_CONFIG[group]
          if (!cfg) return null
          const count = groupCounts[group] || 0
          const isActive = activeFilter === group
          return (
            <div key={group} onClick={() => onFilterChange(isActive ? null : group)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 5, cursor: 'pointer', marginBottom: 2, background: isActive ? `rgba(${cfg.colorRgb}, 0.06)` : 'transparent', transition: 'background 0.15s' }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(51,51,51,0.1)' }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
            >
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
              <span style={{ flex: 1, fontWeight: 500, color: isActive ? '#fff' : '#B0B0B0' }}>{group}</span>
              <span style={{ fontSize: 9, fontWeight: 700, color: '#555', background: 'rgba(51,51,51,0.2)', padding: '1px 5px', borderRadius: 3 }}>{count}</span>
            </div>
          )
        })}
      </div>

      {/* Stats */}
      <div style={{ padding: 12, borderBottom: '1px solid rgba(51,51,51,0.2)' }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
          <Activity size={10} color="#555" /> System Status
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <StatCard value={stats.total} label="Total" color="#fff" />
          <StatCard value={stats.active} label="Active" color="#22D3EE" />
          <StatCard value={stats.idle} label="Idle" color="#64748B" />
          <StatCard value={stats.error} label="Error" color="#EF4444" />
        </div>
      </div>

      {/* Agent list */}
      <div style={{ padding: 12, flex: 1 }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
          <List size={10} color="#555" /> Agents {activeFilter ? `(${activeFilter})` : ''}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredAgents.map(agent => {
            const cfg = ROLE_CONFIG[agent.roleGroup] || ROLE_CONFIG['Execution']
            const statusColor = STATUS_COLORS[agent.status] || STATUS_COLORS.offline
            const isSelected = agent.id === selectedAgentId
            return (
              <div key={agent.id} onClick={() => onSelectAgent(agent.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 6px', borderRadius: 4, cursor: 'pointer', fontSize: 10, color: isSelected ? '#fff' : '#B0B0B0', background: isSelected ? `rgba(${cfg.colorRgb}, 0.08)` : 'transparent' }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(51,51,51,0.08)' }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
              >
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: statusColor, flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{agent.name}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
