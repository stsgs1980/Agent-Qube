'use client'

import { forwardRef, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '../../tokens/cn'

// ─── Types ────────────────────────────────────────────────────

export interface ScifiSectionHeaderProps {
  /** Small uppercase label above the title (accent colored) */
  label: string
  /** Main heading text */
  title: string
  /** Description line below the title */
  subtitle?: string
  /** Text alignment (default "center") */
  align?: 'left' | 'center'
  /** Accent color for the label line and decorative elements (default "#00e5ff") */
  accentColor?: string
  /** Title font family override (default "var(--font-heading, inherit)") */
  titleFont?: string
  /** Subtitle color (default "#7070a0") */
  subtitleColor?: string
  /** Additional CSS classes */
  className?: string
}

// ─── ScifiSectionHeader Component ─────────────────────────────

/**
 * ScifiSectionHeader -- animated section header with accent line and label.
 *
 * A sci-fi styled section heading featuring an animated label with
 * glowing accent lines on each side, a bold title, and an optional
 * subtitle. All colors and alignment are configurable via props.
 *
 * @example
 * ```tsx
 * <ScifiSectionHeader
 *   label="analytics"
 *   title="Market Overview"
 *   subtitle="Real-time data from 12 global exchanges"
 *   accentColor="#f59e0b"
 *   align="left"
 * />
 * ```
 */
export const ScifiSectionHeader = forwardRef<HTMLDivElement, ScifiSectionHeaderProps>(
  (
    {
      label,
      title,
      subtitle,
      align = 'center',
      accentColor = '#00e5ff',
      titleFont = 'var(--font-heading, inherit)',
      subtitleColor = '#7070a0',
      className,
    },
    forwardedRef,
  ) => {
    const internalRef = useRef<HTMLDivElement>(null)
    const ref = forwardedRef ?? internalRef
    const isInView = useInView(ref as React.RefObject<HTMLDivElement>, { once: true, margin: '-80px' })

    const isCenter = align === 'center'

    return (
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className={cn('mb-8 sm:mb-12', isCenter ? 'text-center' : 'text-left', className)}
        data-slot="scifi-section-header"
      >
        {/* Label row with accent lines */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className={cn('inline-flex items-center gap-2 mb-4', !isCenter && 'justify-start')}
        >
          <div
            className="w-8 h-[1px]"
            style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
          />
          <span
            className="font-mono text-xs sm:text-sm uppercase tracking-widest font-medium"
            style={{ color: accentColor }}
          >
            {label}
          </span>
          <div
            className="w-8 h-[1px]"
            style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
          />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-3"
          style={{ fontFamily: titleFont }}
        >
          {title}
        </motion.h2>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={cn(
              'font-mono text-sm sm:text-base max-w-2xl leading-relaxed',
              isCenter && 'mx-auto',
            )}
            style={{ color: subtitleColor }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    )
  },
)
ScifiSectionHeader.displayName = 'ScifiSectionHeader'
