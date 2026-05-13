'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Drives a 0→1 animation progress value via requestAnimationFrame.
 *
 * @example
 * ```tsx
 * const { progress } = useAnimateProgress(2000)
 * ```
 *
 * @param duration - Animation duration in ms
 * @returns Current progress value (0-1)
 */
export function useAnimateProgress(duration: number) {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      setProgress(t)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [duration])

  return { progress }
}
