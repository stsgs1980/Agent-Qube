'use client'

import { useState, useEffect, useCallback, useMemo, useRef, type MutableRefObject } from 'react'
import { io as socketIO, Socket } from 'socket.io-client'
import { buildConnections } from '@/components/hierarchy/build-connections'
import type { AgentData, ConnectionData } from '@/components/hierarchy/types'
import { fetchWithRetry } from '@/lib/client-fetch'
import { createSocketHandlers } from './use-hierarchy-data-helpers'

function mockStatusCycle(wsConnected: boolean, setAgents: (fn: (prev: AgentData[]) => AgentData[]) => void) {
  if (wsConnected) return undefined
  const statusCycle = ['active', 'idle', 'paused', 'standby'] as const
  return setInterval(() => {
    setAgents(prev => {
      if (prev.length === 0) return prev
      const next = [...prev]
      const count = 1 + Math.floor(Math.random() * 2)
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * next.length)
        const agent = next[idx]
        const curIdx = statusCycle.indexOf(agent.status as typeof statusCycle[number])
        const nextIdx = (curIdx + 1 + Math.floor(Math.random() * (statusCycle.length - 1))) % statusCycle.length
        next[idx] = { ...agent, status: statusCycle[nextIdx] }
      }
      return next
    })
  }, 15000)
}

export function useHierarchyData(reactFlowInstanceRef: MutableRefObject<any>) {
  const [agents, setAgents] = useState<AgentData[]>([])
  const [loading, setLoading] = useState(true)
  const [apiConnections, setApiConnections] = useState<ConnectionData[]>([])
  const [wsConnected, setWsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  const fetchAgents = useCallback(async () => {
    try {
      const res = await fetchWithRetry('/api/hierarchy')
      const data = await res.json()
      setAgents(data.agents || [])
      if (Array.isArray(data.connections)) setApiConnections(data.connections)
      if (reactFlowInstanceRef.current) {
        setTimeout(() => reactFlowInstanceRef.current?.fitView({ padding: 0.15, duration: 600 }), 300)
      }
    } catch { setAgents([]) } finally { setLoading(false) }
  }, [reactFlowInstanceRef])

  useEffect(() => {
    const socket = socketIO('/?XTransformPort=3003', {
      transports: ['websocket', 'polling'], forceNew: true, reconnection: true,
      reconnectionAttempts: Infinity, reconnectionDelay: 2000,
      reconnectionDelayMax: 10000, timeout: 10000,
    })
    socketRef.current = socket
    socket.on('connect', () => { setWsConnected(true) })
    socket.on('disconnect', () => { setWsConnected(false) })
    socket.on('agents:snapshot', (data: { agents: AgentData[] }) => {
      if (data.agents?.length > 0) setAgents(data.agents)
    })
    const handlers = createSocketHandlers(setAgents, fetchAgents)
    socket.on('agent:status', handlers.handleStatus)
    socket.on('agent:created', handlers.handleCreated)
    socket.on('agent:updated', handlers.handleUpdated)
    socket.on('agent:deleted', handlers.handleDeleted)
    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [])

  useEffect(() => {
    const interval = mockStatusCycle(wsConnected, setAgents)
    return () => { if (interval) clearInterval(interval) }
  }, [wsConnected])

  useEffect(() => { fetchAgents() }, [fetchAgents])

  const clientConnections = useMemo(() => buildConnections(agents), [agents])
  const connections = apiConnections.length > 0 ? apiConnections : clientConnections

  return { agents, setAgents, loading, connections, wsConnected, fetchAgents }
}