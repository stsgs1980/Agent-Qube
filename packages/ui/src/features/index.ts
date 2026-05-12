// Layer 4: Features
// Complex interactive widgets with internal state.
// 5 original + 3 extracted from Code-Realm / Component-Browser.
// Has state and hooks, but self-contained. Data comes via props.

export { IdeLayout } from './ide-layout'
export type { IdeLayoutProps, IdeFile, IdeTheme } from './ide-layout'

export { ResponsiveShowcase } from './responsive-showcase'
export type { ResponsiveShowcaseProps } from './responsive-showcase'

export { CommandPalette } from './command-palette'
export type { CommandPaletteProps } from './command-palette'

export { ThemeToggle } from './theme-toggle'
export type { ThemeToggleProps } from './theme-toggle'

export { SearchPanel } from './search-panel'
export type { SearchPanelProps } from './search-panel'

// Extracted from Code-Realm (8+ duplicates)
export { FloatingDecorations } from './floating-decorations'
export type { FloatingDecorationsProps, FloatingSymbol } from './floating-decorations'

// Scroll progress indicator
export { ScrollProgressBar } from './scroll-progress-bar'
export type { ScrollProgressBarProps } from './scroll-progress-bar'

// Extracted from Component-Browser
export { ActivityTimeline } from './activity-timeline'
export type { ActivityTimelineProps, ActivityEntry, ActivityKind } from './activity-timeline'
