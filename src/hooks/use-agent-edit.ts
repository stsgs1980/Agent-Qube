'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { handleAgentSave, handleAgentDelete } from './use-agent-edit-helpers'

export interface EditForm {
  name: string; role: string; roleGroup: string; status: string;
  formula: string; skills: string; description: string;
}

export function useAgentEdit(statsData: any, onRefresh: () => void) {
  const [editingAgent, setEditingAgent] = useState<any>(null)
  const [editSaving, setEditSaving] = useState(false)
  const [editDeleting, setEditDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [editForm, setEditForm] = useState<EditForm>({
    name: '', role: '', roleGroup: '', status: '', formula: '', skills: '', description: '',
  })

  const handleAgentClick = useCallback(async (agent: any) => {
    try {
      const fullAgent = statsData?.agents?.find((a: any) => a.name === agent.name) || agent
      if (fullAgent.id) {
        setEditingAgent(fullAgent)
        setEditForm({
          name: fullAgent.name || '', role: fullAgent.role || '',
          roleGroup: fullAgent.roleGroup || fullAgent.group || '',
          status: fullAgent.status || 'active', formula: fullAgent.formula || '',
          skills: fullAgent.skills || '', description: fullAgent.description || '',
        })
        setShowDeleteConfirm(false)
      } else { toast.info('Switch to Hierarchy view to edit agents') }
    } catch { toast.info('Switch to Hierarchy view to edit agents') }
  }, [statsData])

  const handleEditSave = useCallback(async () => {
    setEditSaving(true)
    try {
      await handleAgentSave(editingAgent, editForm, onRefresh)
      setEditingAgent(null)
    }
    catch { toast.error('Failed to update agent') }
    finally { setEditSaving(false) }
  }, [editingAgent, editForm, onRefresh])

  const handleEditDelete = useCallback(async () => {
    setEditDeleting(true)
    try {
      await handleAgentDelete(editingAgent, onRefresh)
      setEditingAgent(null)
    }
    catch { toast.error('Failed to delete agent') }
    finally { setEditDeleting(false) }
  }, [editingAgent, onRefresh])

  return {
    editingAgent, setEditingAgent, editSaving, editDeleting,
    showDeleteConfirm, setShowDeleteConfirm, editForm, setEditForm,
    handleAgentClick, handleEditSave, handleEditDelete,
  }
}