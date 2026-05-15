'use client'

import { forwardRef, useState, useEffect } from 'react'
import { motion, useSpring } from 'framer-motion'
import { cn } from '../../tokens/cn'

// ─── Types ────────────────────────────────────────────────────

export interface ScifiScrollProgressProps {
  /** Gradient start color (default "#00e5ff") */
  color?: string
  /** Gradient end color (default same as color) */
  colorEnd?: string
  /** Bar height in pixels (default 2) */
  height?: number
  /** Show glow shadow behind the bar (default true) */
  glow?: boolean
  /** Scroll threshold in pixels before the bar appears (default 100) */
  threshold?: number
  /** Z-index (default "z-[49]") */
  zIndex?: string
  /** Additional CSS classes */
  className?: string
}

// ─── ScifiScrollProgress Component ────────────────────────────

/**
 * ScifiScrollProgress -- glowing animated scroll progress bar.
 *
 * A fixed top bar with spring-physics animation and neon glow effect.
 * Uses framer-motion useSpring for smooth, physics-based progress tracking.
 * Appears after the user scrolls past a configurable threshold.
 *
 * @example
 * ```tsx
 * <ScifiScrollProgress
 *   color="#f59e0b"
 *   colorEnd="#ef4444"
 *   height={3}
 *   glow
 * />
 * ```
 */
export const ScifiScrollProgress = forwardRef<HTMLDivElement, ScifiScrollProgressProps>(
  (
    {
      color = '#00e5ff',
      colorEnd,
      height = 2,
      glow = true,
      threshold = 100,
      zIndex = 'z-[49]',
      className,
    },
    _ref,
  ) => {
    const [progress, setProgress] = useState(0)
    const [visible, setVisible] = useState(false)
    const end = colorEnd ?? color

    const springProgress = useSpring(0, {
      stiffness: 300,
      damping: 40,
      mass: 0.5,
    })

    useEffect(() => {
      const handleScroll = () => {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight

        if (scrollTop > threshold) {
          setVisible(true)
          if (docHeight > 0) {
            const newProgress = (scrollTop / docHeight) * 100
            setProgress(newProgress)
            springProgress.set(newProgress)
          }
        } else {
          setVisible(false)
        }
      }

      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    }, [springProgress, threshold])

    return (
      <motion.div
        className={cn('fixed top-0 left-0 right-0 pointer-events-none', zIndex, className)}
        initial={{ opacity: 0 }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        aria-hidden="true"
        data-slot="scifi-scroll-progress"
      >
        <motion.div
          className="h-[2px]"
          style={{
            width: `${progress}%`,
            height: `${height}px`,
            background: `linear-gradient(90deg, ${color}, ${end})`,
            boxShadow: glow
              ? `0 0 8px ${color}, 0 0 16px ${color}80, 0 0 24px ${color}40`
              : undefined,
          }}
          transition={{ duration: 0.1, ease: 'linear' }}
        />
      </motion.div>
    )
  },
)
ScifiScrollProgress.displayName = 'ScifiScrollProgress'
