'use client'

import { Network } from 'lucide-react'
import { FORMULA_TAXONOMY, ROLE_GROUPS, GROUP_ABBREVIATIONS, GROUP_COLORS, FORMULA_AGENT_MAP } from '@/data/dashboard-constants'

export function FormulaAgentMappingGrid() {
  return (
    <div
      data-src="src/components/dashboard/formula-agent-mapping.tsx"
      className="rounded-xl p-4 sm:p-6 overflow-x-auto"
      style={{ background: 'rgba(45, 45, 45, 0.3)', border: '1px solid rgba(51, 51, 51, 0.5)' }}
    >
      <h3 className="text-white font-semibold text-xs mb-4 flex items-center gap-2">
        <Network className="w-3.5 h-3.5 text-gray-400" />
        Formula-to-Agent Mapping
      </h3>
      <div className="min-w-[480px]">
        <div className="grid gap-0" style={{ gridTemplateColumns: '80px repeat(8, 1fr)' }}>
          <div />
          {GROUP_ABBREVIATIONS.map((abbr, i) => (
            <div key={abbr} className="text-center py-1.5">
              <span className="text-[8px] font-bold" style={{ color: GROUP_COLORS[i] }}>{abbr}</span>
            </div>
          ))}
        </div>
        {FORMULA_AGENT_MAP.map((row) => {
          const formulaInfo = FORMULA_TAXONOMY.flatMap(c => c.formulas).find(f => f.name === row.formula)
          const formulaColor = formulaInfo?.color || '#94a3b8'
          return (
            <div
              key={row.formula}
              className="grid gap-0 border-b border-white/[0.03]"
              style={{ gridTemplateColumns: '80px repeat(8, 1fr)' }}
            >
              <div className="flex items-center py-1.5 pr-2">
                <span className="text-[9px] font-bold truncate" style={{ color: formulaColor }}>{row.formula}</span>
              </div>
              {Array.from({ length: 8 }, (_, colIdx) => {
                const isMapped = row.groups.includes(colIdx)
                return (
                  <div key={colIdx} className="flex items-center justify-center py-1.5">
                    {isMapped && (
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: GROUP_COLORS[colIdx], boxShadow: `0 0 6px ${GROUP_COLORS[colIdx]}44` }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {GROUP_ABBREVIATIONS.map((abbr, i) => (
          <div key={abbr} className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: GROUP_COLORS[i] }} />
            <span className="text-[8px] text-slate-500">{abbr} = {ROLE_GROUPS[i].name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
