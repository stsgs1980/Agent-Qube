function HealthBar({ bar }: { bar: { label: string; value: number; color: string; width: number } }) {
  return (
    <div key={bar.label}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: '#B0B0B0' }}>{bar.label}</span>
        <span style={{ fontSize: 10, fontWeight: 700, color: bar.color, fontVariantNumeric: 'tabular-nums' }}>{bar.value}%</span>
      </div>
      <div style={{ width: '100%', height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 3, width: `${bar.width}%`,
          background: `linear-gradient(90deg, ${bar.color}66, ${bar.color})`,
          transition: 'width 1s ease-out',
          boxShadow: bar.width > 0 ? `0 0 8px ${bar.color}30` : 'none' }} />
      </div>
    </div>
  )
}

function HealthChip({ chip }: { chip: { label: string; value: string; color: string; pulse?: boolean } }) {
  return (
    <div key={chip.label} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 8px',
      borderRadius: 6, background: 'rgba(13,13,13,0.9)', border: '1px solid rgba(51,51,51,0.3)' }}>
      {chip.pulse && (
        <span style={{ position: 'relative', width: 6, height: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ position: 'absolute', width: 6, height: 6, borderRadius: '50%', background: chip.color, animation: 'pulseGlow 2s ease-in-out infinite' }} />
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: chip.color, position: 'relative', zIndex: 1 }} />
        </span>
      )}
      <span style={{ fontSize: 8, color: '#64748B' }}>{chip.label}</span>
      <span style={{ fontSize: 9, fontWeight: 700, color: chip.color, fontVariantNumeric: 'tabular-nums' }}>{chip.value}</span>
    </div>
  )
}

export { HealthBar, HealthChip }