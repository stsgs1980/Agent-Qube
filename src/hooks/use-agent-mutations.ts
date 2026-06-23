'use client'

import { useState, useCallback, useRef } from 'react'
import { toast } from 'sonner'
import { fetchWithRetry } from '@/lib/client-fetch'
import { emitAgentCreated, emitAgentDeleted, emitAgentUpdated } from '@/lib/ws-client'
import type { AgentEditForm } from './use-agent-edit-form'

export interface CreateAgentInput {
  name: string
  role: string
  roleGroup: string
  formula: string
  status: string
  skills: string
  description: string
}

interface UseAgentMutationsOpts {
  onAgentCreated?: (agent: Record<string, unknown>) => void
  onAgentUpdated?: (agent: Record<string, unknown>) => void
  onAgentDeleted?: (agentId: string) => void
  onSuccess?: () => void
}

/** Encapsulates fetchWithRetry calls for save/delete. Uses PATCH for partial updates. */
export function useAgentMutations(opts: UseAgentMutationsOpts = {}) {
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Use refs for callbacks to avoid recreating functions on every render
  const optsRef = useRef(opts)
  optsRef.current = opts

  const createAgent = useCallback(async (input: CreateAgentInput) => {
    setCreating(true)
    try {
      const res = await fetchWithRetry('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (res.ok) {
        const created = await res.json()
        emitAgentCreated(created)
        optsRef.current.onAgentCreated?.(created)
        optsRef.current.onSuccess?.()
        toast.success('Agent created', { description: `${input.name} added to ${input.roleGroup}` })
        return created
      }
      const err = await res.json().catch(() => ({}))
      toast.error('Create failed', { description: (err as Record<string, string>).error || `HTTP ${res.status}` })
    } catch {
      toast.error('Create failed', { description: 'Network error — please try again' })
    } finally {
      setCreating(false)
    }
    return null
  }, [])

  const saveAgent = useCallback(async (agentId: string, form: AgentEditForm) => {
    setSaving(true)
    try {
      const res = await fetchWithRetry(`/api/agents/${agentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const updated = await res.json()
        emitAgentUpdated(updated)
        optsRef.current.onAgentUpdated?.(updated)
        optsRef.current.onSuccess?.()
        toast.success('Agent updated', { description: `${form.name} saved successfully` })
        return true
      }
      const err = await res.json().catch(() => ({}))
      toast.error('Update failed', { description: (err as Record<string, string>).error || `HTTP ${res.status}` })
    } catch {
      toast.error('Update failed', { description: 'Network error — please try again' })
    } finally {
      setSaving(false)
    }
    return false
  }, [])

  const deleteAgent = useCallback(async (agentId: string) => {
    setDeleting(true)
    try {
      const res = await fetchWithRetry(`/api/agents/${agentId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        emitAgentDeleted(agentId)
        optsRef.current.onAgentDeleted?.(agentId)
        optsRef.current.onSuccess?.()
        toast.success('Agent deleted', { description: 'The agent has been removed' })
        return true
      }
      const err = await res.json().catch(() => ({}))
      toast.error('Delete failed', { description: (err as Record<string, string>).error || `HTTP ${res.status}` })
    } catch {
      toast.error('Delete failed', { description: 'Network error — please try again' })
    } finally {
      setDeleting(false)
    }
    return false
  }, [])

  return {
    creating,
    saving,
    deleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    createAgent,
    saveAgent,
    deleteAgent,
  }
}
