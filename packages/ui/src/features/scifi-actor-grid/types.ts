// ─── Types ────────────────────────────────────────────────────
import type { ReactNode } from 'react'

/** Diplomatic stance of an actor
 * @example `'hostile'`
 */
export type StanceType = 'friendly' | 'protective' | 'hostile' | 'neutral'

/**
 * An entity or actor displayed inside `ScifiActorGrid`.
 *
 * @example
 * ```tsx
 * const actor: Actor = {
 *   id: 'earth-alliance',
 *   name: 'Earth Alliance',
 *   role: 'Central Government',
 *   stance: 'protective',
 *   influence: 85,
 *   description: 'Governing body of the Sol system colonies.',
 * }
 * ```
 */
export interface Actor {
  /** Unique identifier */
  id: string
  /** Display name */
  name: string
  /** Role or title (rendered as muted subtitle)
   * @example `'Central Government'`
   */
  role?: string
  /** Diplomatic stance — determines badge color */
  stance?: StanceType
  /** Influence score 0–100, displayed as a glowing bar */
  influence?: number
  /** Brief description (muted text, line-clamped) */
  description?: string
  /** Optional leading icon or flag emoji
   * @example `'🜘'` or `<Shield className="w-4 h-4" />`
   */
  icon?: ReactNode
}

/** Severity level for a timeline event
 * @example `'critical'`
 */
export type EventSeverity = 'low' | 'medium' | 'high' | 'critical'

/**
 * A single event entry for `ScifiTimelinePanel`.
 *
 * @example
 * ```tsx
 * const event: TimelineEventEntry = {
 *   id: 'treaty-2187',
 *   date: '2187.03.14',
 *   title: 'Treaty of Proxima',
 *   description: 'Multilateral disarmament agreement signed by all factions.',
 *   severity: 'high',
 * }
 * ```
 */
export interface TimelineEventEntry {
  /** Unique identifier */
  id: string
  /** Display date
   * @example `'2187.03.14'`
   */
  date: string
  /** Event title */
  title: string
  /** Expandable description text */
  description?: string
  /** Severity — controls dot color */
  severity?: EventSeverity
}
