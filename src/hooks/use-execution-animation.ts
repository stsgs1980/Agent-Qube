'use client'

import { useState, useEffect } from 'react'
import type { ExecutionData, WorkflowData } from '@/components/workflows/workflow-types'

export function useExecutionAnimation(
  execution: ExecutionData | null,
  workflow: WorkflowData | null,
) {
  const [animatingStep, setAnimatingStep] = useState(-1)
  const [visibleSteps, setVisibleSteps] = useState(0)

  useEffect(() => {
    if (!execution || !workflow) return
    const stepCount = execution.steps.length
    let current = 0
    const interval = setInterval(() => {
      if (current < stepCount) {
        setAnimatingStep(current)
        setVisibleSteps(current + 1)
        current++
      } else {
        setAnimatingStep(-1)
        clearInterval(interval)
      }
    }, 600)
    return () => clearInterval(interval)
  }, [execution, workflow])

  return { animatingStep, visibleSteps }
}
