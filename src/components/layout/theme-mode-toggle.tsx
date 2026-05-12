'use client'

import { Sun, Moon } from 'lucide-react'
import { useProjectTheme } from '@/lib/layout/project-theme'
import { useLayoutTheme } from '@/lib/layout/theme'

// ─── Dark/Light Toggle ─────────────────────────────────────────
// Controls the PROJECT theme (what the user is designing).
// Styled by Studio theme.

export function ThemeModeToggle() {
  const { mode, toggle } = useProjectTheme()
  const { tokens: studioTokens } = useLayoutTheme()

  return (
    <button onClick={toggle}
      aria-label={mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      style={{
        width: 36, height: 36, borderRadius: studioTokens.cornerRadius,
        border: `1px solid ${studioTokens.borderDefault}`,
        background: studioTokens.bgSurface, color: studioTokens.textMuted,
        cursor: 'pointer', transition: 'all 0.2s',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}
      title={mode === 'dark' ? 'Switch to light' : 'Switch to dark'}>
      <div style={{
        transition: 'transform 0.3s, opacity 0.3s',
        transform: mode === 'dark' ? 'rotate(0deg)' : 'rotate(180deg)',
        opacity: mode === 'dark' ? 1 : 0, position: 'absolute',
      }}>
        <Moon style={{ width: 16, height: 16 }} />
      </div>
      <div style={{
        transition: 'transform 0.3s, opacity 0.3s',
        transform: mode === 'light' ? 'rotate(0deg)' : 'rotate(-180deg)',
        opacity: mode === 'light' ? 1 : 0, position: 'absolute',
      }}>
        <Sun style={{ width: 16, height: 16 }} />
      </div>
    </button>
  )
}
