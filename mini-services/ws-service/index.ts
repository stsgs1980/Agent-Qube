import { createServer } from 'http'
import { Server } from 'socket.io'
import Database from 'bun:sqlite'

const PORT = parseInt(process.env.WS_PORT || '3003', 10)
const DB_PATH = process.env.DB_PATH || './db/custom.db'

// ─── SQLite Setup ─────────────────────────────────────────────────────────────

const db = new Database(DB_PATH)
db.exec('PRAGMA journal_mode=WAL')

// ─── Helper: Read all agents from DB ──────────────────────────────────────────

interface AgentRow {
  id: string
  name: string
  role: string
  roleGroup: string
  status: string
  formula: string
  parentId: string | null
  twinId: string | null
  skills: string
  description: string
  avatar: string
  createdAt: string
  updatedAt: string
}

function getAllAgents(): AgentRow[] {
  const rows = db.query('SELECT * FROM Agent ORDER BY "createdAt" ASC').all() as AgentRow[]
  return rows || []
}

function getAgentById(id: string): AgentRow | null {
  const row = db.query('SELECT * FROM Agent WHERE id = ?').get(id) as AgentRow | null
  return row || null
}

function updateAgentStatus(id: string, newStatus: string): AgentRow | null {
  db.query('UPDATE Agent SET status = ?, "updatedAt" = datetime("now") WHERE id = ?').run(newStatus, id)
  return getAgentById(id)
}

// ─── Allowed origins for CORS ─────────────────────────────────────────────────

const ALLOWED_ORIGINS = [
  process.env.APP_URL || 'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3003',
].filter(Boolean)

// ─── HTTP Server + Socket.IO ──────────────────────────────────────────────────

const httpServer = createServer()
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, Postman)
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
})

// ─── Authentication middleware for WebSocket ───────────────────────────────────

function authenticateSocket(socket: any): boolean {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token
  if (!token) {
    return false
  }

  // In production, verify JWT signature here
  // For now, presence of token is sufficient
  return typeof token === 'string' && token.length > 0
}

// ─── Valid status values ──────────────────────────────────────────────────────

const VALID_STATUSES = ['active', 'idle', 'paused', 'standby', 'error', 'offline']
const VALID_ROLES = ['Strategy', 'Tactics', 'Control', 'Execution', 'Memory', 'Monitoring', 'Communication', 'Learning']

// ─── Status simulation constants ──────────────────────────────────────────────

const STATUS_CYCLE = ['active', 'idle', 'paused', 'standby'] as const

function randomStatusChange(): void {
  const agents = getAllAgents()
  if (agents.length === 0) return

  const count = 1 + Math.floor(Math.random() * 2) // 1-2 agents

  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * agents.length)
    const agent = agents[idx]
    if (!agent) continue

    const currentIdx = STATUS_CYCLE.indexOf(agent.status as typeof STATUS_CYCLE[number])
    if (currentIdx === -1) continue

    const nextIdx = (currentIdx + 1 + Math.floor(Math.random() * (STATUS_CYCLE.length - 1))) % STATUS_CYCLE.length
    const newStatus = STATUS_CYCLE[nextIdx]
    const oldStatus = agent.status

    const updated = updateAgentStatus(agent.id, newStatus)
    if (updated) {
      // Broadcast the status change to all connected clients
      io.emit('agent:status', {
        agentId: agent.id,
        newStatus,
        oldStatus,
        timestamp: new Date().toISOString(),
      })
      console.log(`[status] ${agent.name}: ${oldStatus} -> ${newStatus}`)
    }
  }
}

// ─── Run status simulation every 10-15 seconds ──────────────────────────────

let statusInterval: ReturnType<typeof setTimeout> | null = null

function scheduleStatusChange(): void {
  const delay = 10000 + Math.floor(Math.random() * 5000) // 10-15 seconds
  statusInterval = setTimeout(() => {
    randomStatusChange()
    scheduleStatusChange()
  }, delay)
}

// ─── Connection Handler ───────────────────────────────────────────────────────

io.use((socket, next) => {
  if (authenticateSocket(socket)) {
    next()
  } else {
    next(new Error('Authentication required'))
  }
})

io.on('connection', (socket) => {
  console.log(`[connect] client ${socket.id}`)

  // Send current agent snapshot on connect
  const agents = getAllAgents()
  socket.emit('agents:snapshot', { agents })

  // Handle manual status change requests from clients
  socket.on('agent:change-status', (data: { agentId: string; newStatus: string }) => {
    // Validate input
    if (!data.agentId || !data.newStatus) {
      socket.emit('error', { message: 'agentId and newStatus are required' })
      return
    }

    if (!VALID_STATUSES.includes(data.newStatus)) {
      socket.emit('error', { message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` })
      return
    }

    const agent = getAgentById(data.agentId)
    if (!agent) {
      socket.emit('error', { message: 'Agent not found' })
      return
    }

    const oldStatus = agent.status
    const updated = updateAgentStatus(data.agentId, data.newStatus)
    if (updated) {
      io.emit('agent:status', {
        agentId: data.agentId,
        newStatus: data.newStatus,
        oldStatus,
        timestamp: new Date().toISOString(),
      })
    }
  })

  // Handle agent created notification
  socket.on('agent:created', (data: { agent: AgentRow }) => {
    // Validate agent data
    if (!data.agent?.name || !data.agent?.role || !data.agent?.roleGroup) {
      socket.emit('error', { message: 'Invalid agent data' })
      return
    }

    if (!VALID_ROLES.includes(data.agent.roleGroup)) {
      socket.emit('error', { message: `Invalid roleGroup. Must be one of: ${VALID_ROLES.join(', ')}` })
      return
    }

    io.emit('agent:created', data)
    console.log(`[created] ${data.agent.name}`)
  })

  // Handle agent updated notification
  socket.on('agent:updated', (data: { agent: AgentRow }) => {
    // Validate agent data
    if (!data.agent?.name || !data.agent?.role || !data.agent?.roleGroup) {
      socket.emit('error', { message: 'Invalid agent data' })
      return
    }

    io.emit('agent:updated', data)
    console.log(`[updated] ${data.agent.name}`)
  })

  // Handle agent deleted notification
  socket.on('agent:deleted', (data: { agentId: string }) => {
    if (!data.agentId) {
      socket.emit('error', { message: 'agentId is required' })
      return
    }

    io.emit('agent:deleted', data)
    console.log(`[deleted] ${data.agentId}`)
  })

  socket.on('disconnect', (reason) => {
    console.log(`[disconnect] client ${socket.id}: ${reason}`)
  })

  socket.on('error', (error) => {
    console.error(`[error] socket ${socket.id}:`, error)
  })
})

// ─── Start Server ─────────────────────────────────────────────────────────────

httpServer.listen(PORT, () => {
  console.log(`[ws-service] Agent Qube WebSocket service running on port ${PORT}`)
  console.log(`[ws-service] DB: ${DB_PATH}`)
  console.log(`[ws-service] Agents in DB: ${getAllAgents().length}`)

  // Start the status simulation
  scheduleStatusChange()
  console.log('[ws-service] Status simulation started (every 10-15s)')
})

// ─── Graceful Shutdown ────────────────────────────────────────────────────────

process.on('SIGTERM', () => {
  console.log('[ws-service] Received SIGTERM, shutting down...')
  if (statusInterval) clearTimeout(statusInterval)
  io.close()
  httpServer.close(() => {
    db.close()
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('[ws-service] Received SIGINT, shutting down...')
  if (statusInterval) clearTimeout(statusInterval)
  io.close()
  httpServer.close(() => {
    db.close()
    process.exit(0)
  })
})
