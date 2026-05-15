'use client'

import React, { useState, useEffect } from 'react'
import type { AgentData } from './types'
import { useAgentEditForm } from '@/hooks/use-agent-edit-form'
import { useAgentMutations } from '@/hooks/use-agent-mutations'
import { GroupSidebar } from './group-sidebar'
import { KPIStrip } from './kpi-strip'
import { DetailPanelCollapsed } from './detail-panel-collapsed'
import { DetailPanelEmpty } from './detail-panel-empty'
import { DetailPanelEdit } from './detail-panel-edit'
import { AgentDetailHeader } from './agent-detail-header'
import { AgentDetailInfo } from './agent-detail-info'

export { GroupSidebar, KPIStrip }

// ─── Detail Panel (thin orchestrator) ──────────────────────────────────────

export function DetailPanel({
  agent,
  allAgents,
  open,
  onToggle,
  onClose,
  onAgentUpdated,
  onAgentDeleted,
}: {
  agent: AgentData | null
  allAgents: AgentData[]
  open: boolean
  onToggle: () => void
  onClose: () => void
  onAgentUpdated?: (agent: AgentData) => void
  onAgentDeleted?: (agentId: string) => void
}) {
  const [editMode, setEditMode] = useState(false)
  const form = useAgentEditForm(agent)
  const mutations = useAgentMutations({
    onAgentUpdated: (a) => onAgentUpdated?.(a as AgentData),
    onAgentDeleted,
    onSuccess: () => { setEditMode(false); mutations.setShowDeleteConfirm(false) },
  })

  // Reset edit mode when agent changes — useEffect to avoid render-loop
  useEffect(() => {
    setEditMode(false)
    mutations.setShowDeleteConfirm(false)
  }, [agent?.id, mutations.setShowDeleteConfirm])

  if (!open) return <DetailPanelCollapsed agent={agent} onToggle={onToggle} />
  if (!agent) return <DetailPanelEmpty onToggle={onToggle} />

  if (editMode) {
    return (
      <DetailPanelEdit
        agent={agent}
        form={{ name: form.editName, role: form.editRole, roleGroup: form.editRoleGroup, status: form.editStatus, formula: form.editFormula, skills: form.editSkills, description: form.editDescription }}
        setters={form}
        saving={mutations.saving}
        deleting={mutations.deleting}
        showDeleteConfirm={mutations.showDeleteConfirm}
        onToggle={onToggle}
        onCancel={() => { setEditMode(false); mutations.setShowDeleteConfirm(false) }}
        onSave={() => mutations.saveAgent(agent.id, { name: form.editName, role: form.editRole, roleGroup: form.editRoleGroup, status: form.editStatus, formula: form.editFormula, skills: form.editSkills, description: form.editDescription })}
        onDelete={() => mutations.deleteAgent(agent.id)}
        onShowDeleteConfirm={() => mutations.setShowDeleteConfirm(true)}
      />
    )
  }

  return (
    <div style={{ width: 280, flexShrink: 0, background: '#0A0A0A', borderLeft: '1px solid rgba(51,51,51,0.25)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }} className="terrain-scroll">
      <AgentDetailHeader
        agent={agent}
        onToggle={onToggle}
        onEdit={() => { form.populateFromAgent(agent); setEditMode(true) }}
        onClose={onClose}
      />
      <AgentDetailInfo agent={agent} allAgents={allAgents} />
    </div>
  )
}
