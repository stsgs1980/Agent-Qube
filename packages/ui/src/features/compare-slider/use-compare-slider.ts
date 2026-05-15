'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

// ─── Types ────────────────────────────────────────────────────

export interface UseCompareSliderOptions {
  /** Initial position 0-100 (default 50) */
  defaultPosition?: number
  /** Slider orientation */
  orientation?: 'horizontal' | 'vertical'
}

export interface UseCompareSliderReturn {
  /** Current position 0-100 */
  position: number
  /** Whether the user is currently dragging */
  dragging: boolean
  /** Set position programmatically */
  setPosition: React.Dispatch<React.SetStateAction<number>>
  /** Ref to attach to the container element */
  containerRef: React.RefObject<HTMLDivElement | null>
  /** Pointer down handler for the divider */
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void
}

// ─── Hook ─────────────────────────────────────────────────────

/**
 * useCompareSlider -- drag logic for a before/after comparison slider.
 *
 * Tracks pointer position relative to a container ref, clamps to 0-100%.
 * Uses pointer events for unified mouse + touch support.
 * Binds move/up to `window` so dragging continues outside the container.
 *
 * @example
 * ```tsx
 * const { position, dragging, containerRef, onPointerDown } =
 *   useCompareSlider({ defaultPosition: 40, orientation: 'horizontal' })
 * ```
 */
export function useCompareSlider({
  defaultPosition = 50,
  orientation = 'horizontal',
}: UseCompareSliderOptions = {}): UseCompareSliderReturn {
  const [position, setPosition] = useState(defaultPosition)
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const posRef = useRef(position)
  posRef.current = position

  /** Calculate 0-100 position from a pointer event */
  const calcPosition = useCallback((clientX: number, clientY: number) => {
    const el = containerRef.current
    if (!el) return defaultPosition
    const rect = el.getBoundingClientRect()
    if (orientation === 'horizontal') {
      return Math.min(100, Math.max(0, (clientX - rect.left) / rect.width * 100))
    }
    return Math.min(100, Math.max(0, (clientY - rect.top) / rect.height * 100))
  }, [defaultPosition, orientation])

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault()
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    setDragging(true)
    setPosition(calcPosition(e.clientX, e.clientY))
  }, [calcPosition])

  // Bind move/up to window for outside-container dragging
  useEffect(() => {
    if (!dragging) return
    const onMove = (e: PointerEvent) => {
      setPosition(calcPosition(e.clientX, e.clientY))
    }
    const onUp = () => setDragging(false)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [dragging, calcPosition])

  return { position, dragging, setPosition, containerRef, onPointerDown }
}
