'use client'

import { forwardRef, useEffect, useRef, useState, useCallback } from 'react'
import { cn } from '../../tokens/cn'

// ─── Types ────────────────────────────────────────────────────

export interface TypingEffectProps {
  /** Full text to type out character by character */
  text: string
  /** Milliseconds per character (default 40) */
  speed?: number
  /** Delay before typing starts in ms (default 0) */
  startDelay?: number
  /** Cursor blink color (default "#00e5ff") */
  cursorColor?: string
  /** Whether to show the blinking cursor (default true) */
  showCursor?: boolean
  /** Cursor width in CSS units (default "2px") */
  cursorWidth?: string
  /** Callback fired when typing animation completes */
  onComplete?: () => void
  /** Additional CSS classes */
  className?: string
}

// ─── TypingEffect Component ───────────────────────────────────

/**
 * TypingEffect -- character-by-character typing animation with blinking cursor.
 *
 * Simulates a terminal-style typing effect with randomized slight delays
 * between keystrokes for realism. The cursor blinks once typing completes.
 * Fires an optional onComplete callback.
 *
 * @example
 * ```tsx
 * <TypingEffect
 *   text="Initializing secure connection..."
 *   cursorColor="#f59e0b"
 *   speed={30}
 *   onComplete={() => console.log('done')}
 * />
 * ```
 */
export const TypingEffect = forwardRef<HTMLSpanElement, TypingEffectProps>(
  (
    {
      text,
      speed = 40,
      startDelay = 0,
      cursorColor = '#00e5ff',
      showCursor = true,
      cursorWidth = '2px',
      onComplete,
      className,
    },
    forwardedRef,
  ) => {
    const [started, setStarted] = useState(false)
    const [charIndex, setCharIndex] = useState(0)
    const isComplete = started && charIndex >= text.length
    const typeChainRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Fire onComplete when animation finishes
    useEffect(() => {
      if (isComplete && onComplete) onComplete()
    }, [isComplete, onComplete])

    // Start typing after delay
    useEffect(() => {
      const t = setTimeout(() => setStarted(true), startDelay)
      return () => clearTimeout(t)
    }, [startDelay])

    const clearTypeChain = useCallback(() => {
      if (typeChainRef.current) {
        clearTimeout(typeChainRef.current)
        typeChainRef.current = null
      }
    }, [])

    // Typing effect
    useEffect(() => {
      clearTypeChain()
      if (!started) return

      let idx = charIndex
      if (idx === 0) {
        const type = () => {
          if (idx < text.length) {
            idx += 1
            setCharIndex(idx)
            typeChainRef.current = setTimeout(type, speed + Math.random() * 20)
          }
        }
        typeChainRef.current = setTimeout(type, 0)
      }
    }, [started, clearTypeChain, charIndex, text.length, speed])

    // Cleanup
    useEffect(() => clearTypeChain, [clearTypeChain])

    return (
      <span
        ref={forwardedRef}
        className={cn('inline-block', className)}
        data-slot="typing-effect"
      >
        {started ? text.slice(0, charIndex) : ''}
        {showCursor && started && (
          <span
            className="inline-block ml-0.5 align-middle"
            style={{
              width: cursorWidth,
              height: '1em',
              backgroundColor: cursorColor,
              boxShadow: `0 0 4px ${cursorColor}`,
              animation: isComplete ? 'blinkCursor 1s step-end infinite' : 'none',
            }}
          />
        )}
        {/* Inject blink keyframe once */}
        <style>{`
          @keyframes blinkCursor {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>
      </span>
    )
  },
)
TypingEffect.displayName = 'TypingEffect'
