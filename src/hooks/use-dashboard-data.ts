'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchWithRetry } from '@/lib/client-fetch'
import {
  QUICK_STATS, STATUS_DISTRIBUTION, ROLE_GROUPS, AGENT_LIST,
  ACTIVITY_EVENTS, TOP_PERFORMERS, CONNECTION_HEATMAP_DATA,
  NETWORK_ACTIVITY_DATA, ROLE_GROUP_ICONS,
} from '@/data/dashboard-constants'

export function useDashboardData() {
  const [statsData, setStatsData] = useState<any>(null)
  const [workflowsData, setWorkflowsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>('')
  const fetchStatsRef = useRef<() => Promise<void>>(async () => {})

  const fetchStats = useCallback(async () => {
    try {
      const [statsRes, workflowsRes] = await Promise.all([
        fetchWithRetry('/api/stats'),
        fetchWithRetry('/api/workflows'),
      ])
      if (statsRes.ok) { const data = await statsRes.json(); setStatsData(data) }
      if (workflowsRes.ok) { const wfData = await workflowsRes.json(); setWorkflowsData(wfData) }
    } catch {
      // fallback to hardcoded constants
    } finally { setLoading(false) }
  }, [])

  fetchStatsRef.current = fetchStats

  useEffect(() => {
    fetchStats()
    setLastUpdated(new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }))
  }, [fetchStats])

  const handleRefresh = useCallback(() => {
    fetchStats()
    setLastUpdated(new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }))
  }, [fetchStats])

  // Computed values with fallbacks
  const quickStats = statsData ? [
    { label: 'Total Agents', value: String(statsData.quickStats.totalAgents), numericValue: statsData.quickStats.totalAgents, color: '#06B6D4', colorRgb: '6,182,212' },
    { label: 'Role Groups', value: String(statsData.quickStats.roleGroups), numericValue: statsData.quickStats.roleGroups, color: '#0891B2', colorRgb: '8,145,178' },
    { label: 'Cognitive Formulas', value: String(statsData.quickStats.cognitiveFormulas), numericValue: statsData.quickStats.cognitiveFormulas, color: '#6B7280', colorRgb: '107,114,128' },
    { label: 'Edge Types', value: String(statsData.quickStats.edgeTypes), numericValue: statsData.quickStats.edgeTypes, color: '#475569', colorRgb: '71,85,105' },
    { label: 'Active Agents', value: String(statsData.quickStats.activeAgents), numericValue: statsData.quickStats.activeAgents, color: '#06B6D4', colorRgb: '6,182,212' },
    { label: 'Idle Agents', value: String(statsData.quickStats.idleAgents), numericValue: statsData.quickStats.idleAgents, color: '#6B7280', colorRgb: '107,114,128' },
    { label: 'Tasks', value: String(statsData.quickStats.totalTasks), numericValue: statsData.quickStats.totalTasks, color: '#22D3EE', colorRgb: '34,211,238' },
    { label: 'Formulas Coverage', value: statsData.quickStats.formulasCoverage + '%', numericValue: statsData.quickStats.formulasCoverage, color: '#0891B2', colorRgb: '8,145,178' },
  ] : QUICK_STATS

  const statusDistribution = statsData ? statsData.statusDistribution : STATUS_DISTRIBUTION

  const roleGroups = statsData ? statsData.roleGroups.map((rg: any) => ({
    ...rg,
    icon: ROLE_GROUP_ICONS[rg.name] || (() => null),
    desc: rg.description || rg.desc,
    statusSummary: rg.statusSummary || [],
  })) : ROLE_GROUPS

  const agentList = statsData ? statsData.agents.map((a: any) => ({
    name: a.name,
    group: a.roleGroup,
    status: a.status === 'active' ? 'active' as const : a.status === 'idle' ? 'idle' as const : a.status === 'paused' ? 'paused' as const : a.status === 'standby' ? 'standby' as const : a.status === 'error' ? 'offline' as const : 'offline' as const,
    role: a.status === 'active' ? 'active' as const : a.status === 'idle' ? 'idle' as const : a.status === 'paused' ? 'paused' as const : a.status === 'standby' ? 'standby' as const : a.status === 'error' ? 'offline' as const : 'offline' as const,
  })) : AGENT_LIST

  const activityEvents = statsData ? statsData.activityEvents : ACTIVITY_EVENTS
  const topPerformers = statsData ? statsData.topPerformers : TOP_PERFORMERS
  const connectionHeatmapData = statsData ? statsData.connectionHeatmap : CONNECTION_HEATMAP_DATA
  const networkActivityData = statsData ? statsData.networkActivity : NETWORK_ACTIVITY_DATA

  return {
    statsData, workflowsData, loading, lastUpdated,
    quickStats, statusDistribution, roleGroups, agentList,
    activityEvents, topPerformers, connectionHeatmapData, networkActivityData,
    fetchStatsRef, handleRefresh,
  }
}
