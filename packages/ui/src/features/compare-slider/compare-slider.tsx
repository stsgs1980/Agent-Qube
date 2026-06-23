'use client'

import { forwardRef, type ReactNode } from 'react'
import { cn } from '../../tokens/cn'
import { useCompareSlider } from './use-compare-slider'

// ─── Types ────────────────────────────────────────────────────

export interface CompareSliderProps {
  /** Content for the "before" (left/top) side */
  before: ReactNode
  /** Content for the "after" (right/bottom) side */
  after: ReactNode
  /** Initial position 0-100 (default 50) */
  defaultPosition?: number
  /** Slider orientation (default 'horizontal') */
  orientation?: 'horizontal' | 'vertical'
  /** Label for the before side (e.g. "Before") */
  beforeLabel?: string
  /** Label for the after side (e.g. "After") */
  afterLabel?: string
  /** Accessible label for the slider handle (default "Comparison slider") */
  handleLabel?: string
  /** Additional class name for the root container */
  className?: string
  /** Additional class name for each content panel */
  panelClassName?: string
}

// ─── Component ────────────────────────────────────────────────

/**
 * CompareSlider -- before/after comparison with draggable divider.
 * Pointer events for mouse + touch, CSS clip-path, zero deps.
 *
 * @example
 * ```tsx
 * <CompareSlider
 *   before={<img src="/before.webp" alt="Before" className="object-cover" />}
 *   after={<img src="/after.webp" alt="After" className="object-cover" />}
 *   beforeLabel="Original"
 *   afterLabel="Processed"
 *   defaultPosition={40}
 * />
 * ```
 */
export const CompareSlider = forwardRef<HTMLDivElement, CompareSliderProps>(
  ({
    before, after, defaultPosition = 50, orientation = 'horizontal',
    beforeLabel, afterLabel, handleLabel = 'Comparison slider',
    className, panelClassName,
  }, ref) => {
    const { position, dragging, setPosition, containerRef, onPointerDown } = useCompareSlider({
      defaultPosition, orientation,
    })
    const isH = orientation === 'horizontal'

    return (
      <div
        ref={(el) => {
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = el
          if (typeof ref === 'function') ref(el)
          else if (ref) ref.current = el
        }}
        className={cn(
          'relative select-none overflow-hidden rounded-lg border border-border',
          className,
        )}
        role="slider"
        aria-label={handleLabel}
        aria-valuenow={Math.round(position)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-orientation={orientation}
        tabIndex={0}
        onKeyDown={(e) => {
          const step = e.shiftKey ? 10 : 1
          if (isH) {
            if (e.key === 'ArrowLeft') setPosition(p => Math.max(0, p - step))
            if (e.key === 'ArrowRight') setPosition(p => Math.min(100, p + step))
          } else {
            if (e.key === 'ArrowUp') setPosition(p => Math.max(0, p - step))
            if (e.key === 'ArrowDown') setPosition(p => Math.min(100, p + step))
          }
        }}
      >
        {/* After layer (full, behind) */}
        <div className={cn('absolute inset-0', panelClassName)}>{after}</div>

        {/* Before layer (clipped) */}
        <div
          className={cn('absolute inset-0 overflow-hidden', panelClassName)}
          style={isH
            ? { clipPath: `inset(0 ${100 - position}% 0 0)` }
            : { clipPath: `inset(0 0 ${100 - position}% 0)` }
          }
        >
          {before}
        </div>

        {/* Divider + handle */}
        <div
          className={cn(
            'absolute z-10 bg-background',
            isH
              ? 'top-0 bottom-0 w-0.5 cursor-col-resize'
              : 'left-0 right-0 h-0.5 cursor-row-resize',
            dragging && 'bg-accent',
          )}
          style={isH ? { left: `${position}%` } : { top: `${position}%` }}
          onPointerDown={onPointerDown}
        >
          <div className={cn(
            'absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2',
            'rounded-full border-2 border-background bg-foreground shadow-md',
            'flex items-center justify-center',
            dragging && 'scale-110 bg-accent',
          )}>
            {isH ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-background">
                <path d="M4 8h8M7 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-background">
                <path d="M8 4v8M5 7l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </div>

        {/* Labels */}
        {beforeLabel && (
          <span className="absolute left-3 top-3 z-20 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {beforeLabel}
          </span>
        )}
        {afterLabel && (
          <span className={cn(
            'absolute z-20 rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm',
            isH ? 'right-3 top-3' : 'left-3 bottom-3',
          )}>
            {afterLabel}
          </span>
        )}
      </div>
    )
  }
)
CompareSlider.displayName = 'CompareSlider'
