'use client'

import { useState, useEffect } from 'react'
import { BarChart3 } from 'lucide-react'
import { ROLE_GROUPS, TOP_PERFORMERS } from '@/data/dashboard-constants'

const getGroupColor = (groupName: string): string => {
  const group = ROLE_GROUPS.find(g => g.name === groupName)
  return group?.color || '#94a3b8'
}

function PerformerBar({ agent, barColor, width, rank }: { agent: typeof TOP_PERFORMERS[number]; barColor: string; width: number; rank: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 9, fontWeight: 700, color: '#4B5563', width: 14, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{rank}</span>
      <span style={{ fontSize: 10, fontWeight: 600, color: barColor, width: 80, textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 0 }}>{agent.name}</span>
      <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 3, width: `${width}%`, background: `linear-gradient(90deg, ${barColor}33, ${barColor}bb)`, transition: 'width 0.7s ease-out', boxShadow: width > 0 ? `0 0 8px ${barColor}20` : 'none' }} />
      </div>
      <span style={{ fontSize: 10, fontWeight: 800, color: barColor, width: 28, textAlign: 'right', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{width > 0 ? agent.score : ''}</span>
    </div>
  )
}

export function TopPerformersCard({ topPerformers: topPerformersProp, roleGroups: roleGroupsProp }: { topPerformersProp?: typeof TOP_PERFORMERS; roleGroupsProp?: typeof ROLE_GROUPS }) {
  const topPerformers = topPerformersProp || TOP_PERFORMERS
  const roleGroupsData = roleGroupsProp || ROLE_GROUPS
  const [barWidths, setBarWidths] = useState<number[]>(topPerformers.map(() => 0))

  useEffect(() => {
    const makeUpdater = (index: number, score: number) => (prev: number[]) => {
      const next = [...prev];
      next[index] = score;
      return next;
    }
    const timers = topPerformers.map((_, i) => setTimeout(() => setBarWidths(makeUpdater(i, topPerformers[i].score)), 100 + i * 80))
    return () => timers.forEach(clearTimeout)
  }, [topPerformers])

  const getColor = (group: string) => getGroupColor(group)

  return (
    <div data-src="src/components/dashboard/top-performers-card.tsx" style={{ background: 'rgba(20, 20, 20, 0.7)', border: '1px solid rgba(51, 51, 51, 0.4)', borderRadius: 10, padding: '16px 18px', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
        <BarChart3 style={{ width: 13, height: 13, color: '#0891B2' }} />
        <span style={{ fontSize: 9, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#64748B' }}>Top Performers</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {topPerformers.map((agent, i) => (
          <PerformerBar key={agent.name} agent={agent} barColor={getColor(agent.group)} width={barWidths[i]} rank={i + 1} />
        ))}
      </div>
    </div>
  )
}