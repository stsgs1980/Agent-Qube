'use client'

import { Plus, X, Loader2, CheckCircle2 } from 'lucide-react'
import { type WorkflowData } from './workflow-types'
import { StepEditorRow } from './workflow-step-editor-row'
import { useWorkflowCreate } from '@/hooks/use-workflow-create'

export function CreateWorkflowDialog({
  onClose, onCreated,
}: {
  onClose: () => void
  onCreated: () => void
}) {
  const {
    name, setName, description, setDescription, triggerType, setTriggerType,
    tagsStr, setTagsStr, steps, addStep, removeStep, updateStep, saving, handleSave,
  } = useWorkflowCreate(onCreated, onClose)

  const inputStyle = { background: 'rgba(13,13,13,0.8)', border: '1px solid rgba(51,51,51,0.4)' } as const
  const focusBorder = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    e.target.style.borderColor = e.type === 'focus' ? 'rgba(6,182,212,0.4)' : 'rgba(51,51,51,0.4)'

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.9)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl"
        style={{ background: '#0A0A0A', border: '1px solid rgba(51,51,51,0.5)', boxShadow: '0 0 40px rgba(6,182,212,0.1)' }}>
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
          style={{ background: '#0A0A0A', borderBottom: '1px solid rgba(51,51,51,0.3)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.15)' }}><Plus size={16} style={{ color: '#06B6D4' }} /></div>
            <h3 className="text-white font-semibold text-sm">New Workflow</h3>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ background: 'rgba(51,51,51,0.3)', border: '1px solid rgba(51,51,51,0.4)' }}><X size={14} style={{ color: '#888' }} /></button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748B' }}>Name <span style={{ color: '#EF4444' }}>*</span></label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Development Pipeline"
              className="w-full px-3 py-2 rounded-md text-[11px] text-white outline-none transition-all duration-200"
              style={inputStyle} onFocus={focusBorder} onBlur={focusBorder} />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748B' }}>Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what this workflow does..." rows={2}
              className="w-full px-3 py-2 rounded-md text-[11px] text-white outline-none resize-none transition-all duration-200"
              style={inputStyle} onFocus={focusBorder} onBlur={focusBorder} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748B' }}>Trigger Type</label>
              <select value={triggerType} onChange={(e) => setTriggerType(e.target.value as WorkflowData['triggerType'])}
                className="w-full px-3 py-2 rounded-md text-[11px] text-white outline-none" style={inputStyle}>
                <option value="manual">Manual</option><option value="event">Event</option>
                <option value="schedule">Schedule</option><option value="webhook">Webhook</option><option value="agent">Agent</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748B' }}>Tags (comma-separated)</label>
              <input type="text" value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} placeholder="e.g. core, development"
                className="w-full px-3 py-2 rounded-md text-[11px] text-white outline-none transition-all duration-200"
                style={inputStyle} onFocus={focusBorder} onBlur={focusBorder} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Pipeline Steps</label>
              <button onClick={addStep} className="flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-medium transition-all duration-200 hover:scale-105"
                style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.2)', color: '#06B6D4' }}><Plus size={9} /> Add Step</button>
            </div>
            <div className="space-y-2">
              {steps.map((step, i) => (
                <StepEditorRow key={i} step={step} index={i} updateStep={updateStep} removeStep={removeStep} canRemove={steps.length > 1} />
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 flex items-center justify-end gap-3 px-6 py-4"
          style={{ background: '#0A0A0A', borderTop: '1px solid rgba(51,51,51,0.3)' }}>
          <button onClick={onClose} className="px-4 py-2 rounded-md text-[10px] font-medium transition-all duration-200 hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(51,51,51,0.4)', color: '#64748B' }}>Cancel</button>
          <button onClick={handleSave} disabled={saving || !name.trim()}
            className="px-4 py-2 rounded-md text-[10px] font-bold transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', color: '#06B6D4' }}>
            {saving ? <span className="flex items-center gap-1.5"><Loader2 size={10} className="animate-spin" />Saving...</span>
              : <span className="flex items-center gap-1.5"><CheckCircle2 size={10} />Create Workflow</span>}
          </button>
        </div>
      </div>
    </div>
  )
}
