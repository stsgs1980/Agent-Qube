/**
 * Single source of truth for the application version.
 *
 * IMPORTANT: Bump this BEFORE every meaningful commit.
 * Run:  npm version patch  (or minor / major)
 *
 * ESLint rule "no-stale-version" will warn if package.json version
 * does not match this constant — keeping them in sync.
 */

export const APP_VERSION = '0.3.0'
export const APP_NAME = 'Agent Qube'

/** Short version for badges: "v0.3.0" */
export const VERSION_BADGE = `v${APP_VERSION}`

/** Build timestamp, injected at build time */
export const BUILD_TIME = typeof process !== 'undefined'
  ? (process.env.NEXT_PUBLIC_BUILD_TIME ?? new Date().toISOString().slice(0, 10))
  : ''