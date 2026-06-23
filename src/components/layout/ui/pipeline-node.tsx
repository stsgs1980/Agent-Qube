'use client'

import { useLayoutTheme } from '@/lib/layout/theme'
import { radius, spacing, fontSize, fontWeight } from '@/lib/layout/tokens'



// ─── Pipeline Node ────────────────────────────────────────────

interface PipelineNodeProps {
  label: string
  value: string
  color: string
  active: boolean
}

export function PipelineNode({ label, value, color, active }: PipelineNodeProps) {
  const { tokens } = useLayoutTheme()

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: spacing.sm,
      transition: 'all 0.5s',
      opacity: active ? 1 : 0.4,
      transform: active ? 'scale(1)' : 'scale(0.95)',
    }}>
      <div style={{
        padding: `${spacing.sm}px ${spacing.md}px`,
        borderRadius: radius.lg,
        background: active ? `${color}15` : 'transparent',
        border: `1px solid ${active ? `${color}30` : 'transparent'}`,
        transition: 'all 0.5s',
      }}>
        <div style={{
          width: 8, height: 8,
          backgroundColor: active ? color : tokens.textDim,
          borderRadius: '50%',
          margin: '0 auto',
          transition: 'all 0.5s',
        }} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: fontSize.xs, fontWeight: fontWeight.bold, textTransform: 'uppercase', letterSpacing: '0.12em', color: tokens.textMuted, fontFamily: tokens.fontFamilyMono }}>{label}</div>
        <div style={{ fontSize: fontSize.sm, fontWeight: fontWeight.semibold, marginTop: 2, color: active ? color : tokens.textMuted, fontFamily: tokens.fontFamilyMono }}>{value}</div>
      </div>
    </div>
  )
}
