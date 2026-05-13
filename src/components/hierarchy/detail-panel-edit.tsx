'use client'

import React from 'react'
import { X, Pencil, Save, RotateCcw, Trash2, PanelRightClose, AlertTriangle } from 'lucide-react'
import { ROLE_CONFIG } from './types'
import { AgentEditFormFields, labelStyle } from './agent-edit-form'
import type { AgentData } from './types'
import type { AgentEditForm } from '@/hooks/use-agent-edit-form'

interface DetailPanelEditProps {
  agent: AgentData
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
  saving: boolean
  deleting: boolean
  showDeleteConfirm: boolean
  onToggle: () => void
  onCancel: () => void
  onSave: () => void
  onDelete: () => void
  onShowDeleteConfirm: () => void
}

export function DetailPanelEdit({
  agent, form, setters,
  saving, deleting, showDeleteConfirm,
  onToggle, onCancel, onSave, onDelete, onShowDeleteConfirm,
}: DetailPanelEditProps) {
  const config = ROLE_CONFIG[agent.roleGroup] || ROLE_CONFIG['Исполнение']

  return (
    <div
      style={{
        width: 280, flexShrink: 0, background: '#0A0A0A',
        borderLeft: '1px solid rgba(51,51,51,0.25)',
        display: 'flex', flexDirection: 'column', overflowY: 'auto',
      }}
      className="terrain-scroll"
    >
      {/* Header */}
      <div style={{ padding: 16, position: 'relative', borderBottom: '1px solid rgba(51,51,51,0.2)' }}>
        <div style={{ height: 2, position: 'absolute', top: 0, left: 0, right: 0, background: `linear-gradient(90deg, transparent, ${config.color}, transparent)`, opacity: 0.6 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: `rgba(${config.colorRgb}, 0.1)`, border: `1px solid rgba(${config.colorRgb}, 0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Pencil size={12} color={config.color} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: config.color }}>Edit Agent</span>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            <IconButton icon={<PanelRightClose size={11} />} onClick={onToggle} title="Hide detail panel" />
            <IconButton icon={<X size={12} />} onClick={onCancel} title="Cancel" />
          </div>
        </div>
      </div>

      {/* Form */}
      <AgentEditFormFields form={form} setters={setters} />

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div style={{ padding: '10px 16px', background: 'rgba(239,68,68,0.06)', borderTop: '1px solid rgba(239,68,68,0.2)', borderBottom: '1px solid rgba(239,68,68,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <AlertTriangle size={12} color="#EF4444" />
            <span style={{ fontSize: 10, fontWeight: 600, color: '#EF4444' }}>Delete &quot;{agent.name}&quot;?</span>
          </div>
          <div style={{ fontSize: 9, color: '#B0B0B0', marginBottom: 8 }}>
            This action cannot be undone. The agent and its tasks will be permanently removed.
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={onDelete} disabled={deleting} style={{ flex: 1, padding: '5px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600, background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', cursor: deleting ? 'wait' : 'pointer', opacity: deleting ? 0.6 : 1 }}>
              {deleting ? 'Deleting...' : 'Confirm Delete'}
            </button>
            <button onClick={() => onShowDeleteConfirm()} style={{ flex: 1, padding: '5px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600, background: '#1A1A1A', border: '1px solid rgba(51,51,51,0.4)', color: '#B0B0B0', cursor: 'pointer' }}>
              Keep
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(51,51,51,0.2)', display: 'flex', gap: 6 }}>
        <button onClick={onSave} disabled={saving || !form.name.trim()} style={{ flex: 1, padding: '6px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600, background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', color: '#06B6D4', cursor: saving ? 'wait' : 'pointer', opacity: !form.name.trim() || saving ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, transition: 'opacity 0.15s' }}>
          <Save size={10} />{saving ? 'Saving...' : 'Save'}
        </button>
        <button onClick={onCancel} style={{ flex: 1, padding: '6px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600, background: '#1A1A1A', border: '1px solid rgba(51,51,51,0.4)', color: '#B0B0B0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, transition: 'background 0.15s' }}>
          <RotateCcw size={10} />Cancel
        </button>
        {!showDeleteConfirm && (
          <button onClick={onShowDeleteConfirm} style={{ padding: '6px 10px', borderRadius: 5, fontSize: 10, fontWeight: 600, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}>
            <Trash2 size={10} />
          </button>
        )}
      </div>
    </div>
  )
}

function IconButton({ icon, onClick, title }: { icon: React.ReactNode; onClick: () => void; title: string }) {
  return (
    <button onClick={onClick} title={title} style={{ width: 24, height: 24, borderRadius: 5, border: '1px solid rgba(51,51,51,0.4)', background: 'rgba(255,255,255,0.03)', color: '#B0B0B0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {icon}
    </button>
  )
}
