import type { ForceGraphNode, ForceGraphEdge, PhysicsConfig } from './types'

// ─── Defaults ─────────────────────────────────────────────────

const DEFAULTS: Required<PhysicsConfig> = {
  repulsion: 500,
  attraction: 0.01,
  centerGravity: 0.005,
  groupGravity: 0.03,
  damping: 0.85,
  maxVelocity: 10,
  padding: 40,
}

// ─── runPhysics ───────────────────────────────────────────────

/**
 * Run one tick of force-directed physics on mutable node positions.
 *
 * Operates in-place on the nodes array (mutates x, y, vx, vy).
 * Pure function -- no React, no DOM, no side effects.
 *
 * Forces applied:
 * 1. Node-node repulsion (Coulomb-like)
 * 2. Edge attraction (spring)
 * 3. Center gravity (pull toward canvas center)
 * 4. Group clustering (same-group nodes attract)
 * 5. Velocity damping + clamping
 * 6. Boundary padding
 */
export function runPhysics(
  nodes: ForceGraphNode[],
  edges: ForceGraphEdge[],
  width: number,
  height: number,
  config: PhysicsConfig = {}
): void {
  const c = { ...DEFAULTS, ...config }
  const cx = width / 2
  const cy = height / 2
  const n = nodes.length

  // Reset acceleration accumulators
  const ax = new Float64Array(n)
  const ay = new Float64Array(n)

  // 1. Node-node repulsion
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const dx = nodes[i].x - nodes[j].x
      const dy = nodes[i].y - nodes[j].y
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      const force = c.repulsion / (dist * dist)
      const fx = (dx / dist) * force
      const fy = (dy / dist) * force
      ax[i] += fx; ay[i] += fy
      ax[j] -= fx; ay[j] -= fy
    }
  }

  // Build id->index map for edge lookups
  const idMap = new Map<string, number>()
  for (let i = 0; i < n; i++) idMap.set(nodes[i].id, i)

  // 2. Edge attraction (spring)
  for (const edge of edges) {
    const si = idMap.get(edge.source)
    const ti = idMap.get(edge.target)
    if (si === undefined || ti === undefined) continue
    const dx = nodes[ti].x - nodes[si].x
    const dy = nodes[ti].y - nodes[si].y
    ax[si] += dx * c.attraction; ay[si] += dy * c.attraction
    ax[ti] -= dx * c.attraction; ay[ti] -= dy * c.attraction
  }

  // 3. Center gravity + 4. Group clustering
  for (let i = 0; i < n; i++) {
    // Center pull
    ax[i] += (cx - nodes[i].x) * c.centerGravity
    ay[i] += (cy - nodes[i].y) * c.centerGravity

    // Group clustering: pull toward group centroid
    const gi = nodes[i].group
    if (!gi) continue
    for (let j = 0; j < n; j++) {
      if (i === j || nodes[j].group !== gi) continue
      const dx = nodes[j].x - nodes[i].x
      const dy = nodes[j].y - nodes[i].y
      ax[i] += dx * c.groupGravity
      ay[i] += dy * c.groupGravity
    }
  }

  // 5. Apply velocity + damping + clamping + 6. Boundary
  for (let i = 0; i < n; i++) {
    nodes[i].vx = (nodes[i].vx + ax[i]) * c.damping
    nodes[i].vy = (nodes[i].vy + ay[i]) * c.damping

    // Clamp velocity
    const speed = Math.sqrt(nodes[i].vx ** 2 + nodes[i].vy ** 2)
    if (speed > c.maxVelocity) {
      nodes[i].vx = (nodes[i].vx / speed) * c.maxVelocity
      nodes[i].vy = (nodes[i].vy / speed) * c.maxVelocity
    }

    // Apply position
    nodes[i].x += nodes[i].vx
    nodes[i].y += nodes[i].vy

    // Boundary clamping
    const r = nodes[i].radius
    nodes[i].x = Math.max(c.padding + r, Math.min(width - c.padding - r, nodes[i].x))
    nodes[i].y = Math.max(c.padding + r, Math.min(height - c.padding - r, nodes[i].y))
  }
}
