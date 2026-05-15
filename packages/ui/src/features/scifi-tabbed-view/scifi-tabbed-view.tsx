'use client'

import { forwardRef, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../tokens/cn'

// ─── Types ────────────────────────────────────────────────────

/** Definition of a single tab */
export interface TabDefinition {
  /** Unique tab identifier */
  id: string
  /** Tab label text */
  label: string
  /** Optional leading icon (ReactNode) */
  icon?: React.ReactNode
  /** Accent color for this tab. Default: '#00e5ff' */
  color?: string
  /** Responsive label shown on small screens */
  shortLabel?: string
}

export interface ScifiTabbedViewProps {
  /** Tab definitions */
  tabs: TabDefinition[]
  /** Controlled active tab id */
  value?: string
  /** Initial active tab id (uncontrolled mode) */
  defaultValue?: string
  /** Called when active tab changes */
  onChange?: (tabId: string) => void
  /** Render function for tab content */
  children: (activeTab: string) => React.ReactNode
  /** Layout ID for animated underline (must be unique per instance) */
  layoutId?: string
  /** Additional CSS classes for the container */
  className?: string
  /** Additional CSS classes for the tab bar */
  tabBarClassName?: string
}

// ─── Component ────────────────────────────────────────────────

/**
 * ScifiTabbedView -- tabbed container with animated indicator.
 *
 * Renders a tab bar with per-tab accent colors, an animated bottom
 * underline indicator via framer-motion layoutId, and AnimatePresence
 * content transitions. Supports both controlled and uncontrolled modes.
 *
 * @example
 * ```tsx
 * <ScifiTabbedView
 *   tabs={[
 *     { id: 'overview', label: 'Overview', color: '#00e5ff' },
 *     { id: 'details', label: 'Details', color: '#ff6b00' },
 *   ]}
 *   defaultValue="overview"
 * >
 *   {(active) => active === 'overview' ? <OverviewPanel /> : <DetailsPanel />}
 * </ScifiTabbedView>
 * ```
 */
export const ScifiTabbedView = forwardRef<HTMLDivElement, ScifiTabbedViewProps>(
  (
    {
      tabs,
      value: controlledValue,
      defaultValue,
      onChange,
      children,
      layoutId = 'scifi-tab-indicator',
      className,
      tabBarClassName,
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue ?? tabs[0]?.id ?? '')
    const activeTab = controlledValue ?? internalValue

    const handleSelect = (tabId: string) => {
      if (!controlledValue) setInternalValue(tabId)
      onChange?.(tabId)
    }

    return (
      <div ref={ref} className={cn('flex flex-col', className)} data-slot="scifi-tabbed-view">
        {/* Tab bar */}
        <div
          className={cn('flex gap-1 p-1 rounded-sm', tabBarClassName)}
          style={{ background: 'rgba(10,10,30,0.5)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const accent = tab.color ?? '#00e5ff'
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelect(tab.id)}
                className="relative flex items-center gap-2 px-4 py-2.5 rounded-sm text-xs font-mono font-medium tracking-wide whitespace-nowrap transition-colors duration-200 flex-1 justify-center"
                style={{
                  color: isActive ? accent : '#505070',
                  backgroundColor: isActive ? `${accent}10` : 'transparent',
                }}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId={layoutId}
                    className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
                    style={{ backgroundColor: accent, boxShadow: `0 0 8px ${accent}60` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Tab content with animated transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {children(activeTab)}
          </motion.div>
        </AnimatePresence>
      </div>
    )
  },
)
ScifiTabbedView.displayName = 'ScifiTabbedView'
