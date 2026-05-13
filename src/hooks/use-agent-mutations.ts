'use client'

import { useState, useCallback } from 'react'
import { fetchWithRetry } from '@/lib/client-fetch'
import type { AgentEditForm } from './use-agent-edit-form'

interface UseAgentMutationsOpts {
  onAgentUpdated?: (agent: Record<string, unknown>) => void
  onAgentDeleted?: (agentId: string) => void
  onSuccess?: () => void
}

/** Encapsulates fetchWithRetry calls for save/delete. No direct fetch in components. */
export function useAgentMutations(opts: UseAgentMutationsOpts = {}) {
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const saveAgent = useCallback(async (agentId: string, form: AgentEditForm) => {
    setSaving(true)
    try {
      const res = await fetchWithRetry(`/api/agents/${agentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const updated = await res.json()
        opts.onAgentUpdated?.(updated)
        opts.onSuccess?.()
        return true
      }
    } catch {
      // Silently fail — could add toast later
    } finally {
      setSaving(false)
    }
    return false
  }, [opts])

  const deleteAgent = useCallback(async (agentId: string) => {
    setDeleting(true)
    try {
      const res = await fetchWithRetry(`/api/agents/${agentId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        opts.onAgentDeleted?.(agentId)
        opts.onSuccess?.()
        return true
      }
    } catch {
      // Silently fail
    } finally {
      setDeleting(false)
    }
    return false
  }, [opts])

  return {
    saving,
    deleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    saveAgent,
    deleteAgent,
  }
}
