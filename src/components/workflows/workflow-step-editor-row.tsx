'use client'

import { Trash2 } from 'lucide-react'
import { ROLE_GROUP_OPTIONS, ACTION_OPTIONS } from './workflow-types'

export function StepEditorRow({
  step, index, updateStep, removeStep, canRemove,
}: {
  step: { name: string; roleGroup: string; action: string; timeout: number }
  index: number
  updateStep: (i: number, field: string, value: any) => void
  removeStep: (i: number) => void
  canRemove: boolean
}) {
  return (
    <div className="flex items-start gap-2 p-3 rounded-lg"
      style={{ background: 'rgba(13,13,13,0.6)', border: '1px solid rgba(51,51,51,0.3)' }}>
      <div className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 text-[9px] font-bold"
        style={{ background: 'rgba(6,182,212,0.15)', color: '#06B6D4' }}>{index + 1}</div>
      <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
        <input type="text" value={step.name} onChange={(e) => updateStep(index, 'name', e.target.value)}
          placeholder="Step name" className="px-2 py-1.5 rounded-md text-[10px] text-white outline-none col-span-2 sm:col-span-1"
          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(51,51,51,0.3)' }}
          onFocus={(e) => e.target.style.borderColor = 'rgba(6,182,212,0.3)'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(51,51,51,0.3)'} />
        <select value={step.roleGroup} onChange={(e) => updateStep(index, 'roleGroup', e.target.value)}
          className="px-2 py-1.5 rounded-md text-[10px] text-white outline-none"
          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(51,51,51,0.3)' }}>
          {ROLE_GROUP_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <select value={step.action} onChange={(e) => updateStep(index, 'action', e.target.value)}
          className="px-2 py-1.5 rounded-md text-[10px] text-white outline-none"
          style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(51,51,51,0.3)' }}>
          {ACTION_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <div className="flex items-center gap-1">
          <input type="number" value={step.timeout} onChange={(e) => updateStep(index, 'timeout', parseInt(e.target.value) || 300)}
            className="px-2 py-1.5 rounded-md text-[10px] text-white outline-none w-16"
            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(51,51,51,0.3)' }}
            onFocus={(e) => e.target.style.borderColor = 'rgba(6,182,212,0.3)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(51,51,51,0.3)'} />
          <span className="text-[8px]" style={{ color: '#475569' }}>sec</span>
        </div>
      </div>
      <button onClick={() => removeStep(index)} disabled={!canRemove}
        className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
        <Trash2 size={10} style={{ color: '#EF4444' }} />
      </button>
    </div>
  )
}
