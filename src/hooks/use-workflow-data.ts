'use client'

import { useState, useCallback, useEffect } from 'react'
import { fetchWithRetry } from '@/lib/client-fetch'
import { toast } from 'sonner'
import type { WorkflowData, ExecutionData } from '@/components/workflows/workflow-types'

interface UseWorkflowDataReturn {
  workflows: WorkflowData[]
  loading: boolean
  runningIds: Set<string>
  seeding: boolean
  fetchWorkflows: () => Promise<void>
  handleRun: (workflowId: string) => Promise<void>
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
      const res = await fetchWithRetry('/api/workflows')
      if (res.ok) {
        const data = await res.json()
        setWorkflows(data.workflows || [])
      }
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
      const res = await fetchWithRetry('/api/workflows/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowId }),
      })
      if (res.ok) {
        const data = await res.json()
        toast.success('Workflow execution completed')
        fetchWorkflows()
        return data.execution as ExecutionData
      }
      const err = await res.json()
      toast.error(err.error || 'Execution failed')
      return null
    } catch {
      toast.error('Execution failed')
      return null
    } finally {
      setRunningIds(prev => { const n = new Set(prev); n.delete(workflowId); return n })
    }
  }, [fetchWorkflows])

  const handleViewHistory = useCallback(async (workflowId: string, execId: string) => {
    try {
      const res = await fetchWithRetry(`/api/workflows/${workflowId}`)
      if (res.ok) {
        const data = await res.json()
        const wf = data.workflow
        const execution = wf?.executions?.find((e: any) => e.id === execId)
        if (execution) {
          return {
            ...execution,
            steps: execution.steps?.map((s: any) => ({
              ...s, inputData: s.inputData, outputData: s.outputData,
            })) || [],
          } as ExecutionData
        }
        toast.error('Execution not found')
      }
    } catch {
      toast.error('Failed to load execution details')
    }
    return null
  }, [])

  const handleDelete = useCallback(async (workflowId: string) => {
    try {
      const res = await fetchWithRetry(`/api/workflows/${workflowId}`, { method: 'DELETE' })
      if (res.ok) {
        toast.success('Workflow deleted')
        fetchWorkflows()
      } else {
        const err = await res.json()
        toast.error(err.error || 'Failed to delete')
      }
    } catch {
      toast.error('Failed to delete workflow')
    }
  }, [fetchWorkflows])

  const handleSeed = useCallback(async () => {
    setSeeding(true)
    try {
      const res = await fetchWithRetry('/api/workflows/seed', { method: 'POST' })
      if (res.ok) {
        toast.success('Demo workflows seeded')
        fetchWorkflows()
      } else {
        const err = await res.json()
        toast.error(err.error || 'Failed to seed')
      }
    } catch {
      toast.error('Failed to seed demo workflows')
    } finally {
      setSeeding(false)
    }
  }, [fetchWorkflows])

  return { workflows, loading, runningIds, seeding, fetchWorkflows, handleRun, handleViewHistory, handleDelete, handleSeed }
}
