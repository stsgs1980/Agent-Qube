'use client'

import { MessageSquare } from 'lucide-react'
import { safeJsonParse } from './workflow-types'
import type { StepExecution } from './workflow-types'

export function StepMessages({ stepExec }: { stepExec: StepExecution }) {
  return (
    <div className="px-3 pb-3 space-y-2">
      {stepExec.messages.length > 0 && (
        <div className="space-y-1.5 mt-2">
          {stepExec.messages.map((msg) => {
            const msgContent = safeJsonParse(msg.content)
            const msgColor = msg.type === 'request' ? '#06B6D4' : msg.type === 'response' ? '#22C55E'
              : msg.type === 'feedback' ? '#EAB308' : msg.type === 'error' ? '#EF4444' : '#64748B'
            return (
              <div key={msg.id} className="flex items-start gap-2 px-2 py-1.5 rounded" style={{ background: `${msgColor}08` }}>
                <MessageSquare size={9} style={{ color: msgColor, marginTop: 2 }} className="flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-bold uppercase" style={{ color: msgColor }}>{msg.type}</span>
                    <span className="text-[7px]" style={{ color: '#4B5563' }}>{msg.fromAgentId.substring(0, 8)} → {msg.toAgentId?.substring(0, 8) || 'all'}</span>
                  </div>
                  <p className="text-[9px] mt-0.5 leading-relaxed" style={{ color: '#B0B0B0' }}>
                    {typeof msgContent === 'object' ? JSON.stringify(msgContent, null, 0).substring(0, 200) : String(msgContent).substring(0, 200)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
      {stepExec.outputData && stepExec.outputData !== '{}' && (
        <div className="mt-2">
          <span className="text-[8px] font-bold uppercase" style={{ color: '#64748B' }}>Output</span>
          <pre className="text-[8px] mt-1 p-2 rounded overflow-x-auto"
            style={{ background: 'rgba(0,0,0,0.3)', color: '#8B8B8B' }}>
            {JSON.stringify(safeJsonParse(stepExec.outputData), null, 2).substring(0, 500)}
          </pre>
        </div>
      )}
    </div>
  )
}
