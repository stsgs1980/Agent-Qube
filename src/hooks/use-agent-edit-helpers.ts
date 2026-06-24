// ─── Agent edit helpers ───────────────────────────────────

import { fetchWithRetry } from '@/lib/client-fetch'
import { emitAgentDeleted, emitAgentUpdated } from '@/lib/ws-client'
import { toast } from 'sonner'
import type { EditForm } from './use-agent-edit'

export async function handleAgentSave(
  agent: any, form: EditForm, onRefresh: () => void,
): Promise<void> {
  if (!agent?.id) return
  const res = await fetchWithRetry(`/api/agents/${agent.id}`, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
  })
  if (res.ok) {
    const updated = await res.json()
    emitAgentUpdated(updated)
    toast.success(`Agent "${form.name}" updated`)
    onRefresh()
  } else { toast.error('Failed to update agent') }
}

export async function handleAgentDelete(
  agent: any, onRefresh: () => void,
): Promise<void> {
  if (!agent?.id) return
  const res = await fetchWithRetry(`/api/agents/${agent.id}`, { method: 'DELETE' })
  if (res.ok) {
    emitAgentDeleted(agent.id)
    toast.success(`Agent "${agent.name}" deleted`)
    onRefresh()
  } else { toast.error('Failed to delete agent') }
}