import { ROLE_GROUPS, FORMULA_TAXONOMY } from '@/data/dashboard-constants'

const fieldStyle = { width: '100%', padding: '8px 12px', background: '#111', border: '1px solid rgba(51,51,51,0.4)', color: '#fff', fontSize: 12, borderRadius: 6, outline: 'none' }
const labelStyle = { fontSize: 10, color: '#B0B0B0', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 0.5, display: 'block' as const, marginBottom: 4 }

export { fieldStyle, labelStyle }

export function AgentEditFormFields({ editForm, setEditForm }: {
  editForm: any; setEditForm: (f: any | ((prev: any) => any)) => void
}) {
  return (
    <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div><label style={labelStyle}>Agent Name</label><input value={editForm.name} onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))} style={fieldStyle} /></div>
      <div><label style={labelStyle}>Role</label><input value={editForm.role} onChange={e => setEditForm(prev => ({ ...prev, role: e.target.value }))} style={fieldStyle} /></div>
      <div>
        <label style={labelStyle}>Role Group</label>
        <select value={editForm.roleGroup} onChange={e => setEditForm(prev => ({ ...prev, roleGroup: e.target.value }))} style={fieldStyle}>
          {ROLE_GROUPS.map(g => <option key={g.name} value={g.name}>{g.name}</option>)}
        </select>
      </div>
      <div>
        <label style={labelStyle}>Status</label>
        <select value={editForm.status} onChange={e => setEditForm(prev => ({ ...prev, status: e.target.value }))} style={fieldStyle}>
          {['active', 'idle', 'paused', 'standby', 'error', 'offline'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label style={labelStyle}>Cognitive Formula</label>
        <select value={editForm.formula} onChange={e => setEditForm(prev => ({ ...prev, formula: e.target.value }))} style={fieldStyle}>
          {FORMULA_TAXONOMY.flatMap(c => c.formulas).map(f => <option key={f.name} value={f.name}>{f.name} — {f.full}</option>)}
        </select>
      </div>
      <div><label style={labelStyle}>Skills (comma-separated)</label><input value={editForm.skills} onChange={e => setEditForm(prev => ({ ...prev, skills: e.target.value }))} placeholder="e.g. analysis,reporting,optimization" style={fieldStyle} /></div>
      <div><label style={labelStyle}>Description</label><textarea value={editForm.description} onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))} rows={3} style={{ ...fieldStyle, resize: 'vertical' as const, minHeight: 60 }} /></div>
    </div>
  )
}