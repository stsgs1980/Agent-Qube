// ─── Types ────────────────────────────────────────────────────

/** Severity level for a scenario */
export type ScenarioSeverity = 'low' | 'medium' | 'high' | 'critical'

/**
 * A single scenario entry displayed inside `ScifiScenarioCards`.
 *
 * @example
 * ```tsx
 * const scenario: Scenario = {
 *   id: 'thermal-override',
 *   name: 'Thermal Override',
 *   description: 'Core temperature exceeds safe thresholds.',
 *   probability: 72,
 *   impact: '$80-90M',
 *   color: '#ff6b00',
 *   severity: 'high',
 * }
 * ```
 */
export interface Scenario {
  /** Unique identifier */
  id: string
  /** Scenario name */
  name: string
  /** Description text */
  description: string
  /** Probability 0-100 */
  probability: number
  /** Impact label (e.g., '$80-90', 'Level 3') */
  impact?: string
  /** Accent color for this scenario */
  color?: string
  /** Severity level */
  severity?: ScenarioSeverity
}
