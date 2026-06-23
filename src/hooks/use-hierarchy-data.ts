'use client'

import { useState, useEffect, useCallback, useMemo, useRef, type MutableRefObject } from 'react'
import { io as socketIO, Socket } from 'socket.io-client'
import { buildConnections } from '@/components/hierarchy/build-connections'
import type { AgentData, ConnectionData } from '@/components/hierarchy/types'
import { fetchWithRetry } from '@/lib/client-fetch'

// ─── Data fetching + WebSocket + connections ────────────────────────────────────

export function useHierarchyData(reactFlowInstanceRef: MutableRefObject<any>) {
  const [agents, setAgents] = useState<AgentData[]>([])
  const [loading, setLoading] = useState(true)
  const [apiConnections, setApiConnections] = useState<ConnectionData[]>([])
  const [wsConnected, setWsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const agentsLengthRef = useRef(0)

  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetchWithRetry('/api/hierarchy')
      const data = await res.json()
      setAgents(data.agents || [])
      agentsLengthRef.current = (data.agents || []).length
      if (Array.isArray(data.connections)) setApiConnections(data.connections)
      if (reactFlowInstanceRef.current) {
        setTimeout(() => reactFlowInstanceRef.current?.fitView({ padding: 0.15, duration: 600 }), 300)
      }
    } catch {
      setAgents([])
    } finally {
      setLoading(false)
    }
  }, [reactFlowInstanceRef])

  // WebSocket connection for real-time updates
  useEffect(() => {
    const socket = socketIO('/?XTransformPort=3003', {
      transports: ['websocket', 'polling'],
      forceNew: true, reconnection: true, reconnectionAttempts: Infinity,
      reconnectionDelay: 2000, reconnectionDelayMax: 10000, timeout: 10000,
    })
    socketRef.current = socket

    socket.on('connect', () => { console.log('[ws] connected'); setWsConnected(true) })
    socket.on('disconnect', () => { console.log('[ws] disconnected'); setWsConnected(false) })
    socket.on('agents:snapshot', (data: { agents: AgentData[] }) => {
      if (data.agents && data.agents.length > 0) setAgents(data.agents)
    })
    socket.on('agent:status', (data: { agentId: string; newStatus: string }) => {
      setAgents(prev => prev.map(a => a.id === data.agentId ? { ...a, status: data.newStatus } : a))
    })
    socket.on('agent:created', () => {
      // Re-fetch from API instead of double-updating state
      fetchAgents()
    })
    socket.on('agent:updated', (data: { agent: AgentData }) => {
      setAgents(prev => prev.map(a => a.id === data.agent.id ? { ...a, ...data.agent } : a))
    })
    socket.on('agent:deleted', (data: { agentId: string }) => {
      setAgents(prev => prev.filter(a => a.id !== data.agentId))
    })

    return () => { socket.disconnect(); socketRef.current = null }
  }, [])

  // Fallback: simulate status transitions when WebSocket is disconnected
  // Use ref for agents.length to avoid re-running the effect on every status change
  useEffect(() => {
    if (wsConnected) return
    const statusCycle = ['active', 'idle', 'paused', 'standby'] as const
    const interval = setInterval(() => {
      setAgents(prev => {
        if (prev.length === 0) return prev
        const next = [...prev]
        const count = 1 + Math.floor(Math.random() * 2)
        for (let i = 0; i < count; i++) {
          const idx = Math.floor(Math.random() * next.length)
          const agent = next[idx]
          const currentIdx = statusCycle.indexOf(agent.status as typeof statusCycle[number])
          const nextIdx = (currentIdx + 1 + Math.floor(Math.random() * (statusCycle.length - 1))) % statusCycle.length
          next[idx] = { ...agent, status: statusCycle[nextIdx] }
        }
        return next
      })
    }, 15000)
    return () => clearInterval(interval)
  }, [wsConnected])

  useEffect(() => { fetchAgents() }, [fetchAgents])

  // Fallback to client-side connections if API didn't provide them
  const clientConnections = useMemo(() => buildConnections(agents), [agents])
  const connections = apiConnections.length > 0 ? apiConnections : clientConnections

  return { agents, setAgents, loading, connections, wsConnected, fetchAgents }
}
