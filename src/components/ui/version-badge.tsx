'use client'

import { APP_NAME, VERSION_BADGE, BUILD_TIME } from '@/lib/version'

/**
 * Version badge — tiny pill shown in footer / about dialogs.
 * Reads from @/lib/version (single source of truth).
 */
export function VersionBadge({ showBuildTime = false }: { showBuildTime?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '1px 6px',
        borderRadius: '9999px',
        background: 'rgba(6,182,212,0.08)',
        border: '1px solid rgba(6,182,212,0.2)',
        fontSize: 9,
        fontWeight: 600,
        color: '#06B6D4',
        letterSpacing: '0.3px',
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
      title={`${APP_NAME} ${VERSION_BADGE}${showBuildTime ? ` · ${BUILD_TIME}` : ''}`}
    >
      {VERSION_BADGE}
    </span>
  )
}