'use client'

import { Eye } from 'lucide-react'
import { STATUS_COLORS, formatTime, type RecentExecution } from './workflow-types'

export function ExecutionHistory({
  executions, workflowId, onViewDetails,
}: {
  executions: RecentExecution[]
  workflowId: string
  onViewDetails: (workflowId: string, execId: string) => void
}) {
  if (executions.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-[10px]" style={{ color: '#475569' }}>No executions yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-1.5 max-h-48 overflow-y-auto"
      style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
      {executions.map((exec) => {
        const statusColor = STATUS_COLORS[exec.status] || '#475569'
        return (
          <button key={exec.id}
            onClick={() => onViewDetails(workflowId, exec.id)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-150 hover:bg-white/[0.03] text-left"
            style={{ background: 'rgba(13,13,13,0.6)' }}>
            <div className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: statusColor, boxShadow: `0 0 4px ${statusColor}44` }} />
            <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: statusColor }}>
              {exec.status}
            </span>
            <span className="text-[9px] flex-1 text-right" style={{ color: '#64748B' }}>
              {formatTime(exec.startedAt)}
            </span>
            <span className="text-[8px]" style={{ color: '#475569' }}>{exec.id.substring(0, 6)}</span>
            <Eye size={10} style={{ color: '#475569' }} />
          </button>
        )
      })}
    </div>
  )
}
