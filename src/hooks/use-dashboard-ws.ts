'use client'

import { useState, useEffect, useRef } from 'react'
import { io as socketIO, Socket } from 'socket.io-client'

export function useDashboardWs(onDataChange: () => void) {
  const [wsConnected, setWsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const socket = socketIO('/?XTransformPort=3003', {
      transports: ['websocket', 'polling'],
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      timeout: 10000,
    })
    socketRef.current = socket

    socket.on('connect', () => { console.log('[ws:dashboard] connected'); setWsConnected(true) })
    socket.on('disconnect', () => { console.log('[ws:dashboard] disconnected'); setWsConnected(false) })

    const events = ['agent:status', 'agent:created', 'agent:updated', 'agent:deleted', 'agents:snapshot']
    events.forEach(evt => socket.on(evt, () => onDataChange()))

    return () => { socket.disconnect(); socketRef.current = null }
  }, [onDataChange])

  return { wsConnected }
}
