'use client'

import { type HTMLAttributes } from 'react'

// ─── Types ────────────────────────────────────────────────────

export interface BackToTopPulseProps extends HTMLAttributes<HTMLSpanElement> {
  /** Clip-path CSS value for shape matching */
  clipPath: string
  /** Unique keyframe animation name */
  animationName: string
  /** RGB channel string, e.g. "0, 229, 255" */
  channels: string
}

// ─── BackToTopPulse Component ─────────────────────────────────

/**
 * BackToTopPulse -- animated pulse ring for BackToTop button.
 *
 * Renders a CSS-animated expanding ring that fades out, matching
 * the parent button shape via clip-path. Injects its own @keyframes
 * rule with a unique animation name to avoid collisions.
 */
export function BackToTopPulse({
  clipPath,
  animationName,
  channels,
}: BackToTopPulseProps) {
  return (
    <>
      <span
        className="absolute inset-0 pointer-events-none"
        style={{
          clipPath,
          animation: `${animationName} 2s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
        }}
      />
      <style>{`
        @keyframes ${animationName} {
          0% {
            opacity: 0.6;
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(${channels}, 0.4);
          }
          70% {
            opacity: 0;
            transform: scale(1.6);
            box-shadow: 0 0 0 14px rgba(${channels}, 0);
          }
          100% {
            opacity: 0;
            transform: scale(1.6);
            box-shadow: 0 0 0 14px rgba(${channels}, 0);
          }
        }
      `}</style>
    </>
  )
}
