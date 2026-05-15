'use client'

import { forwardRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../tokens/cn'
import { hexToChannels } from '../../tokens/color-utils'
import { BackToTopPulse } from './back-to-top-pulse'

// ─── Types ────────────────────────────────────────────────────

export interface BackToTopProps {
  /** Accent color (default "#00e5ff") */
  accentColor?: string
  /** Button shape (default "hexagon") */
  shape?: 'hexagon' | 'circle' | 'diamond'
  /** Button size in pixels (default 52) */
  size?: number
  /** Scroll distance in pixels to show the button (default 600) */
  threshold?: number
  /** Show pulse ring animation (default true) */
  pulse?: boolean
  /** Position from bottom/right in pixels (default 24) */
  offset?: number
  /** z-index (default "z-40") */
  zIndex?: string
  /** Additional CSS classes */
  className?: string
}

// ─── Clip paths ───────────────────────────────────────────────

const clipPaths: Record<string, string> = {
  hexagon: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
  circle: 'circle(50% at 50% 50%)',
  diamond: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
}

// ─── BackToTop Component ──────────────────────────────────────

/**
 * BackToTop -- floating button with spring animation that scrolls to top.
 *
 * A fixed-position button that appears after scrolling past a threshold.
 * Supports three shapes (hexagon, circle, diamond), configurable accent color,
 * and a pulsing ring animation. Uses framer-motion for enter/exit transitions.
 *
 * @example
 * ```tsx
 * <BackToTop accentColor="#f59e0b" shape="circle" size={44} />
 * ```
 */
export const BackToTop = forwardRef<HTMLButtonElement, BackToTopProps>(
  (
    {
      accentColor = '#00e5ff',
      shape = 'hexagon',
      size = 52,
      threshold = 600,
      pulse = true,
      offset = 24,
      zIndex = 'z-40',
      className,
    },
    _ref,
  ) => {
    const [isVisible, setIsVisible] = useState(false)
    const clipPath = clipPaths[shape] ?? clipPaths.hexagon
    const { r, g, b } = hexToChannels(accentColor)
    const ch = `${r}, ${g}, ${b}`

    const handleScroll = useCallback(() => {
      setIsVisible(window.scrollY > threshold)
    }, [threshold])

    useEffect(() => {
      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }, [handleScroll])

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={cn('fixed group cursor-pointer', zIndex, className)}
            style={{
              bottom: offset,
              right: offset,
              width: size,
              height: size,
              background: `rgba(${ch}, 0.06)`,
              border: `1.5px solid rgba(${ch}, 0.5)`,
              clipPath,
              boxShadow: `0 0 12px rgba(${ch}, 0.25), inset 0 0 12px rgba(${ch}, 0.08)`,
              transition: 'box-shadow 0.3s ease, background 0.3s ease',
            }}
            aria-label="Scroll to top"
            data-slot="back-to-top"
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                `0 0 24px rgba(${ch}, 0.6), 0 0 48px rgba(${ch}, 0.2), inset 0 0 20px rgba(${ch}, 0.12)`
              e.currentTarget.style.background = `rgba(${ch}, 0.12)`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow =
                `0 0 12px rgba(${ch}, 0.25), inset 0 0 12px rgba(${ch}, 0.08)`
              e.currentTarget.style.background = `rgba(${ch}, 0.06)`
            }}
          >
            {pulse && (
              <BackToTopPulse
                clipPath={clipPath}
                animationName={`bttPulse-${accentColor.replace('#', '')}`}
                channels={ch}
              />
            )}

            {/* Chevron-up icon */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke={accentColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative z-10"
              style={{ filter: `drop-shadow(0 0 6px rgba(${ch}, 0.8))` }}
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    )
  },
)
BackToTop.displayName = 'BackToTop'
