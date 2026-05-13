'use client'

import React from 'react'
import { EDGE_CONFIG, type EdgeType } from './types'

// ─── Animation duration per edge type (seconds) ────────────────────────────────

export const EDGE_DURATIONS: Record<EdgeType, number> = {
  command: 3,
  sync: 5,
  twin: 4,
  delegate: 3.5,
  supervise: 6,
  broadcast: 2.5,
}

// ─── Particle definitions ──────────────────────────────────────────────────────

const PARTICLES = [
  { offset: 0, sizeMultiplier: 1 },
  { offset: 0.33, sizeMultiplier: 0.85 },
  { offset: 0.66, sizeMultiplier: 0.7 },
]

// ─── Animated flow particles for edges ──────────────────────────────────────────

export function EdgeParticles({
  id,
  edgePath,
  edgeType,
  strength,
}: {
  id: string
  edgePath: string
  edgeType: EdgeType
  strength: number
}) {
  const config = EDGE_CONFIG[edgeType]
  const dur = EDGE_DURATIONS[edgeType]

  return (
    <g>
      <defs>
        <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id={`trail-${id}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {PARTICLES.map((particle, i) => {
        const baseRadius = 2 + strength * 0.5
        const radius = baseRadius * particle.sizeMultiplier
        const beginOffset = particle.offset * dur

        return (
          <g key={`${id}-particle-${i}`}>
            <circle r={radius * 2.5} fill={config.color} opacity={0.15} filter={`url(#trail-${id})`}>
              <animateMotion path={edgePath} dur={`${dur}s`} begin={`${beginOffset}s`} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
            </circle>
            <circle r={radius} fill={config.color} opacity={0.7} filter={`url(#glow-${id})`}>
              <animateMotion path={edgePath} dur={`${dur}s`} begin={`${beginOffset}s`} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
              <animate attributeName="opacity" values="0.5;0.85;0.5" dur={`${dur * 0.5}s`} repeatCount="indefinite" />
            </circle>
          </g>
        )
      })}
    </g>
  )
}
