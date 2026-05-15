'use client'

import { io as socketIO, Socket } from 'socket.io-client'

// ─── Singleton WebSocket client for emitting mutation events ─────────────────
// Both useHierarchyData and useDashboardWs create their OWN socket for listening.
// This singleton is used ONLY for emitting events (agent:deleted, agent:updated, agent:created)
// after successful mutations, so other views/tabs receive real-time updates.

let emitSocket: Socket | null = null

function getEmitSocket(): Socket {
  if (!emitSocket) {
    emitSocket = socketIO('/?XTransformPort=3003', {
      transports: ['websocket', 'polling'],
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 5000,
    })
  }
  return emitSocket
}

/** Emit an agent:deleted event to the WS service */
export function emitAgentDeleted(agentId: string) {
  try { getEmitSocket().emit('agent:deleted', { agentId }) } catch { /* non-critical */ }
}

/** Emit an agent:updated event to the WS service */
export function emitAgentUpdated(agent: Record<string, unknown>) {
  try { getEmitSocket().emit('agent:updated', { agent }) } catch { /* non-critical */ }
}

/** Emit an agent:created event to the WS service */
export function emitAgentCreated(agent: Record<string, unknown>) {
  try { getEmitSocket().emit('agent:created', { agent }) } catch { /* non-critical */ }
}
