import { Activity, Cpu, HardDrive, Wifi, TrendingDown } from 'lucide-react'

function MetricBar({ label, value, color, width, Icon }: {
  label: string; value: number; color: string; width: number; Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
}) {
  return (
    <div key={label} className="rounded-lg p-3 transition-colors duration-200 hover:bg-white/[0.02]" style={{ background: 'rgba(13, 13, 13, 0.8)' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Icon size={12} style={{ color }} />
          <span className="text-slate-400 text-[10px]">{label}</span>
        </div>
        <span className="font-bold text-xs" style={{ color }}>{value}%</span>
      </div>
      <div className="w-full h-1.5 rounded-full relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className="h-full rounded-full transition-all duration-1000 ease-out relative"
          style={{ width: `${width}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}>
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              backgroundSize: '200% 100%', animation: 'shimmer 2s ease infinite' }} />
        </div>
      </div>
    </div>
  )
}

function StatusChips() {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-white/[0.03]"
        style={{ background: 'rgba(13, 13, 13, 0.8)' }}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
        </span>
        <span className="text-slate-400 text-[10px]">Agent Uptime</span>
        <span className="text-cyan-400 font-bold text-xs" style={{ textShadow: '0 0 8px rgba(6, 182, 212, 0.4)', animation: 'pulseGlow 2s ease-in-out infinite' }}>99.7%</span>
      </div>
      <div className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-white/[0.03]"
        style={{ background: 'rgba(13, 13, 13, 0.8)' }}>
        <Activity className="w-3 h-3" style={{ color: '#06B6D4' }} />
        <span className="text-slate-400 text-[10px]">Active Connections</span>
        <span className="font-bold text-xs" style={{ color: '#06B6D4' }}>55</span>
        <svg width="32" height="12" className="ml-1">
          <polyline points="0,8 4,6 8,9 12,4 16,7 20,3 24,5 28,2 32,6" fill="none" stroke="#06B6D4" strokeWidth="1" opacity="0.6" />
        </svg>
      </div>
      <div className="flex items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-white/[0.03]"
        style={{ background: 'rgba(13, 13, 13, 0.8)' }}>
        <TrendingDown className="w-3 h-3 text-cyan-400" />
        <span className="text-slate-400 text-[10px]">Error Rate</span>
        <span className="text-cyan-400 font-bold text-xs">0.3%</span>
        <TrendingDown className="w-2.5 h-2.5 text-cyan-400" />
      </div>
    </div>
  )
}

export { MetricBar, StatusChips }