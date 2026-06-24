'use client'

import { useState, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import type { WorkflowData, ExecutionData } from '@/components/workflows/workflow-types'
import {
  fetchWorkflowsApi, runWorkflowApi, viewHistoryApi,
  deleteWorkflowApi, seedWorkflowsApi,
} from './use-workflow-data-helpers'

interface UseWorkflowDataReturn {
  workflows: WorkflowData[]
  loading: boolean
  runningIds: Set<string>
  seeding: boolean
  fetchWorkflows: () => Promise<void>
  handleRun: (workflowId: string) => Promise<ExecutionData | null>
  handleViewHistory: (workflowId: string, execId: string) => Promise<ExecutionData | null>
  handleDelete: (workflowId: string) => Promise<void>
  handleSeed: () => Promise<void>
}

export function useWorkflowData(): UseWorkflowDataReturn {
  const [workflows, setWorkflows] = useState<WorkflowData[]>([])
  const [loading, setLoading] = useState(true)
  const [runningIds, setRunningIds] = useState<Set<string>>(new Set())
  const [seeding, setSeeding] = useState(false)

  const fetchWorkflows = useCallback(async () => {
    try {
      setWorkflows(await fetchWorkflowsApi())
    } catch (err) {
      console.error('[WorkflowPipeline] fetch error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchWorkflows() }, [fetchWorkflows])

  const handleRun = useCallback(async (workflowId: string) => {
    setRunningIds(prev => new Set(prev).add(workflowId))
    toast.info('Starting workflow execution...')
    try {
      const result = await runWorkflowApi(workflowId)
      if (result) fetchWorkflows()
      return result
    } catch {
      toast.error('Execution failed')
      return null
    } finally {
      setRunningIds(prev => {
        const n = new Set(prev);
        n.delete(workflowId);
        return n;
      } )
    }
  }, [fetchWorkflows])

  const handleViewHistory = useCallback(async (wid: string, eid: string) => {
    return viewHistoryApi(wid, eid)
  }, [])

  const handleDelete = useCallback(async (workflowId: string) => {
    if (await deleteWorkflowApi(workflowId)) fetchWorkflows()
  }, [fetchWorkflows])

  const handleSeed = useCallback(async () => {
    setSeeding(true)
    try {
      if (await seedWorkflowsApi()) fetchWorkflows()
    } finally {
      setSeeding(false)
    }
  }, [fetchWorkflows])

  return { workflows, loading, runningIds, seeding, fetchWorkflows, handleRun, handleViewHistory, handleDelete, handleSeed }
}