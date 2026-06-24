import type { EdgeType } from './types'
import { EDGE_CONFIG } from './types'

export function computeArrows(x1: number, y1: number, x2: number, cy1: number) {
  const endAngle = Math.atan2(y2 - cy1, x2 - x1)
  const arrowLen = 8
  return {
    end: {
      x1: x2 - arrowLen * Math.cos(endAngle - Math.PI / 6),
      y1: y2 - arrowLen * Math.sin(endAngle - Math.PI / 6),
      x2: x2 - arrowLen * Math.cos(endAngle + Math.PI / 6),
      y2: y2 - arrowLen * Math.sin(endAngle + Math.PI / 6),
    },
    startAngle: Math.atan2(y1 - cy1, x1 - x1),
  }
}

export function computeStartArrows(x1: number, y1: number, cy1: number) {
  const startAngle = Math.atan2(y1 - cy1, x1 - x1)
  const arrowLen = 8
  return {
    x1: x1 - arrowLen * Math.cos(startAngle - Math.PI / 6),
    y1: y1 - arrowLen * Math.sin(startAngle - Math.PI / 6),
    x2: x1 - arrowLen * Math.cos(startAngle + Math.PI / 6),
    y2: y1 - arrowLen * Math.sin(startAngle + Math.PI / 6),
  }
}

export function computePath(x1: number, y1: number, x2: number, y2: number) {
  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2
  const dx = x2 - x1
  const dy = y2 - y1
  const dist = Math.sqrt(dx * dx + dy * dy)
  const offset = dist * 0.2
  const cx1 = midX - (dy / dist) * offset
  const cy1 = midY + (dx / dist) * offset
  return { pathD: `M ${x1} ${y1} Q ${cx1} ${cy1} ${x2} ${y2}`, midX, midY, cx1, cy1 }
}

export function computeStrokeWidth(type: EdgeType, strength: number) {
  const strengthFactor = 0.5 + strength * 0.5
  const base: Record<string, number> = { command: 0.2, twin: 0.2, delegate: 0.18, supervise: 0.12, broadcast: 0.15 }
  return (base[type] || 0.15) * strengthFactor
}

export function computeStrokeOpacity(isPulsing: boolean, isHovered: boolean, strength: number) {
  const strengthFactor = 0.5 + strength * 0.5
  return isPulsing ? 0.4 * strengthFactor : isHovered ? 0.4 * strengthFactor : 0.18 * strengthFactor
}