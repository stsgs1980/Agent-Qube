'use client'

import { Grid3X3 } from 'lucide-react'
import { GROUP_ABBREVIATIONS, GROUP_COLORS } from '@/data/dashboard-constants'

export function ConnectionHeatmap({ data }: { data?: number[][] }) {
  const heatmapData = data || FALLBACK_DATA

  const maxVal = Math.max(...heatmapData.flat(), 1)

  return (
    <div
      data-src="src/components/dashboard/connection-heatmap.tsx"
      className="rounded-xl p-4 sm:p-6"
      style={{ background: 'rgba(45, 45, 45, 0.3)', border: '1px solid rgba(51, 51, 51, 0.5)' }}
    >
      <h3 className="text-white font-semibold text-xs mb-4 flex items-center gap-2">
        <Grid3X3 className="w-3.5 h-3.5" style={{ color: '#06B6D4' }} />
        Connection Heatmap
      </h3>

      <div className="overflow-x-auto">
        <table
          style={{
            borderCollapse: 'collapse',
            width: '100%',
            minWidth: 420,
            fontSize: 10,
          }}
        >
          {/* Header row */}
          <thead>
            <tr>
              <th style={{ width: 56, padding: '6px 4px' }} />
              {GROUP_ABBREVIATIONS.map((abbr, i) => (
                <th
                  key={abbr}
                  style={{
                    padding: '6px 2px',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: 9,
                    color: GROUP_COLORS[i],
                    letterSpacing: 0.5,
                  }}
                >
                  {abbr}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {heatmapData.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {/* Row label */}
                <td
                  style={{
                    padding: '4px 6px 4px 4px',
                    textAlign: 'right',
                    fontWeight: 700,
                    fontSize: 9,
                    color: GROUP_COLORS[rowIdx],
                    whiteSpace: 'nowrap',
                  }}
                >
                  {GROUP_ABBREVIATIONS[rowIdx]}
                </td>

                {/* Cells */}
                {row.map((count, colIdx) => {
                  const intensity = count > 0 ? Math.max(count / maxVal, 0.15) : 0
                  const isDiagonal = rowIdx === colIdx
                  const cellColor = GROUP_COLORS[colIdx]

                  return (
                    <td
                      key={colIdx}
                      style={{
                        padding: 3,
                        textAlign: 'center',
                      }}
                    >
                      <div
                        title={`${GROUP_ABBREVIATIONS[rowIdx]} → ${GROUP_ABBREVIATIONS[colIdx]}: ${count} connections`}
                        style={{
                          width: '100%',
                          aspectRatio: '1',
                          maxWidth: 36,
                          margin: '0 auto',
                          borderRadius: isDiagonal ? 2 : 4,
                          background: count > 0
                            ? `rgba(${hexToRgb(cellColor)}, ${intensity * 0.7})`
                            : 'rgba(255,255,255,0.02)',
                          border: count > 0
                            ? `1px solid rgba(${hexToRgb(cellColor)}, ${intensity * 0.4})`
                            : '1px solid rgba(255,255,255,0.03)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transform: isDiagonal ? 'rotate(45deg) scale(0.75)' : 'none',
                          transition: 'transform 0.15s, box-shadow 0.15s',
                          cursor: count > 0 ? 'pointer' : 'default',
                        }}
                        onMouseEnter={(e) => {
                          if (count > 0) {
                            e.currentTarget.style.transform = isDiagonal ? 'rotate(45deg) scale(0.85)' : 'scale(1.15)'
                            e.currentTarget.style.boxShadow = `0 0 12px rgba(${hexToRgb(cellColor)}, 0.3)`
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = isDiagonal ? 'rotate(45deg) scale(0.75)' : 'scale(1)'
                          e.currentTarget.style.boxShadow = 'none'
                        }}
                      >
                        {count > 0 && (
                          <span
                            style={{
                              fontSize: 9,
                              fontWeight: 700,
                              color: intensity > 0.4 ? '#fff' : `rgba(${hexToRgb(cellColor)}, 0.9)`,
                              transform: isDiagonal ? 'rotate(-45deg)' : 'none',
                              lineHeight: 1,
                            }}
                          >
                            {count}
                          </span>
                        )}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div
        className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1"
        style={{ fontSize: 9, color: '#64748B' }}
      >
        <span style={{ fontWeight: 600 }}>Density:</span>
        {[
          { label: 'Low', opacity: 0.15 },
          { label: 'Medium', opacity: 0.4 },
          { label: 'High', opacity: 0.7 },
        ].map(({ label, opacity }) => (
          <span key={label} className="flex items-center gap-1.5">
            <span
              style={{
                display: 'inline-block',
                width: 12,
                height: 12,
                borderRadius: 3,
                background: `rgba(6, 182, 212, ${opacity})`,
                border: '1px solid rgba(6, 182, 212, 0.3)',
              }}
            />
            {label}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: 1,
              background: 'rgba(6, 182, 212, 0.5)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              transform: 'rotate(45deg)',
            }}
          />
          Intra-group
        </span>
      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): string {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return r ? `${parseInt(r[1], 16)},${parseInt(r[2], 16)},${parseInt(r[3], 16)}` : '255,255,255'
}

const FALLBACK_DATA: number[][] = [
  [2, 3, 2, 1, 0, 2, 0, 0],
  [0, 2, 1, 5, 0, 0, 0, 0],
  [0, 0, 2, 3, 0, 0, 0, 0],
  [0, 0, 0, 3, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 2, 0, 0],
  [0, 0, 0, 0, 0, 2, 0, 0],
  [0, 1, 0, 2, 1, 0, 2, 0],
  [0, 0, 0, 1, 2, 0, 0, 2],
]