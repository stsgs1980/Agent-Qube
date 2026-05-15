'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../tokens/cn'
import type { LinearGaugeProps } from './types'

/**
 * GaugeLinear -- horizontal bar gauge with gradient fill and optional shimmer.
 *
 * Renders a horizontal progress bar with a sci-fi gradient and neon glow.
 * Supports zone markers, shimmer animation, and label display.
 *
 * @example
 * ```tsx
 * <GaugeLinear
 *   variant="linear"
 *   value={58}
 *   shimmer
 *   markers={[{ position: 75, color: '#f59e0b', label: 'warn' }]}
 * />
 * ```
 */
export const GaugeLinear = forwardRef<HTMLDivElement, LinearGaugeProps>(
  (
    {
      value,
      color = '#00e5ff',
      duration = 1200,
      showValue = false,
      label,
      sublabel,
      className,
      height = 8,
      showLabel = false,
      shimmer = false,
      markers,
    },
    ref,
  ) => {
    const clamped = Math.max(0, Math.min(100, value))

    return (
      <div
        ref={ref}
        className={cn('flex flex-col gap-1.5 w-full', className)}
        data-slot="gauge-linear"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {/* Label row */}
        {(showLabel || showValue) && (
          <div className="flex items-center justify-between">
            {showLabel && label && (
              <span className="text-xs text-white/50">{label}</span>
            )}
            {showValue && (
              <span
                className="text-xs font-bold tabular-nums ml-auto"
                style={{ color, textShadow: `0 0 4px ${color}60` }}
              >
                {Math.round(clamped)}%
              </span>
            )}
          </div>
        )}

        {/* Bar container */}
        <div
          className="relative w-full rounded-full overflow-hidden"
          style={{
            height,
            backgroundColor: 'rgba(255,255,255,0.05)',
          }}
        >
          {/* Active fill */}
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${color}80, ${color})`,
              boxShadow: `0 0 8px ${color}60, 0 0 16px ${color}30`,
            }}
            initial={{ width: 0 }}
            animate={{ width: `${clamped}%` }}
            transition={{ duration: duration / 1000, ease: 'easeOut' }}
          />

          {/* Shimmer overlay */}
          {shimmer && clamped > 0 && (
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${clamped}%`,
                background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)`,
                backgroundSize: '200% 100%',
              }}
              animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
          )}

          {/* Zone markers */}
          {markers?.map((marker, i) => (
            <div
              key={`marker-${i}`}
              className="absolute top-0 bottom-0 z-10"
              style={{ left: `${marker.position}%` }}
            >
              <div
                className="w-px h-full"
                style={{ backgroundColor: marker.color, opacity: 0.6 }}
              />
              {marker.label && (
                <span
                  className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] whitespace-nowrap"
                  style={{ color: marker.color }}
                >
                  {marker.label}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Sub-label */}
        {sublabel && !showLabel && (
          <span className="text-[10px] text-white/25">{sublabel}</span>
        )}
      </div>
    )
  },
)
GaugeLinear.displayName = 'GaugeLinear'
