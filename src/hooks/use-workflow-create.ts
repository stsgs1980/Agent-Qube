'use client'

import { useState } from 'react'
import { fetchWithRetry } from '@/lib/client-fetch'
import { toast } from 'sonner'
import {
  ROLE_GROUP_OPTIONS, ACTION_OPTIONS,
  type WorkflowStep, type WorkflowData,
} from '@/components/workflows/workflow-types'

interface StepForm {
  name: string
  roleGroup: string
  action: WorkflowStep['action']
  timeout: number
}

export function useWorkflowCreate(onCreated: () => void, onClose: () => void) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [triggerType, setTriggerType] = useState<WorkflowData['triggerType']>('manual')
  const [tagsStr, setTagsStr] = useState('')
  const [steps, setSteps] = useState<StepForm[]>([
    { name: '', roleGroup: ROLE_GROUP_OPTIONS[0], action: 'process', timeout: 300 },
  ])
  const [saving, setSaving] = useState(false)

  const addStep = () => {
    setSteps([...steps, { name: '', roleGroup: ROLE_GROUP_OPTIONS[0], action: 'process', timeout: 300 }])
  }

  const removeStep = (index: number) => {
    if (steps.length <= 1) return
    setSteps(steps.filter((_, i) => i !== index))
  }

  const updateStep = (index: number, field: string, value: any) => {
    const updated = [...steps]
    updated[index] = { ...updated[index], [field]: value }
    setSteps(updated)
  }

  const handleSave = async () => {
    if (!name.trim()) { toast.error('Workflow name is required'); return }
    if (steps.some(s => !s.name.trim())) { toast.error('All steps must have a name'); return }
    setSaving(true)
    try {
      const res = await fetchWithRetry('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(), description: description.trim(), triggerType,
          tags: tagsStr.split(',').map(t => t.trim()).filter(Boolean),
          steps: steps.map((s, i) => ({
            order: i, name: s.name.trim(), roleGroup: s.roleGroup,
            action: s.action, timeout: s.timeout,
          })),
        }),
      })
      if (res.ok) {
        toast.success('Workflow created successfully')
        onCreated()
        onClose()
      } else {
        const err = await res.json()
        toast.error(err.error || 'Failed to create workflow')
      }
    } catch {
      toast.error('Failed to create workflow')
    } finally {
      setSaving(false)
    }
  }

  return {
    name, setName, description, setDescription, triggerType, setTriggerType,
    tagsStr, setTagsStr, steps, addStep, removeStep, updateStep, saving, handleSave,
  }
}
