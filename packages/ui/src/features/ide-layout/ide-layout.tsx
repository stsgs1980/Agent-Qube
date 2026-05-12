'use client'

import { useState, forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../tokens/cn'

export interface IdeFile {
  name: string
  language: string
  content: string
}

export interface IdeTheme {
  bg: string
  text: string
  muted: string
  accent: string
  sidebarBg: string
  border: string
}

const defaultTheme: IdeTheme = {
  bg: '#0F172A',
  text: '#E2E8F0',
  muted: '#64748B',
  accent: '#60A5FA',
  sidebarBg: '#0C0F1A',
  border: '#1E293B',
}

export interface IdeLayoutProps extends HTMLAttributes<HTMLDivElement> {
  /** Files in the file tree */
  files: IdeFile[]
  /** Active file index */
  activeFileIndex?: number
  /** Terminal output lines */
  terminalLines?: string[]
  /** Status bar text */
  statusText?: string
  /** Theme overrides */
  theme?: Partial<IdeTheme>
}

/**
 * IdeLayout — Full IDE mock with file tree, code editor, terminal, and status bar.
 * Layer 4: Has own state (active file, expanded folders).
 */
export const IdeLayout = forwardRef<HTMLDivElement, IdeLayoutProps>(
  ({ files, activeFileIndex: controlledIndex, terminalLines, statusText, theme: themeOverride, className, ...props }, ref) => {
    const [internalIndex, setInternalIndex] = useState(0)
    const activeIndex = controlledIndex ?? internalIndex
    const t = { ...defaultTheme, ...themeOverride }
    const activeFile = files[activeIndex]

    return (
      <div ref={ref} className={cn('flex h-full flex-col overflow-hidden rounded-lg border', className)} style={{ borderColor: t.border }} {...props}>
        <div className="flex flex-1 overflow-hidden">
          {/* File Tree */}
          <div className="w-48 shrink-0 border-r p-2" style={{ background: t.sidebarBg, borderColor: t.border }}>
            <div className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: t.muted }}>Explorer</div>
            {files.map((file, i) => (
              <button key={file.name} onClick={() => setInternalIndex(i)}
                className="flex w-full items-center gap-2 rounded px-2 py-1 text-left text-xs transition-colors"
                style={{ color: i === activeIndex ? t.accent : t.text, background: i === activeIndex ? `${t.accent}15` : 'transparent' }}>
                <span style={{ color: t.muted }}>◆</span> {file.name}
              </button>
            ))}
          </div>
          {/* Code Editor */}
          <div className="flex-1 overflow-auto p-4" style={{ background: t.bg }}>
            <pre className="text-xs leading-6" style={{ color: t.text, fontFamily: "'JetBrains Mono', monospace" }}>
              {activeFile?.content}
            </pre>
          </div>
        </div>
        {/* Terminal */}
        {terminalLines && (
          <div className="border-t p-3" style={{ background: t.sidebarBg, borderColor: t.border }}>
            <div className="mb-1 text-[10px] font-bold uppercase tracking-widest" style={{ color: t.muted }}>Terminal</div>
            {terminalLines.map((line, i) => (
              <div key={i} className="text-xs" style={{ color: t.text, fontFamily: "'JetBrains Mono', monospace" }}>{line}</div>
            ))}
          </div>
        )}
        {/* Status Bar */}
        <div className="flex items-center justify-between border-t px-3 py-1" style={{ background: t.sidebarBg, borderColor: t.border }}>
          <span className="text-[10px]" style={{ color: t.muted }}>{activeFile?.language ?? ''}</span>
          <span className="text-[10px]" style={{ color: t.muted }}>{statusText ?? `${files.length} files`}</span>
        </div>
      </div>
    )
  }
)
IdeLayout.displayName = 'IdeLayout'
