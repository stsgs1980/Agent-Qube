'use client'

import { useState } from 'react'
import { Sparkles, X } from 'lucide-react'

export function WorkflowExecInputDialog({ open, onClose, onExecute, workflowName, loading }: {
  open: boolean; onClose: () => void; onExecute: (input: { prompt: string; intent: string }) => void
  workflowName: string; loading?: boolean
}) {
  const [prompt, setPrompt] = useState('')
  const [intent, setIntent] = useState('general')

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full max-w-md rounded-xl p-6" style={{ background: '#0A0A0A', border: '1px solid rgba(51,51,51,0.5)' }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.15)' }}>
              <Sparkles size={16} style={{ color: '#06B6D4' }} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Execute Workflow</h3>
              <p className="text-[10px]" style={{ color: '#64748B' }}>{workflowName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-all hover:scale-110"
            style={{ color: '#475569', background: 'rgba(255,255,255,0.04)' }}><X size={14} /></button>
        </div>

        <label className="block mb-4">
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Context / Prompt</span>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={3} placeholder="What should the LLM process..."
            className="w-full mt-1.5 px-3 py-2.5 rounded-lg text-xs text-white bg-transparent outline-none resize-none placeholder:text-[#475569]"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(51,51,51,0.3)' }} />
        </label>

        <label className="block mb-5">
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#64748B' }}>Intent</span>
          <input value={intent} onChange={e => setIntent(e.target.value)} placeholder="general"
            className="w-full mt-1.5 px-3 py-2.5 rounded-lg text-xs text-white bg-transparent outline-none placeholder:text-[#475569]"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(51,51,51,0.3)' }} />
        </label>

        <div className="flex items-center gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(51,51,51,0.4)', color: '#64748B' }}>Cancel</button>
          <button onClick={() => onExecute({ prompt, intent })} disabled={loading || !prompt.trim()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all hover:scale-105 disabled:opacity-30"
            style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', color: '#06B6D4' }}>
            <Sparkles size={12} />Execute with AI
          </button>
        </div>
        <p className="text-[10px] text-center mt-3" style={{ color: '#475569' }}>The LLM will process each step using the provided context</p>
      </div>
    </div>
  )
}
