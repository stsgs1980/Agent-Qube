'use client'

import React, { useState, useCallback } from 'react'
import { X, Plus } from 'lucide-react'
import { ROLE_ORDER, FORMULA_DESC } from './types'
import { useAgentMutations } from '@/hooks/use-agent-mutations'

const DEFAULT_FORM = { name: '', role: '', group: 'Execution', formula: 'ReAct', status: 'active', skills: '', description: '' }

// ─── Add Agent modal — self-contained form with its own state ───────────────────

export function AddAgentModal({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState(DEFAULT_FORM)
  const update = (key: string, val: string) => setForm(prev => ({ ...prev, [key]: val }))
  const { createAgent, creating } = useAgentMutations({ onSuccess: () => { setForm(DEFAULT_FORM); onClose(); onCreated() } })

  const handleSubmit = useCallback(async () => {
    if (!form.name.trim()) return
    await createAgent({
      name: form.name,
      role: form.role || 'Custom Agent',
      roleGroup: form.group,
      formula: form.formula,
      status: form.status,
      skills: form.skills,
      description: form.description || `${form.role || 'Custom Agent'} agent in ${form.group} group`,
    })
  }, [form, createAgent])

  if (!open) return null

  const inputStyle = { width: '100%', padding: '8px 12px', background: '#111', border: '1px solid rgba(51,51,51,0.4)', color: '#fff', fontSize: 12, borderRadius: 6, outline: 'none' } as React.CSSProperties
  const labelStyle = { fontSize: 10, color: '#B0B0B0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, display: 'block', marginBottom: 4 } as React.CSSProperties

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: '#0A0A0A', border: '1px solid rgba(51,51,51,0.5)', borderRadius: 12, width: 400, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(51,51,51,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div><div style={{ fontSize: 14, fontWeight: 700, color: '#06B6D4' }}>Add New Agent</div><div style={{ fontSize: 10, color: '#64748B', marginTop: 2 }}>Create a new agent in the multi-agent system</div></div>
          <button onClick={onClose} style={{ padding: 4, borderRadius: 4, background: 'rgba(51,51,51,0.2)', border: '1px solid rgba(51,51,51,0.3)', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={14} /></button>
        </div>
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div><label style={labelStyle}>Agent Name</label><input value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Novyj-Agent" style={inputStyle} /></div>
          <div><label style={labelStyle}>Role</label><input value={form.role} onChange={e => update('role', e.target.value)} placeholder="e.g. Custom Agent" style={inputStyle} /></div>
          <div><label style={labelStyle}>Role Group</label><select value={form.group} onChange={e => update('group', e.target.value)} style={inputStyle}>{ROLE_ORDER.map(g => <option key={g} value={g}>{g}</option>)}</select></div>
          <div><label style={labelStyle}>Cognitive Formula</label><select value={form.formula} onChange={e => update('formula', e.target.value)} style={inputStyle}>{Object.keys(FORMULA_DESC).map(f => <option key={f} value={f}>{f} — {FORMULA_DESC[f].split('—')[0].trim()}</option>)}</select></div>
          <div><label style={labelStyle}>Status</label><select value={form.status} onChange={e => update('status', e.target.value)} style={inputStyle}>{['active', 'idle', 'paused', 'standby'].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          <div><label style={labelStyle}>Skills (comma-separated)</label><input value={form.skills} onChange={e => update('skills', e.target.value)} placeholder="e.g. analysis,reporting,optimization" style={inputStyle} /></div>
          <div><label style={labelStyle}>Description</label><textarea value={form.description} onChange={e => update('description', e.target.value)} placeholder="Describe this agent's purpose..." rows={3} style={{ ...inputStyle, resize: 'vertical' as const, minHeight: 60 }} /></div>
        </div>
        <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(51,51,51,0.3)', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose} style={{ padding: '6px 16px', borderRadius: 6, background: '#1A1A1A', border: '1px solid rgba(51,51,51,0.4)', color: '#B0B0B0', cursor: 'pointer', fontSize: 11 }}>Cancel</button>
          <button onClick={handleSubmit} disabled={!form.name.trim() || creating} style={{ padding: '6px 16px', borderRadius: 6, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', color: '#06B6D4', cursor: creating ? 'wait' : 'pointer', fontSize: 11, opacity: !form.name.trim() || creating ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: 4 }}><Plus size={10} />{creating ? 'Creating...' : 'Create Agent'}</button>
        </div>
      </div>
    </div>
  )
}
