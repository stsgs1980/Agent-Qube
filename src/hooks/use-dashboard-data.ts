'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchWithRetry } from '@/lib/client-fetch'
import {
  QUICK_STATS, STATUS_DISTRIBUTION, ROLE_GROUPS, AGENT_LIST,
  ACTIVITY_EVENTS, TOP_PERFORMERS, CONNECTION_HEATMAP_DATA,
  NETWORK_ACTIVITY_DATA, ROLE_GROUP_ICONS,
} from '@/data/dashboard-constants'

function buildDashboardValues(statsData: any) {
  if (!statsData) return {
    quickStats: QUICK_STATS, statusDistribution: STATUS_DISTRIBUTION, roleGroups: ROLE_GROUPS,
    agentList: AGENT_LIST, activityEvents: ACTIVITY_EVENTS, topPerformers: TOP_PERFORMERS,
    connectionHeatmapData: CONNECTION_HEATMAP_DATA, networkActivityData: NETWORK_ACTIVITY_DATA,
  }
  const statusRole = (s: string) =>
    s === 'active' ? 'active' as const : s === 'idle' ? 'idle' as const
    : s === 'paused' ? 'paused' as const : s === 'standby' ? 'standby' as const
    : s === 'error' ? 'offline' as const : 'offline' as const
  return {
    quickStats: [
      { label: 'Total Agents', value: String(statsData.quickStats.totalAgents), numericValue: statsData.quickStats.totalAgents, color: '#06B6D4', colorRgb: '6,182,212' },
      { label: 'Role Groups', value: String(statsData.quickStats.roleGroups), numericValue: statsData.quickStats.roleGroups, color: '#0891B2', colorRgb: '8,145,178' },
      { label: 'Cognitive Formulas', value: String(statsData.quickStats.cognitiveFormulas), numericValue: statsData.quickStats.cognitiveFormulas, color: '#6B7280', colorRgb: '107,114,128' },
      { label: 'Edge Types', value: String(statsData.quickStats.edgeTypes), numericValue: statsData.quickStats.edgeTypes, color: '#475569', colorRgb: '71,85,105' },
      { label: 'Active Agents', value: String(statsData.quickStats.activeAgents), numericValue: statsData.quickStats.activeAgents, color: '#06B6D4', colorRgb: '6,182,212' },
      { label: 'Idle Agents', value: String(statsData.quickStats.idleAgents), numericValue: statsData.quickStats.idleAgents, color: '#6B7280', colorRgb: '107,114,128' },
      { label: 'Tasks', value: String(statsData.quickStats.totalTasks), numericValue: statsData.quickStats.totalTasks, color: '#22D3EE', colorRgb: '34,211,238' },
      { label: 'Formulas Coverage', value: statsData.quickStats.formulasCoverage + '%', numericValue: statsData.quickStats.formulasCoverage, color: '#0891B2', colorRgb: '8,145,178' },
    ],
    statusDistribution: statsData.statusDistribution,
    roleGroups: statsData.roleGroups.map((rg: any) => ({ ...rg, icon: ROLE_GROUP_ICONS[rg.name] || (() => null), desc: rg.description || rg.desc, statusSummary: rg.statusSummary || [] })),
    agentList: statsData.agents.map((a: any) => ({ name: a.name, group: a.roleGroup, status: statusRole(a.status), role: statusRole(a.status) })),
    activityEvents: statsData.activityEvents, topPerformers: statsData.topPerformers,
    connectionHeatmapData: statsData.connectionHeatmap, networkActivityData: statsData.networkActivity,
  }
}

export function useDashboardData() {
  const [statsData, setStatsData] = useState<any>(null)
  const [workflowsData, setWorkflowsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const fetchStatsRef = useRef<() => Promise<void>>(async () => {})

  const fetchStats = useCallback(async () => {
    try {
      const [statsRes, workflowsRes] = await Promise.all([
        fetchWithRetry('/api/stats'), fetchWithRetry('/api/workflows'),
      ])
      if (statsRes.ok) setStatsData(await statsRes.json())
      if (workflowsRes.ok) setWorkflowsData(await workflowsRes.json())
    } catch { /* fallback to hardcoded constants */ } finally { setLoading(false) }
  }, [])

  fetchStatsRef.current = fetchStats
  const refreshTime = () => setLastUpdated(new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }))
  useEffect(() => {
    fetchStats()
    refreshTime()
  }, [fetchStats])
  const handleRefresh = useCallback(() => {
    fetchStats()
    refreshTime()
  }, [fetchStats])

  return { statsData, workflowsData, loading, lastUpdated, ...buildDashboardValues(statsData), fetchStatsRef, handleRefresh }
}
