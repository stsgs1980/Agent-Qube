'use client'

import { useState, forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../tokens/cn'

export interface ResponsiveShowcaseProps extends HTMLAttributes<HTMLDivElement> {
  /** Content to preview in device frame */
  children: ReactNode
  /** Available viewport presets */
  viewports?: Array<{ key: string; label: string; width: string }>
  /** Default viewport key */
  defaultViewport?: string
  /** Show breakpoint visualizer */
  showBreakpoints?: boolean
}

const DEFAULT_VIEWPORTS = [
  { key: 'mobile', label: 'Mobile', width: '375px' },
  { key: 'tablet', label: 'Tablet', width: '768px' },
  { key: 'desktop', label: 'Desktop', width: '100%' },
]

/**
 * ResponsiveShowcase — Device-frame preview with viewport switcher.
 * Layer 4: Has own state (selected viewport).
 */
export const ResponsiveShowcase = forwardRef<HTMLDivElement, ResponsiveShowcaseProps>(
  ({ children, viewports = DEFAULT_VIEWPORTS, defaultViewport = 'desktop', showBreakpoints = false, className, ...props }, ref) => {
    const [viewport, setViewport] = useState(defaultViewport)
    const selected = viewports.find(v => v.key === viewport) ?? viewports[viewports.length - 1]

    return (
      <div ref={ref} className={cn('flex flex-col overflow-hidden rounded-lg border border-border', className)} {...props}>
        {/* Viewport Switcher */}
        <div className="flex items-center gap-1 border-b border-border bg-muted/30 px-4 py-2">
          {viewports.map(v => (
            <button key={v.key} onClick={() => setViewport(v.key)}
              className={cn(
                'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                viewport === v.key ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:text-foreground',
              )}>
              {v.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-muted-foreground">{selected.width}</span>
        </div>

        {/* Canvas */}
        <div className="flex justify-center overflow-auto bg-muted/10 p-6">
          <div
            className="overflow-hidden rounded-lg border border-border bg-background shadow-lg transition-[width] duration-500"
            style={{ width: selected.width, maxWidth: '100%' }}
          >
            {children}
          </div>
        </div>

        {/* Breakpoint Info */}
        {showBreakpoints && (
          <div className="border-t border-border px-4 py-2">
            <span className="text-xs text-muted-foreground">
              Breakpoint: <strong className="text-foreground">{selected.key}</strong> · Width: <strong className="text-foreground">{selected.width}</strong>
            </span>
          </div>
        )}
      </div>
    )
  }
)
ResponsiveShowcase.displayName = 'ResponsiveShowcase'
