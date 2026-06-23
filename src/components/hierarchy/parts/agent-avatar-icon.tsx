import React from 'react'
import { getAvatarIcon } from './types'

export function AgentAvatarIcon({ avatar, size = 20, color }: { avatar: string; size?: number; color: string }) {
  const IconComponent = getAvatarIcon(avatar)
  return React.createElement(IconComponent, { size, color, strokeWidth: 2 })
}

// ─── Agent Detail Panel (Improved) ───────────────────────────────────────────

