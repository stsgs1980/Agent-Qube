'use client'

import { useState, useEffect } from 'react'

export function useCommandPalette() {
  const [showPalette, setShowPalette] = useState(false)

  const openPalette = () => setShowPalette(true)
  const closePalette = () => setShowPalette(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowPalette(true)
      }
      if (e.key === 'Escape') {
        setShowPalette(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return { showPalette, openPalette, closePalette }
}
