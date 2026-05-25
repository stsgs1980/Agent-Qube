/**
 * Stats Computations
 * All DB queries and data transformations for the stats API.
 */

import { db } from '@/lib/db'
import { ROLE_GROUP_CONFIG, ROLE_GROUP_ORDER, STATUS_CONFIG, ALL_KNOWN_FORMULAS } from '@/lib/stats-constants'
import { computeConnectionHeatmap, computeNetworkActivity } from '@/lib/stats-heatmap'

export interface StatsResult {
  quickStats: {
    totalAgents: number
    roleGroups: number
    cognitiveFormulas: number
    edgeTypes: number
    activeAgents: number
    idleAgents: number
    totalTasks: number
    formulasCoverage: number
  }
  statusDistribution: { label: string; status: string; count: number; color: string }[]
  roleGroups: any[]
  agents: any[]
  activityEvents: any[]
  topPerformers: any[]
  connectionHeatmap: number[][]
  networkActivity: number[]
}

export async function computeStats(): Promise<StatsResult> {
  // ── Fetch all data from database ──────────────────────────────────────────
  const agents = await db.agent.findMany({
    include: {
      tasks: true,
      parent: { select: { id: true, name: true, roleGroup: true } },
      twin: { select: { id: true, name: true, roleGroup: true } },
      children: { select: { id: true, name: true, roleGroup: true } },
    },
  })

  const tasks = await db.task.findMany({
    include: {
      agent: { select: { id: true, name: true, roleGroup: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  // ── Quick Stats ───────────────────────────────────────────────────────────
  const totalAgents = agents.length
  const uniqueRoleGroups = new Set(agents.map((a) => a.roleGroup))
  const roleGroupsCount = uniqueRoleGroups.size
  const uniqueFormulas = new Set(agents.map((a) => a.formula))
  const cognitiveFormulas = uniqueFormulas.size
  const edgeTypes = 6
  const activeAgents = agents.filter((a) => a.status === 'active').length
  const idleAgents = agents.filter((a) => a.status === 'idle').length
  const totalTasks = tasks.length
  const formulasCoverage = ALL_KNOWN_FORMULAS.length > 0
    ? Math.round((cognitiveFormulas / ALL_KNOWN_FORMULAS.length) * 100)
    : 0

  const quickStats = {
    totalAgents,
    roleGroups: roleGroupsCount,
    cognitiveFormulas,
    edgeTypes,
    activeAgents,
    idleAgents,
    totalTasks,
    formulasCoverage,
  }

  // ── Status Distribution ───────────────────────────────────────────────────
  const statusCounts: Record<string, number> = {}
  for (const sc of STATUS_CONFIG) {
    statusCounts[sc.status] = 0
  }
  for (const agent of agents) {
    const s = agent.status.toLowerCase()
    if (s in statusCounts) {
      statusCounts[s]++
    }
  }

  const statusDistribution = STATUS_CONFIG.map((sc) => ({
    label: sc.label,
    status: sc.status,
    count: statusCounts[sc.status] || 0,
    color: sc.color,
  }))

  // ── Role Groups ───────────────────────────────────────────────────────────
  const agentsByGroup: Record<string, typeof agents> = {}
  for (const agent of agents) {
    if (!agentsByGroup[agent.roleGroup]) {
      agentsByGroup[agent.roleGroup] = []
    }
    agentsByGroup[agent.roleGroup].push(agent)
  }

  const roleGroups = ROLE_GROUP_ORDER.map((groupName) => {
    const config = ROLE_GROUP_CONFIG[groupName]
    const groupAgents = agentsByGroup[groupName] || []
    const groupActiveAgents = groupAgents.filter((a) => a.status === 'active').length
    const groupFormulas = [...new Set(groupAgents.map((a) => a.formula))].join(', ')

    const statusCountsInGroup: Record<string, number> = {}
    for (const agent of groupAgents) {
      const s = agent.status.toLowerCase()
      statusCountsInGroup[s] = (statusCountsInGroup[s] || 0) + 1
    }

    const statusSummary: { color: string; label: string }[] = []
    for (const sc of STATUS_CONFIG) {
      const count = statusCountsInGroup[sc.status]
      if (count && count > 0) {
        statusSummary.push({
          color: sc.color,
          label: `${count} ${sc.status}`,
        })
      }
    }

    return {
      name: groupName,
      label: config.label,
      color: config.color,
      colorRgb: config.colorRgb,
      agents: groupAgents.length,
      activeAgents: groupActiveAgents,
      formulas: groupFormulas,
      description: config.description,
      statusSummary,
    }
  })

  // ── Agents list with taskCount ────────────────────────────────────────────
  const agentsList = agents.map((agent) => ({
    id: agent.id,
    name: agent.name,
    role: agent.role,
    roleGroup: agent.roleGroup,
    status: agent.status,
    formula: agent.formula,
    skills: agent.skills,
    description: agent.description,
    taskCount: agent.tasks.length,
  }))

  // ── Activity Events ───────────────────────────────────────────────────────
  const activityEvents = tasks.slice(0, 20).map((task) => {
    const agentName = task.agent?.name || 'Unknown'
    const agentGroup = task.agent?.roleGroup || ''
    const statusLabel =
      task.status === 'completed' ? 'completed' :
      task.status === 'running' ? 'running' :
      task.status === 'pending' ? 'pending' :
      task.status === 'failed' ? 'failed' : task.status

    const createdDate = new Date(task.createdAt)
    const now = new Date()
    const diffMs = now.getTime() - createdDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const time =
      diffMins < 1 ? 'just now' :
      diffMins < 60 ? `${diffMins}m ago` :
      diffHours < 24 ? `${diffHours}h ago` :
      `${Math.floor(diffHours / 24)}d ago`

    return { time, agent: agentName, group: agentGroup, desc: `${task.title} — ${statusLabel}` }
  })

  // ── Top Performers ────────────────────────────────────────────────────────
  const completedTasksByAgent: Record<string, number> = {}
  for (const task of tasks) {
    if (task.status === 'completed' && task.agentId) {
      completedTasksByAgent[task.agentId] = (completedTasksByAgent[task.agentId] || 0) + 1
    }
  }

  const topPerformers = agents
    .map((agent) => ({
      name: agent.name,
      group: agent.roleGroup,
      score: Math.min(80 + (completedTasksByAgent[agent.id] || 0) * 5, 100),
      completedTasks: completedTasksByAgent[agent.id] || 0,
    }))
    .sort((a, b) => b.score - a.score || b.completedTasks - a.completedTasks)
    .slice(0, 10)

  // ── Heatmap & Network Activity ────────────────────────────────────────────
  const connectionHeatmap = computeConnectionHeatmap(agents, agentsByGroup)
  const networkActivity = computeNetworkActivity(tasks, totalTasks)

  return {
    quickStats,
    statusDistribution,
    roleGroups,
    agents: agentsList,
    activityEvents,
    topPerformers,
    connectionHeatmap,
    networkActivity,
  }
}
