'use client'

import { useState, useEffect } from 'react'
import type { AgentData } from '@/components/hierarchy/types'

export interface AgentEditForm {
  name: string
  role: string
  roleGroup: string
  status: string
  formula: string
  skills: string
  description: string
}

const EMPTY_FORM: AgentEditForm = {
  name: '', role: '', roleGroup: '', status: '',
  formula: '', skills: '', description: '',
}

/** Manages the 7 edit-form fields and auto-resets on agent change. */
export function useAgentEditForm(agent: AgentData | null) {
  const [editName, setEditName] = useState('')
  const [editRole, setEditRole] = useState('')
  const [editRoleGroup, setEditRoleGroup] = useState('')
  const [editStatus, setEditStatus] = useState('')
  const [editFormula, setEditFormula] = useState('')
  const [editSkills, setEditSkills] = useState('')
  const [editDescription, setEditDescription] = useState('')

  // Reset form when agent ID changes.
  // MUST use useEffect here (not render-time setters) because calling setState
  // during render when agent is null triggers: undefined !== null -> infinite re-render.
  useEffect(() => {
    if (agent) {
      setEditName(agent.name)
      setEditRole(agent.role)
      setEditRoleGroup(agent.roleGroup)
      setEditStatus(agent.status)
      setEditFormula(agent.formula)
      setEditSkills(agent.skills || '')
      setEditDescription(agent.description || '')
    }
  }, [agent?.id])

  /** Populate all fields from the current agent (for entering edit mode). */
  const populateFromAgent = (a: AgentData | null) => {
    if (!a) return
    setEditName(a.name)
    setEditRole(a.role)
    setEditRoleGroup(a.roleGroup)
    setEditStatus(a.status)
    setEditFormula(a.formula)
    setEditSkills(a.skills || '')
    setEditDescription(a.description || '')
  }

  /** Reset form to empty. */
  const resetForm = () => {
    setEditName(EMPTY_FORM.name)
    setEditRole(EMPTY_FORM.role)
    setEditRoleGroup(EMPTY_FORM.roleGroup)
    setEditStatus(EMPTY_FORM.status)
    setEditFormula(EMPTY_FORM.formula)
    setEditSkills(EMPTY_FORM.skills)
    setEditDescription(EMPTY_FORM.description)
  }

  return {
    editName, setEditName,
    editRole, setEditRole,
    editRoleGroup, setEditRoleGroup,
    editStatus, setEditStatus,
    editFormula, setEditFormula,
    editSkills, setEditSkills,
    editDescription, setEditDescription,
    populateFromAgent,
    resetForm,
  }
}
