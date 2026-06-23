export function StatsDashboard({ stats }: { stats: { total: number; active: number; idle: number; error: number; offline: number; tasks: number } }) {
  return (
    <div
      className="rounded-xl p-3 relative overflow-hidden"
      style={{
        background: 'rgba(26, 26, 26, 0.92)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(51,51,51,0.5)',
        width: 180,
      }}
    >
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(6,182,212,0.04), rgba(6,182,212,0.04), rgba(6,182,212,0.04))',
          backgroundSize: '200% 200%',
          animation: 'gradientShift 8s ease infinite',
        }}
      />
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(26,26,26,0.92), rgba(26,26,26,0.92)), linear-gradient(135deg, rgba(6,182,212,0.25), transparent, rgba(6,182,212,0.25))',
          backgroundOrigin: 'border-box',
          backgroundClip: 'padding-box, border-box',
          border: '1px solid transparent',
          borderRadius: '12px',
        }}
      />
      <h4 className="text-[#B0B0B0] text-[10px] uppercase tracking-wider font-semibold mb-2">Stats</h4>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <span className="text-white font-bold text-lg">{stats.total}</span>
          <p className="text-[9px] text-[#B0B0B0]">Total</p>
        </div>
        <div>
          <span className="text-cyan-400 font-bold text-lg">{stats.active}</span>
          <p className="text-[9px] text-[#B0B0B0]">Active</p>
        </div>
        <div>
          <span className="text-gray-400 font-bold text-lg">{stats.idle}</span>
          <p className="text-[9px] text-[#B0B0B0]">Idle</p>
        </div>
        <div>
          <span className="text-[#B0B0B0] font-bold text-lg">{stats.tasks}</span>
          <p className="text-[9px] text-[#B0B0B0]">Tasks</p>
        </div>
      </div>
    </div>
  )
}

// ─── Mini-Map (Improved) ─────────────────────────────────────────────────────

