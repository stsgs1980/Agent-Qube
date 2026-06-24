// ─── Shared mutation logic for agent CRUD ────────────────────

import { toast } from 'sonner'
import { fetchWithRetry } from '@/lib/client-fetch'
import { emitAgentCreated, emitAgentDeleted, emitAgentUpdated } from '@/lib/ws-client'

export async function createAgentApi(
  input: Record<string, string>,
  onSuccess?: (agent: Record<string, unknown>) => void,
  onDone?: () => void,
): Promise<Record<string, unknown> | null> {
  const res = await fetchWithRetry('/api/agents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (res.ok) {
    const created = await res.json()
    emitAgentCreated(created)
    onSuccess?.(created)
    onDone?.()
    toast.success('Agent created', { description: `${input.name} added to ${input.roleGroup}` })
    return created
  }
  const err = await res.json().catch(() => ({}))
  toast.error('Create failed', { description: (err as Record<string, string>).error || 'HTTP error' })
  return null
}

export async function saveAgentApi(
  agentId: string,
  form: Record<string, unknown>,
  onSuccess?: (agent: Record<string, unknown>) => void,
  onDone?: () => void,
): Promise<boolean> {
  const res = await fetchWithRetry(`/api/agents/${agentId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  })
  if (res.ok) {
    const updated = await res.json()
    emitAgentUpdated(updated)
    onSuccess?.(updated)
    onDone?.()
    toast.success('Agent updated', { description: `${form.name} saved successfully` })
    return true
  }
  const err = await res.json().catch(() => ({}))
  toast.error('Update failed', { description: (err as Record<string, string>).error || 'HTTP error' })
  return false
}

export async function deleteAgentApi(
  agentId: string,
  agentName: string,
  onSuccess?: (id: string) => void,
  onDone?: () => void,
): Promise<boolean> {
  const res = await fetchWithRetry(`/api/agents/${agentId}`, { method: 'DELETE' })
  if (res.ok) {
    emitAgentDeleted(agentId)
    onSuccess?.(agentId)
    onDone?.()
    toast.success('Agent deleted', { description: 'The agent has been removed' })
    return true
  }
  const err = await res.json().catch(() => ({}))
  toast.error('Delete failed', { description: (err as Record<string, string>).error || 'HTTP error' })
  return false
}