import React from 'react'
import { Keyboard } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const SHORTCUTS = [
  { keys: ['/'], altKeys: ['Ctrl+K'], description: 'Focus search' },
  { keys: ['Esc'], description: 'Close detail panel / Close shortcuts' },
  { keys: ['+', '='], description: 'Zoom in' },
  { keys: ['-'], description: 'Zoom out' },
  { keys: ['0'], description: 'Reset zoom' },
  { keys: ['F'], description: 'Fit to screen' },
  { keys: ['1-8'], description: 'Filter by role group (1=Strategy, 2=Tactics, ...)' },
  { keys: ['9'], description: 'Clear role group filter (show all)' },
  { keys: ['H'], description: 'Hierarchy view' },
  { keys: ['R'], description: 'Radial view' },
  { keys: ['G'], description: 'Grid view' },
  { keys: ['?'], description: 'Show keyboard shortcuts' },
]

export function KeyboardShortcutsDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-sm"
        style={{
          background: 'rgba(26, 26, 26, 0.95)',
          border: '1px solid rgba(51,51,51,0.5)',
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Keyboard className="h-4 w-4 text-[#06B6D4]" />
            Keyboard Shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-1 pt-2">
          {SHORTCUTS.map((shortcut, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-1.5 px-2 rounded-md"
              style={{
                background: i % 2 === 0 ? 'rgba(45, 45, 45, 0.3)' : 'transparent',
              }}
            >
              <span className="text-[#B0B0B0] text-xs">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {(shortcut.altKeys || []).map((key, j) => (
                  <React.Fragment key={j}>
                    {j > 0 && <span className="text-[#555] text-[10px]">or</span>}
                    <kbd
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold"
                      style={{
                        background: 'rgba(6, 182, 212, 0.1)',
                        border: '1px solid rgba(6, 182, 212, 0.25)',
                        color: '#06B6D4',
                      }}
                    >
                      {key}
                    </kbd>
                  </React.Fragment>
                ))}
                {shortcut.keys.map((key, j) => (
                  <React.Fragment key={`k-${j}`}>
                    {(shortcut.altKeys && shortcut.altKeys.length > 0 || j > 0) && (
                      <span className="text-[#555] text-[10px]">or</span>
                    )}
                    <kbd
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold min-w-[24px] text-center"
                      style={{
                        background: 'rgba(6, 182, 212, 0.1)',
                        border: '1px solid rgba(6, 182, 212, 0.25)',
                        color: '#06B6D4',
                      }}
                    >
                      {key}
                    </kbd>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[#555] pt-1 text-center">
          Shortcuts are disabled when typing in input fields
        </p>
      </DialogContent>
    </Dialog>
  )
}

// ─── Right-Click Context Menu ────────────────────────────────────────────────

