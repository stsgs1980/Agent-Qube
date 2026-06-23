'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../tokens/cn'
import { tokens } from '../../tokens/tokens'
import type { ContainerSize } from '../../tokens/types'

// ─── Types ────────────────────────────────────────────────────

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Max width from layout tokens (default: 'xl') */
  size?: ContainerSize
  /** Add horizontal padding (default: true) */
  padded?: boolean
  /** Center with auto margins (default: true) */
  centered?: boolean
}

// ─── Helpers ──────────────────────────────────────────────────

const maxWidthMap: Record<ContainerSize, string> = {
  sm: 'max-w-screen-sm',     // 640px
  md: 'max-w-screen-md',     // 768px
  lg: 'max-w-screen-lg',     // 1024px
  xl: 'max-w-screen-xl',     // 1280px
  full: 'max-w-full',        // 100%
}

// ─── Container Component ──────────────────────────────────────

/**
 * Container -- max-width wrapper with optional padding and centering.
 *
 * Extracted from 7+ full-page layouts in Component-Browser-Public-v1.0
 * that all repeat `container mx-auto px-4 lg:px-6` pattern.
 *
 * Maps directly to layout.containerMaxWidths tokens:
 *   sm=640px, md=768px, lg=1024px, xl=1280px, full=100%
 *
 * @example
 * ```tsx
 * <Container size="xl">
 *   <h1>Page Title</h1>
 *   <p>Content constrained to 1280px max width</p>
 * </Container>
 *
 * // Without auto-padding (use your own)
 * <Container size="lg" padded={false} className="px-8">
 *   ...
 * </Container>
 * ```
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = 'xl', padded = true, centered = true, className, ...props }, ref) => {
    const maxWidthClass = maxWidthMap[size]

    return (
      <div
        ref={ref}
        className={cn(
          maxWidthClass,
          centered && 'mx-auto',
          padded && 'px-4 lg:px-6',
          className
        )}
        {...props}
      />
    )
  }
)

Container.displayName = 'Container'
