import React from 'react'

export function BackgroundGrid({ width, height, zoom: zoomLevel }: { width: number; height: number; zoom: number }) {
  const baseSpacing = 60
  // Scale grid spacing with zoom to keep visual density consistent
  const spacing = baseSpacing * Math.max(0.5, Math.min(2, 1 / zoomLevel))
  return (
    <g opacity={0.06}>
      {Array.from({ length: Math.ceil(width / spacing) + 1 }, (_, i) => (
        <line
          key={`vg-${i}`}
          x1={i * spacing}
          y1={0}
          x2={i * spacing}
          y2={height}
          stroke="#333333"
          strokeWidth={0.15 * Math.max(0.5, zoomLevel)}
        />
      ))}
      {Array.from({ length: Math.ceil(height / spacing) + 1 }, (_, i) => (
        <line
          key={`hg-${i}`}
          x1={0}
          y1={i * spacing}
          x2={width}
          y2={i * spacing}
          stroke="#333333"
          strokeWidth={0.15 * Math.max(0.5, zoomLevel)}
        />
      ))}
    </g>
  )
}

// ─── Data Flow Particles (along connection lines) ────────────────────────────

interface FlowParticle {
  id: number
  progress: number
  speed: number
}

