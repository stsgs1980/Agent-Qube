'use client'

import React from 'react'
import { ChevronRight } from 'lucide-react'
import { ROLE_CONFIG, FORMULA_DESC, type AgentData } from './types'

// ─── Connection Item ──────────────────────────────────────────────────────

function ConnItem({ label, name, color }: { label: string; name: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#B0B0B0', padding: '3px 6px', borderRadius: 4, background: 'rgba(51,51,51,0.08)' }}>
      {label && <span style={{ color: '#555', fontSize: 9, width: 40, flexShrink: 0 }}>{label}</span>}
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span>{name}</span>
      <ChevronRight size={8} color="#555" style={{ marginLeft: 'auto', flexShrink: 0 }} />
    </div>
  )
}

// ─── Agent Detail Info (view-mode body) ───────────────────────────────────

export function AgentDetailInfo({ agent, allAgents }: { agent: AgentData; allAgents: AgentData[] }) {
  const config = ROLE_CONFIG[agent.roleGroup] || ROLE_CONFIG['Execution']
  const skills = agent.skills ? agent.skills.split(',').filter(Boolean) : []
  const formulaDesc = FORMULA_DESC[agent.formula] || ''
  const parent = agent.parentId ? allAgents.find(a => a.id === agent.parentId) : null
  const twin = agent.twinId ? allAgents.find(a => a.id === agent.twinId) : null
  const children = allAgents.filter(a => a.parentId === agent.id)

  return (
    <>
      {/* Description */}
      <Section title="Description">
        <div style={{ fontSize: 11, color: '#B0B0B0', lineHeight: 1.5 }}>{agent.description}</div>
      </Section>

      {/* Formula */}
      <Section title="Cognitive Formula">
        <div style={{ background: `rgba(${config.colorRgb}, 0.06)`, border: `1px solid rgba(${config.colorRgb}, 0.15)`, borderRadius: 6, padding: '8px 10px' }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: config.color }}>{agent.formula}</div>
          <div style={{ fontSize: 9, color: '#64748B', marginTop: 2 }}>{formulaDesc}</div>
        </div>
      </Section>

      {/* Skills */}
      <Section title={`Skills (${skills.length})`}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {skills.map(skill => (
            <span key={skill} style={{ fontSize: 8, fontWeight: 600, padding: '2px 5px', borderRadius: 3, background: 'rgba(51,51,51,0.2)', color: '#64748B', border: '1px solid rgba(51,51,51,0.3)' }}>
              {skill.trim()}
            </span>
          ))}
        </div>
      </Section>

      {/* Connections */}
      <Section title="Connections">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {parent && <ConnItem label="Parent" name={parent.name} color={ROLE_CONFIG[parent.roleGroup]?.color || '#888'} />}
          {twin && <ConnItem label="Twin" name={twin.name} color={ROLE_CONFIG[twin.roleGroup]?.color || '#888'} />}
          {children.length > 0 && (
            <div>
              <span style={{ fontSize: 9, color: '#555' }}>Children</span>
              <div style={{ marginLeft: 8, marginTop: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {children.map(c => <ConnItem key={c.id} label="" name={c.name} color={ROLE_CONFIG[c.roleGroup]?.color || '#888'} />)}
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Tasks */}
      <Section title="Tasks">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: config.color }}>
            {Array.isArray(agent.tasks) ? agent.tasks.length : 0}
          </span>
          <span style={{ fontSize: 9, color: '#555' }}>assigned</span>
        </div>
      </Section>
    </>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(51,51,51,0.2)' }}>
      <div style={{ fontSize: 8, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{title}</div>
      {children}
    </div>
  )
}
