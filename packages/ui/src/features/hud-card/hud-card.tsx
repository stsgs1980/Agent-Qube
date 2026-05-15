'use client'

import { forwardRef, useRef, type ReactNode } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '../../tokens/cn'
import { hexToChannels } from '../../tokens/color-utils'

// ─── Types ────────────────────────────────────────────────────

export interface HudCardProps {
  /** Card content */
  children: ReactNode
  /** Additional CSS classes */
  className?: string
  /** Animation delay in seconds (default 0) */
  delay?: number
  /** Accent color for borders, corners, glow, and title bar (default "#00e5ff") */
  accentColor?: string
  /** Title text rendered as a header bar (optional) */
  title?: string
  /** Show decorative corner brackets (default true) */
  showCorners?: boolean
  /** Show animated scanline overlay (default true) */
  showScanline?: boolean
  /** Background color (default "rgba(10, 10, 26, 0.8)") */
  bgColor?: string
  /** Padding class (default "p-4 sm:p-6") */
  padding?: string
}

// ─── HUDCard Component ───────────────────────────────────────

/**
 * HudCard -- sci-fi styled card with accent glow, corner brackets, and optional title bar.
 *
 * A glassmorphic panel with animated entrance, decorative HUD corners,
 * optional scanline overlay, and a pulsing title bar. Fully configurable
 * via props -- use any accent color, toggle decorations, and customize padding.
 *
 * @example
 * ```tsx
 * <HudCard
 *   title="SYSTEM STATUS"
 *   accentColor="#f59e0b"
 *   showScanline={false}
 * >
 *   <p>All systems operational</p>
 * </HudCard>
 * ```
 */
export const HudCard = forwardRef<HTMLDivElement, HudCardProps>(
  (
    {
      children,
      className,
      delay = 0,
      accentColor = '#00e5ff',
      title,
      showCorners = true,
      showScanline = true,
      bgColor = 'rgba(10, 10, 26, 0.8)',
      padding = 'p-4 sm:p-6',
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLDivElement>(null)
    const ref = forwardedRef ?? internalRef
    const isInView = useInView(ref as React.RefObject<HTMLDivElement>, { once: true, margin: '-50px' })

    const { r, g, b } = hexToChannels(accentColor)

    return (
      <motion.div
        ref={ref as React.RefObject<HTMLDivElement>}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
        className={cn('relative overflow-hidden backdrop-blur-sm rounded-sm', className)}
        style={{
          backgroundColor: bgColor,
          border: `1px solid rgba(${r}, ${g}, ${b}, 0.3)`,
          boxShadow: `inset 0 0 30px rgba(0,0,0,0.3), 0 0 15px rgba(${r}, ${g}, ${b}, 0.08)`,
        }}
        data-slot="hud-card"
      >
        {/* HUD corners */}
        {showCorners && (
          <>
            <div className="absolute top-0 left-0 w-5 h-5" style={{ borderTop: `2px solid ${accentColor}`, borderLeft: `2px solid ${accentColor}` }} />
            <div className="absolute top-0 right-0 w-5 h-5" style={{ borderTop: `2px solid ${accentColor}`, borderRight: `2px solid ${accentColor}` }} />
            <div className="absolute bottom-0 left-0 w-5 h-5" style={{ borderBottom: `2px solid ${accentColor}`, borderLeft: `2px solid ${accentColor}` }} />
            <div className="absolute bottom-0 right-0 w-5 h-5" style={{ borderBottom: `2px solid ${accentColor}`, borderRight: `2px solid ${accentColor}` }} />
          </>
        )}

        {/* Scanline */}
        {showScanline && (
          <div
            className="absolute inset-0 pointer-events-none z-10 opacity-20"
            style={{
              backgroundImage: `linear-gradient(180deg, transparent 0%, rgba(${r}, ${g}, ${b}, 0.06) 50%, transparent 100%)`,
              backgroundSize: '100% 4px',
            }}
          />
        )}

        {/* Title bar */}
        {title && (
          <div
            className="px-4 py-2 text-xs font-mono uppercase tracking-widest border-b"
            style={{
              color: accentColor,
              borderColor: `rgba(${r}, ${g}, ${b}, 0.2)`,
              backgroundColor: `rgba(${r}, ${g}, ${b}, 0.05)`,
            }}
          >
            <span className="inline-block w-2 h-2 rounded-full mr-2 animate-pulse" style={{ backgroundColor: accentColor }} />
            {title}
          </div>
        )}

        <div className={cn('relative z-10', padding)}>
          {children}
        </div>
      </motion.div>
    )
  },
)
HudCard.displayName = 'HudCard'
