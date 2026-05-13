'use client'

import React from 'react'
import { ROLE_ORDER, FORMULA_DESC } from './types'
import type { AgentEditForm } from '@/hooks/use-agent-edit-form'

// ─── Shared edit-mode input styles ──────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '6px 10px',
  background: '#111', border: '1px solid rgba(51,51,51,0.4)',
  color: '#fff', fontSize: 11, borderRadius: 5, outline: 'none',
}

const selectStyle: React.CSSProperties = {
  width: '100%', padding: '6px 10px',
  background: '#111', border: '1px solid rgba(51,51,51,0.4)',
  color: '#fff', fontSize: 11, borderRadius: 5,
  outline: 'none', appearance: 'auto' as any,
}

const labelStyle: React.CSSProperties = {
  fontSize: 10, color: '#B0B0B0', fontWeight: 600,
  textTransform: 'uppercase' as const, letterSpacing: 0.5,
  display: 'block', marginBottom: 3,
}

export { inputStyle, selectStyle, labelStyle }

// ─── Agent Edit Form ─────────────────────────────────────────────────────

export function AgentEditFormFields({
  form,
  setters,
}: {
  form: AgentEditForm
  setters: {
    setEditName: (v: string) => void
    setEditRole: (v: string) => void
    setEditRoleGroup: (v: string) => void
    setEditStatus: (v: string) => void
    setEditFormula: (v: string) => void
    setEditSkills: (v: string) => void
    setEditDescription: (v: string) => void
  }
}) {
  return (
    <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
      <div>
        <label style={labelStyle}>Name</label>
        <input value={form.name} onChange={e => setters.setEditName(e.target.value)} placeholder="Agent name" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Role</label>
        <input value={form.role} onChange={e => setters.setEditRole(e.target.value)} placeholder="Agent role" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Role Group</label>
        <select value={form.roleGroup} onChange={e => setters.setEditRoleGroup(e.target.value)} style={selectStyle}>
          {ROLE_ORDER.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <div>
        <label style={labelStyle}>Status</label>
        <select value={form.status} onChange={e => setters.setEditStatus(e.target.value)} style={selectStyle}>
          {['active', 'idle', 'paused', 'standby', 'error', 'offline'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label style={labelStyle}>Cognitive Formula</label>
        <select value={form.formula} onChange={e => setters.setEditFormula(e.target.value)} style={selectStyle}>
          {Object.keys(FORMULA_DESC).map(f => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>
      <div>
        <label style={labelStyle}>Skills (comma-separated)</label>
        <input value={form.skills} onChange={e => setters.setEditSkills(e.target.value)} placeholder="e.g. analysis,reporting" style={inputStyle} />
      </div>
      <div>
        <label style={labelStyle}>Description</label>
        <textarea
          value={form.description}
          onChange={e => setters.setEditDescription(e.target.value)}
          placeholder="Agent description..."
          rows={3}
          style={{ ...inputStyle, resize: 'vertical' as const, minHeight: 60 }}
        />
      </div>
    </div>
  )
}
