import { GROUP_ABBREVIATIONS, GROUP_COLORS } from '@/data/dashboard-constants'

function hexToRgb(hex: string): string {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return r ? `${parseInt(r[1], 16)},${parseInt(r[2], 16)},${parseInt(r[3], 16)}` : '255,255,255'
}

export function HeatmapCell({ count, rowIdx, colIdx, maxVal }: {
  count: number; rowIdx: number; colIdx: number; maxVal: number
}) {
  const intensity = count > 0 ? Math.max(count / maxVal, 0.15) : 0
  const isDiagonal = rowIdx === colIdx
  const cellColor = GROUP_COLORS[colIdx]
  const rgb = hexToRgb(cellColor)

  return (
    <td style={{ padding: 2, textAlign: 'center' }}>
      <div title={`${GROUP_ABBREVIATIONS[rowIdx]} → ${GROUP_ABBREVIATIONS[colIdx]}: ${count} connections`}
        style={{ width: '100%', aspectRatio: '1', maxWidth: 34, margin: '0 auto', borderRadius: isDiagonal ? 2 : 4,
          background: count > 0 ? `rgba(${rgb}, ${intensity * 0.7})` : 'rgba(255,255,255,0.02)',
          border: count > 0 ? `1px solid rgba(${rgb}, ${intensity * 0.35})` : '1px solid rgba(255,255,255,0.03)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: isDiagonal ? 'rotate(45deg) scale(0.72)' : 'none',
          transition: 'transform 0.15s, box-shadow 0.15s', cursor: count > 0 ? 'pointer' : 'default' }}
        onMouseEnter={(e) => { if (count > 0) { e.currentTarget.style.transform = isDiagonal ? 'rotate(45deg) scale(0.82)' : 'scale(1.15)'; e.currentTarget.style.boxShadow = `0 0 12px rgba(${rgb}, 0.3)` } }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = isDiagonal ? 'rotate(45deg) scale(0.72)' : 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}>
        {count > 0 && (
          <span style={{ fontSize: 9, fontWeight: 700,
            color: intensity > 0.4 ? '#fff' : `rgba(${rgb}, 0.9)`,
            transform: isDiagonal ? 'rotate(-45deg)' : 'none', lineHeight: 1 }}>{count}</span>
        )}
      </div>
    </td>
  )
}

export function HeatmapLegend() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12, marginTop: 14,
      paddingTop: 12, borderTop: '1px solid rgba(51,51,51,0.3)', fontSize: 9, color: '#64748B' }}>
      <span style={{ fontWeight: 600 }}>Density:</span>
      {([{ label: 'Low', opacity: 0.15 }, { label: 'Medium', opacity: 0.4 }, { label: 'High', opacity: 0.7 }] as const).map(({ label, opacity }) => (
        <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2,
            background: `rgba(6, 182, 212, ${opacity})`, border: '1px solid rgba(6, 182, 212, 0.3)' }} />
          {label}
        </span>
      ))}
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 1,
          background: 'rgba(6, 182, 212, 0.5)', border: '1px solid rgba(6, 182, 212, 0.3)', transform: 'rotate(45deg)' }} />
        Intra-group
      </span>
    </div>
  )
}