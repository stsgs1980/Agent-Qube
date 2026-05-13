'use client'

import { useState } from 'react'
import { FileJson, ChevronDown, CheckCircle, CornerDownLeft, ArrowUpRight } from 'lucide-react'
import { safeJsonParse, STATUS_COLORS, ACTION_COLORS } from './workflow-types'

export function TaskContextTimeline({ taskContextStr }: { taskContextStr: string }) {
  const [expanded, setExpanded] = useState(true)
  const ctx = safeJsonParse(taskContextStr, {})
  const history: any[] = ctx._history || []

  if (history.length === 0) {
    return (
      <div className="rounded-lg p-3"
        style={{ background: 'rgba(13,13,13,0.8)', border: '1px solid rgba(51,51,51,0.3)' }}>
        <span className="text-[9px]" style={{ color: '#475569' }}>No task context history</span>
      </div>
    )
  }

  const feedbackEntries = history.filter((h: any) => h.status === 'feedback_requested')

  return (
    <div className="rounded-lg overflow-hidden"
      style={{ background: 'rgba(13,13,13,0.8)', border: '1px solid rgba(51,51,51,0.3)' }}>
      <button onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left"
        style={{ borderBottom: expanded ? '1px solid rgba(51,51,51,0.3)' : 'none' }}>
        <FileJson size={12} style={{ color: '#06B6D4' }} />
        <span className="text-[10px] font-semibold" style={{ color: '#06B6D4' }}>Task Context</span>
        <span className="text-[8px] px-1.5 py-0.5 rounded"
          style={{ background: 'rgba(6,182,212,0.12)', color: '#06B6D4' }}>
          {history.length} entries
        </span>
        {feedbackEntries.length > 0 && (
          <span className="text-[8px] px-1.5 py-0.5 rounded flex items-center gap-1"
            style={{ background: 'rgba(234,179,8,0.12)', color: '#EAB308' }}>
            <CornerDownLeft size={8} />{feedbackEntries.length} feedback
          </span>
        )}
        <ChevronDown size={10} style={{ color: '#475569', marginLeft: 'auto' }}
          className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="px-4 py-3 max-h-64 overflow-y-auto"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
          <div className="relative">
            <div className="absolute left-[7px] top-2 bottom-2 w-px"
              style={{ background: 'rgba(51,51,51,0.5)' }} />
            {history.map((entry: any, i: number) => {
              const isFeedback = entry.status === 'feedback_requested'
              const statusColor = isFeedback ? '#EAB308' : STATUS_COLORS.completed
              return (
                <div key={i} className="relative flex items-start gap-3 pb-4">
                  <div className="relative flex-shrink-0 mt-0.5">
                    <div className="w-3.5 h-3.5 rounded-full flex items-center justify-center"
                      style={{
                        background: `${statusColor}20`, border: `1.5px solid ${statusColor}`,
                        boxShadow: isFeedback ? `0 0 8px ${statusColor}40` : 'none',
                      }}>
                      {isFeedback ? <CornerDownLeft size={7} style={{ color: statusColor }} />
                        : <CheckCircle size={7} style={{ color: statusColor }} />}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] font-bold" style={{ color: statusColor }}>{entry.step}</span>
                      {entry.agent && <span className="text-[8px]" style={{ color: '#64748B' }}>by {entry.agent}</span>}
                      <span className="text-[7px] px-1 py-0.5 rounded font-medium"
                        style={{ background: `${ACTION_COLORS[entry.action] || '#475569'}15`, color: ACTION_COLORS[entry.action] || '#475569' }}>
                        {entry.action}
                      </span>
                      <span className="text-[7px] px-1 py-0.5 rounded font-bold uppercase"
                        style={{ background: `${statusColor}15`, color: statusColor }}>
                        {entry.status}
                      </span>
                    </div>
                    {entry.timestamp && (
                      <span className="text-[7px]" style={{ color: '#3F3F46' }}>
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </span>
                    )}
                    {isFeedback && i > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <ArrowUpRight size={8} style={{ color: '#EAB308' }} />
                        <span className="text-[7px]" style={{ color: '#EAB308' }}>Feedback loop → back to previous step</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
