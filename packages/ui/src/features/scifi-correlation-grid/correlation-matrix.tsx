'use client'

import { forwardRef, useState } from 'react'
import { cn } from '../../tokens/cn'
import { hexToChannels } from '../../tokens/color-utils'
import type { MatrixAsset } from './types'

// ─── Types ─────────────────────────────────────────────────

export interface CorrelationMatrixProps {
  /** Ordered row/column headers */
  assets: MatrixAsset[]
  /** Square NxN correlation values in [-1, 1] */
  matrix: number[][]
  /** Color for positive correlation. Default: '#22c55e' */
  positiveColor?: string
  /** Color for negative correlation. Default: '#ff2244' */
  negativeColor?: string
  /** Color for zero / neutral cells. Default: 'rgba(255,255,255,0.03)' */
  neutralColor?: string
  /** Show value text in cells. Default: true */
  showValues?: boolean
  /** Cell size in px. Default: 56 */
  cellSize?: number
  /** Additional CSS classes */
  className?: string
}

// ─── Helpers ───────────────────────────────────────────────

function cellBg(v: number, pos: string, neg: string, neu: string) {
  const abs = Math.abs(v)
  if (v > 0) { const c = hexToChannels(pos); return `rgba(${c.r},${c.g},${c.b},${(0.15 + abs * 0.65).toFixed(2)})` }
  if (v < 0) { const c = hexToChannels(neg); return `rgba(${c.r},${c.g},${c.b},${(0.15 + abs * 0.65).toFixed(2)})` }
  return neu
}

const LABEL_CLR = 'rgba(160,160,192,0.7)'

// ─── Component ─────────────────────────────────────────────

/**
 * CorrelationMatrix — interactive NxN correlation grid with hover highlighting.
 *
 * @example
 * ```tsx
 * <CorrelationMatrix assets={[{ label: 'A' }, { label: 'B' }]} matrix={[[1, 0.5], [0.5, 1]]} />
 * ```
 */
export const CorrelationMatrix = forwardRef<HTMLDivElement, CorrelationMatrixProps>(
  ({ assets, matrix, positiveColor = '#22c55e', negativeColor = '#ff2244',
     neutralColor = 'rgba(255,255,255,0.03)', showValues = true, cellSize = 56, className }, ref) => {
    const [hovered, setHovered] = useState<{ row: number; col: number } | null>(null)
    const [tip, setTip] = useState<{ text: string; x: number; y: number } | null>(null)

    const n = assets.length
    const cols = `grid-cols-[repeat(${n},minmax(0,1fr))]`
    const isHl = (r: number, c: number) => !hovered || hovered.row === r || hovered.col === c

    return (
      <div ref={ref} data-slot="correlation-matrix" className={cn('inline-block min-w-0', className)}>
        {/* Header */}
        <div className={cn('grid gap-0', cols)} style={{ paddingLeft: 72 }}>
          {assets.map((a, i) => (
            <div key={i} className="text-[9px] font-mono text-center truncate px-1"
              style={{ color: LABEL_CLR, height: 20 }}>
              {a.shortLabel ?? a.label}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="relative">
          {matrix.map((row, ri) => (
            <div key={ri} className={cn('grid gap-0', cols)}>
              <div className="absolute left-0 top-0 w-[68px] flex items-center justify-end pr-2 truncate"
                style={{ height: cellSize, fontSize: 10, fontFamily: 'monospace', color: LABEL_CLR }}>
                {assets[ri].label}
              </div>

              {row.map((val, ci) => {
                const diag = ri === ci
                const hl = isHl(ri, ci)
                return (
                  <div key={ci}
                    onMouseEnter={(e) => {
                      setHovered({ row: ri, col: ci })
                      const la = assets[ri].shortLabel ?? assets[ri].label
                      const lb = assets[ci].shortLabel ?? assets[ci].label
                      setTip({ text: `${la} / ${lb}: ${val >= 0 ? '+' : ''}${val.toFixed(2)}`, x: e.clientX, y: e.clientY })
                    }}
                    onMouseMove={(e) => setTip(p => p ? { ...p, x: e.clientX, y: e.clientY } : null)}
                    onMouseLeave={() => { setHovered(null); setTip(null) }}
                    className={cn('flex items-center justify-center cursor-default transition-all duration-200',
                      hl && !diag && 'ring-1 ring-white/30 z-10', diag && 'ring-1 ring-white/10')}
                    style={{ width: cellSize, height: cellSize,
                      backgroundColor: cellBg(val, positiveColor, negativeColor, neutralColor),
                      border: '1px solid rgba(255,255,255,0.04)', opacity: hovered && !hl ? 0.3 : 1 }}>
                    {showValues && (
                      <span className="font-mono" style={{ fontSize: cellSize < 40 ? 9 : 11, fontWeight: 700,
                        color: diag ? 'rgba(255,255,255,0.5)' : '#fff' }}>
                        {val.toFixed(2)}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          ))}

          {tip && (
            <div className="fixed z-50 px-3 py-2 rounded-sm text-[11px] font-mono max-w-[260px] leading-relaxed pointer-events-none"
              style={{ left: tip.x + 12, top: tip.y - 8, backgroundColor: 'rgba(10,10,30,0.95)',
                border: '1px solid rgba(0,229,255,0.4)', color: '#c0c0e0',
                boxShadow: '0 0 20px rgba(0,229,255,0.15)' }}>
              {tip.text}
            </div>
          )}
        </div>
      </div>
    )
  },
)
CorrelationMatrix.displayName = 'CorrelationMatrix'
