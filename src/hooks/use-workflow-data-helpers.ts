// ─── Shared fetch helpers for use-workflow-data ────────────────

import { fetchWithRetry } from '@/lib/client-fetch'
import { toast } from 'sonner'
import type { ExecutionData } from '@/components/workflows/workflow-types'

export async function fetchWorkflowsApi(): Promise<any[]> {
  const res = await fetchWithRetry('/api/workflows')
  if (res.ok) {
    const data = await res.json()
    return data.workflows || []
  }
  return []
}

export async function runWorkflowApi(workflowId: string): Promise<ExecutionData | null> {
  const res = await fetchWithRetry('/api/workflows/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workflowId }),
  })
  if (res.ok) {
    const data = await res.json()
    toast.success('Workflow execution completed')
    return data.execution as ExecutionData
  }
  const err = await res.json()
  toast.error(err.error || 'Execution failed')
  return null
}

export async function viewHistoryApi(workflowId: string, execId: string): Promise<ExecutionData | null> {
  try {
    const res = await fetchWithRetry(`/api/workflows/${workflowId}`)
    if (!res.ok) {
      toast.error('Execution not found')
      return null
    }
    const data = await res.json()
    const execution = data.workflow?.executions?.find((e: any) => e.id === execId)
    if (!execution) {
      toast.error('Execution not found')
      return null
    }
    return {
      ...execution,
      steps: execution.steps?.map((s: any) => ({
        ...s, inputData: s.inputData, outputData: s.outputData,
      })) || [],
    } as ExecutionData
  } catch {
    toast.error('Failed to load execution details')
    return null
  }
}

export async function deleteWorkflowApi(workflowId: string): Promise<boolean> {
  const res = await fetchWithRetry(`/api/workflows/${workflowId}`, { method: 'DELETE' })
  if (res.ok) {
    toast.success('Workflow deleted')
    return true
  }
  const err = await res.json()
  toast.error(err.error || 'Failed to delete')
  return false
}

export async function seedWorkflowsApi(): Promise<boolean> {
  const res = await fetchWithRetry('/api/workflows/seed', { method: 'POST' })
  if (res.ok) {
    toast.success('Demo workflows seeded')
    return true
  }
  const err = await res.json()
  toast.error(err.error || 'Failed to seed')
  return false
}