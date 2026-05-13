'use client'

import { Grid3X3 } from 'lucide-react'
import { GROUP_ABBREVIATIONS, GROUP_COLORS, CONNECTION_HEATMAP_DATA } from '@/data/dashboard-constants'

export function ConnectionHeatmap({ data }: { data?: number[][] }) {
  const heatmapData = data || CONNECTION_HEATMAP_DATA

  const getDotSize = (count: number): number => {
    if (count === 0) return 0
    if (count <= 2) return 6
    if (count <= 5) return 10
    return 14
  }

  const getDotOpacity = (count: number): number => {
    if (count === 0) return 0
    if (count <= 2) return 0.5
    if (count <= 5) return 0.7
    return 0.9
  }

  return (
    <div
      className="rounded-xl p-4 sm:p-6 overflow-x-auto"
      style={{ background: 'rgba(45, 45, 45, 0.3)', border: '1px solid rgba(51, 51, 51, 0.5)' }}
    >
      <h3 className="text-white font-semibold text-xs mb-4 flex items-center gap-2">
        <Grid3X3 className="w-3.5 h-3.5" style={{ color: '#06B6D4' }} />
        Connection Heatmap
      </h3>
      <div className="min-w-[520px]">
        <div className="grid gap-0" style={{ gridTemplateColumns: '64px repeat(8, 1fr)' }}>
          <div />
          {GROUP_ABBREVIATIONS.map((abbr, i) => (
            <div key={abbr} className="text-center py-2">
              <span className="text-[8px] font-bold" style={{ color: GROUP_COLORS[i] }}>{abbr}</span>
            </div>
          ))}
        </div>
        {heatmapData.map((row, rowIdx) => (
          <div key={rowIdx} className="grid gap-0 border-b border-white/[0.03]" style={{ gridTemplateColumns: '64px repeat(8, 1fr)' }}>
            <div className="flex items-center pr-2 py-2">
              <span className="text-[8px] font-bold truncate" style={{ color: GROUP_COLORS[rowIdx] }}>{GROUP_ABBREVIATIONS[rowIdx]}</span>
            </div>
            {row.map((count, colIdx) => {
              const isDiagonal = rowIdx === colIdx
              const dotSize = getDotSize(count)
              const dotOpacity = getDotOpacity(count)
              const cellColor = GROUP_COLORS[colIdx]
              return (
                <div key={colIdx} className="flex items-center justify-center py-2">
                  {count > 0 && (
                    <div className="relative flex items-center justify-center">
                      {isDiagonal ? (
                        <svg width={dotSize + 4} height={dotSize + 4} viewBox={`0 0 ${dotSize + 4} ${dotSize + 4}`}>
                          <rect
                            x={(dotSize + 4) / 2 - dotSize / 2}
                            y={(dotSize + 4) / 2 - dotSize / 2}
                            width={dotSize} height={dotSize} rx={1}
                            fill={cellColor} fillOpacity={dotOpacity}
                            stroke={cellColor} strokeWidth={0.5} strokeOpacity={0.6}
                            transform={`rotate(45 ${(dotSize + 4) / 2} ${(dotSize + 4) / 2})`}
                          />
                        </svg>
                      ) : (
                        <span className="rounded-full" style={{ width: dotSize, height: dotSize, background: cellColor, opacity: dotOpacity, boxShadow: `0 0 ${dotSize}px ${cellColor}44` }} />
                      )}
                      {count > 2 && (
                        <span className="absolute text-[6px] font-bold" style={{ color: '#FFFFFF' }}>{count}</span>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[8px] text-slate-500">Connection density:</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full" style={{ width: 6, height: 6, background: '#06B6D4', opacity: 0.5 }} />
          <span className="text-[8px] text-slate-500">1-2</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full" style={{ width: 10, height: 10, background: '#06B6D4', opacity: 0.7 }} />
          <span className="text-[8px] text-slate-500">3-5</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full" style={{ width: 14, height: 14, background: '#06B6D4', opacity: 0.9 }} />
          <span className="text-[8px] text-slate-500">6+</span>
        </div>
        <div className="flex items-center gap-1.5 ml-2">
          <svg width="10" height="10" viewBox="0 0 10 10">
            <rect x="2" y="2" width="6" height="6" rx="1" fill="#06B6D4" fillOpacity="0.7" stroke="#06B6D4" strokeWidth="0.5" strokeOpacity="0.6" transform="rotate(45 5 5)" />
          </svg>
          <span className="text-[8px] text-slate-500">Internal sync</span>
        </div>
      </div>
    </div>
  )
}
