'use client'

import { useState } from 'react'
import { ArrowRight, ChevronDown, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react'
import { ACTION_COLORS, type WorkflowStep } from './workflow-types'

export function DataContractCard({
  prevStep, nextStep, stepIndex,
}: {
  prevStep: WorkflowStep
  nextStep: WorkflowStep
  stepIndex: number
}) {
  const [expanded, setExpanded] = useState(false)

  const prevOutput = prevStep.outputSchema || {}
  const nextInput = nextStep.inputSchema || {}
  const prevHasSchema = Object.keys(prevOutput).length > 0
  const nextHasSchema = Object.keys(nextInput).length > 0

  let compatible: 'yes' | 'maybe' | 'no' = 'maybe'
  if (prevHasSchema && nextHasSchema) {
    const outProps = prevOutput.properties ? Object.keys(prevOutput.properties) : []
    const inProps = nextInput.properties ? Object.keys(nextInput.properties) : []
    const overlap = outProps.filter((p: string) => inProps.includes(p))
    if (overlap.length > 0) compatible = 'yes'
    else if (outProps.length > 0 && inProps.length > 0) compatible = 'no'
  } else if (prevHasSchema || nextHasSchema) {
    compatible = 'maybe'
  }

  const compatColor = compatible === 'yes' ? '#22C55E' : compatible === 'no' ? '#EF4444' : '#EAB308'
  const CompatIcon = compatible === 'yes' ? CheckCircle2 : compatible === 'no' ? AlertCircle : AlertTriangle

  return (
    <div className="rounded-lg overflow-hidden"
      style={{ background: 'rgba(13,13,13,0.8)', border: '1px solid rgba(51,51,51,0.4)' }}>
      <button onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-white/[0.02]">
        <ArrowRight size={10} style={{ color: '#475569' }} />
        <span className="text-[9px] font-medium" style={{ color: '#64748B' }}>
          Step {stepIndex} → Step {stepIndex + 1}
        </span>
        <CompatIcon size={10} style={{ color: compatColor }} />
        <span className="text-[8px]" style={{ color: compatColor }}>
          {compatible === 'yes' ? 'Compatible' : compatible === 'no' ? 'Incompatible' : 'Unknown'}
        </span>
        <ChevronDown size={10} style={{ color: '#475569', marginLeft: 'auto' }}
          className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <div className="px-3 pb-3 space-y-2">
          <div>
            <span className="text-[8px] font-bold uppercase" style={{ color: ACTION_COLORS[prevStep.action] }}>
              {prevStep.name} Output
            </span>
            <pre className="text-[7px] mt-1 p-2 rounded overflow-x-auto"
              style={{ background: 'rgba(0,0,0,0.3)', color: '#8B8B8B' }}>
              {JSON.stringify(prevOutput, null, 2).substring(0, 400)}
            </pre>
          </div>
          <div>
            <span className="text-[8px] font-bold uppercase" style={{ color: ACTION_COLORS[nextStep.action] }}>
              {nextStep.name} Input
            </span>
            <pre className="text-[7px] mt-1 p-2 rounded overflow-x-auto"
              style={{ background: 'rgba(0,0,0,0.3)', color: '#8B8B8B' }}>
              {JSON.stringify(nextInput, null, 2).substring(0, 400)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
