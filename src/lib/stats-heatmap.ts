/**
 * Stats Heatmap & Network Activity Computations
 * Extracted from stats-computations.ts to stay under 250 lines.
 */

import { ROLE_GROUP_ORDER, STATUS_CONFIG } from '@/lib/stats-constants'

/**
 * Build an 8×8 connection heatmap matrix based on
 * parent-child, twin, and intra-group relationships.
 */
export function computeConnectionHeatmap(
  agents: any[],
  agentsByGroup: Record<string, any[]>
): number[][] {
  const groupIndex: Record<string, number> = {}
  ROLE_GROUP_ORDER.forEach((g, i) => {
    groupIndex[g] = i
  })

  const connectionHeatmap: number[][] = Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, () => 0)
  )

  for (const agent of agents) {
    const rowIdx = groupIndex[agent.roleGroup]
    if (rowIdx === undefined) continue

    if (agent.parentId && agent.parent) {
      const colIdx = groupIndex[agent.parent.roleGroup]
      if (colIdx !== undefined) {
        connectionHeatmap[rowIdx][colIdx]++
        if (rowIdx !== colIdx) {
          connectionHeatmap[colIdx][rowIdx]++
        }
      }
    }

    if (agent.twinId && agent.twin) {
      const colIdx = groupIndex[agent.twin.roleGroup]
      if (colIdx !== undefined) {
        connectionHeatmap[rowIdx][colIdx]++
        if (rowIdx !== colIdx) {
          connectionHeatmap[colIdx][rowIdx]++
        }
      }
    }

    if (agent.children && agent.children.length > 0) {
      for (const child of agent.children) {
        const colIdx = groupIndex[child.roleGroup]
        if (colIdx !== undefined && rowIdx !== colIdx) {
          connectionHeatmap[rowIdx][colIdx]++
          connectionHeatmap[colIdx][rowIdx]++
        }
      }
    }
  }

  // Add intra-group connections
  for (const groupName of ROLE_GROUP_ORDER) {
    const idx = groupIndex[groupName]
    const groupAgents = agentsByGroup[groupName] || []
    let internalConnections = 0
    for (const agent of groupAgents) {
      if (agent.parentId && agent.parent && agent.parent.roleGroup === groupName) {
        internalConnections++
      }
      if (agent.twinId && agent.twin && agent.twin.roleGroup === groupName) {
        internalConnections++
      }
    }
    if (groupAgents.length >= 2) {
      internalConnections = Math.max(internalConnections, 1)
    }
    connectionHeatmap[idx][idx] = internalConnections
  }

  return connectionHeatmap
}

/**
 * Compute 24-hour network activity distribution.
 * Uses real task timestamps if available, otherwise a simulated bell curve.
 */
export function computeNetworkActivity(tasks: any[], totalTasks: number): number[] {
  const hourlyActivity: number[] = Array.from({ length: 24 }, () => 0)
  for (const task of tasks) {
    const hour = new Date(task.createdAt).getHours()
    hourlyActivity[hour]++
  }

  const hasRealDistribution = hourlyActivity.filter((h) => h > 0).length > 2

  if (hasRealDistribution) {
    const maxHourly = Math.max(...hourlyActivity, 1)
    return hourlyActivity.map((count) =>
      Math.round((count / maxHourly) * 55) + Math.floor(Math.random() * 5)
    )
  }

  const basePattern = [12, 18, 15, 22, 28, 35, 42, 38, 45, 52, 48, 55, 50, 47, 42, 38, 44, 50, 53, 48, 35, 28, 20, 15]
  const scaleFactor = totalTasks > 0 ? Math.min(totalTasks / 26, 2) : 1
  return basePattern.map((v) =>
    Math.round(v * scaleFactor + (Math.random() * 4 - 2))
  )
}
