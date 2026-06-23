'use client'

import { AlertTriangle, Trash2 } from 'lucide-react'

export function DeleteConfirmDialog({
  workflowName, onConfirm, onCancel,
}: {
  workflowName: string
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel() }}>
      <div className="w-full max-w-sm rounded-xl p-6"
        style={{ background: '#0A0A0A', border: '1px solid rgba(239,68,68,0.3)', boxShadow: '0 0 40px rgba(239,68,68,0.1)' }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(239,68,68,0.15)' }}>
            <AlertTriangle size={20} style={{ color: '#EF4444' }} />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Delete Workflow</h3>
            <p className="text-[10px]" style={{ color: '#64748B' }}>This action cannot be undone</p>
          </div>
        </div>
        <p className="text-[11px] mb-5" style={{ color: '#B0B0B0' }}>
          Are you sure you want to delete <span className="font-semibold text-white">&ldquo;{workflowName}&rdquo;</span>?
          All associated steps and execution history will be permanently removed.
        </p>
        <div className="flex items-center gap-3 justify-end">
          <button onClick={onCancel}
            className="px-4 py-2 rounded-md text-[10px] font-medium transition-all duration-200 hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(51,51,51,0.4)', color: '#64748B' }}>
            Cancel
          </button>
          <button onClick={onConfirm}
            className="px-4 py-2 rounded-md text-[10px] font-bold transition-all duration-200 hover:scale-105"
            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444' }}>
            <span className="flex items-center gap-1.5"><Trash2 size={10} />Delete</span>
          </button>
        </div>
      </div>
    </div>
  )
}
