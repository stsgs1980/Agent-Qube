'use client'

import { useState, useCallback, useMemo } from 'react'
import type { WorkflowData, ExecutionData } from '@/components/workflows/workflow-types'

interface UseWorkflowStateReturn {
  expandedId: string | null
  toggleExpand: (id: string) => void
  executionModal: { execution: ExecutionData | null; workflow: WorkflowData | null }
  setExecutionModal: (v: { execution: ExecutionData | null; workflow: WorkflowData | null }) => void
  showCreateDialog: boolean
  setShowCreateDialog: (v: boolean) => void
  deleteTarget: WorkflowData | null
  setDeleteTarget: (v: WorkflowData | null) => void
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
  searchQuery: string
  setSearchQuery: (v: string) => void
  filterStatus: string | null
  setFilterStatus: (v: string | null) => void
  filterTrigger: string | null
  setFilterTrigger: (v: string | null) => void
  filteredWorkflows: WorkflowData[]
  pipelineStats: {
    total: number; active: number; draft: number
    totalSteps: number; totalExecutions: number; avgSuccessRate: number
  }
}

export function useWorkflowState(workflows: WorkflowData[]): UseWorkflowStateReturn {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [executionModal, setExecutionModal] = useState<{
    execution: ExecutionData | null; workflow: WorkflowData | null
  }>({ execution: null, workflow: null })
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<WorkflowData | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string | null>(null)
  const [filterTrigger, setFilterTrigger] = useState<string | null>(null)

  const toggleExpand = useCallback((id: string) => {
    setExpandedId(prev => prev === id ? null : id)
  }, [])

  const filteredWorkflows = useMemo(() => workflows.filter(wf => {
    if (filterStatus && wf.status !== filterStatus) return false
    if (filterTrigger && wf.triggerType !== filterTrigger) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return wf.name.toLowerCase().includes(q)
        || wf.tags.some(t => t.toLowerCase().includes(q))
        || wf.description.toLowerCase().includes(q)
    }
    return true
  }), [workflows, filterStatus, filterTrigger, searchQuery])

  const pipelineStats = useMemo(() => ({
    total: workflows.length,
    active: workflows.filter(w => w.status === 'active').length,
    draft: workflows.filter(w => w.status === 'draft').length,
    totalSteps: workflows.reduce((acc, w) => acc + w.stepCount, 0),
    totalExecutions: workflows.reduce((acc, w) => acc + w.stats.totalExecutions, 0),
    avgSuccessRate: workflows.length > 0
      ? Math.round(workflows.reduce((acc, w) => acc + w.stats.successRate, 0) / workflows.length)
      : 0,
  }), [workflows])

  return {
    expandedId, toggleExpand, executionModal, setExecutionModal,
    showCreateDialog, setShowCreateDialog, deleteTarget, setDeleteTarget,
    sidebarOpen, setSidebarOpen, searchQuery, setSearchQuery,
    filterStatus, setFilterStatus, filterTrigger, setFilterTrigger,
    filteredWorkflows, pipelineStats,
  }
}
