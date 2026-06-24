'use client'

import { useState, useCallback } from 'react'
import { Copy, Download, Check } from 'lucide-react'
import type { LayoutRecipe } from '@/lib/layout/types'
import { gapRemMap } from '@/lib/layout/types'
import { useLayoutTheme } from '@/lib/layout/theme'
import { radius, spacing } from '@/lib/layout/tokens'
import { CodeHighlight } from './syntax-highlight'

// ─── CSS Code Generator ─────────────────────────────────────

function generateGridCSS(recipe: LayoutRecipe): string {
  const t = recipe.gridTemplate
  let css = `.grid-container {\n  display: grid;\n  grid-template-columns: ${t.columns};\n`
  if (t.rows) css += `  grid-template-rows: ${t.rows};\n`
  if (t.areas) {
    css += `  grid-template-areas:\n`
    for (const row of t.areas) css += `    "${row}"\n`
    css += `  ;\n`
  }
  css += `  gap: ${gapRemMap[recipe.gap] ?? '1rem'};\n}`
  return css
}

// ─── Code Toolbar ────────────────────────────────────────

function CodeToolbar({ tokens, cssCode, recipe, copied, handleCopy, handleDownload }: any) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${spacing.sm}px ${spacing.base}px` }}>
      <span style={{ fontFamily: tokens.fontFamilyMono, fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>CSS Grid</span>
      <div style={{ display: 'flex', gap: spacing.sm }}>
        <button onClick={handleCopy} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: `${spacing.xs}px ${spacing.md}px`, borderRadius: radius.sm, border: '1px solid rgba(96,165,250,0.3)', background: 'transparent', color: copied ? '#34d399' : '#60A5FA', cursor: 'pointer', fontFamily: tokens.fontFamilyMono, fontSize: 10, fontWeight: 600, transition: 'all 0.15s' }}>
          {copied ? <Check style={{ width: 10, height: 10 }} /> : <Copy style={{ width: 10, height: 10 }} />}{copied ? 'Copied' : 'Copy'}
        </button>
        <button onClick={handleDownload} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: `${spacing.xs}px ${spacing.md}px`, borderRadius: radius.sm, border: '1px solid rgba(96,165,250,0.3)', background: 'transparent', color: '#60A5FA', cursor: 'pointer', fontFamily: tokens.fontFamilyMono, fontSize: 10, fontWeight: 600, transition: 'all 0.15s' }}>
          <Download style={{ width: 10, height: 10 }} />Download
        </button>
      </div>
    </div>
  )
}

// ─── Grid Code Block — Dark Drawer ──────────────────────────

export function GridCodeBlock({ recipe }: { recipe: LayoutRecipe }) {
  const { tokens } = useLayoutTheme()
  const [copied, setCopied] = useState(false)
  const cssCode = generateGridCSS(recipe)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(cssCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [cssCode])

  const handleDownload = useCallback(() => {
    const blob = new Blob([cssCode], { type: 'text/css' })
    const url = URL.createObjectURL(blob)
      const a = document.createElement('a');
      a.href = url;
      a.download = `${recipe.structure}.css`;
      a.click()
    URL.revokeObjectURL(url)
  }, [cssCode, recipe.structure])

  return (
    <div style={{ marginTop: 8, backgroundColor: '#0F172A', borderRadius: radius['2xl'], overflow: 'hidden' }}>
      <CodeToolbar tokens={tokens} cssCode={cssCode} recipe={recipe} copied={copied} handleCopy={handleCopy} handleDownload={handleDownload} />
      <pre style={{ margin: 0, padding: `${spacing.md}px ${spacing.base}px`, fontFamily: tokens.fontFamilyMono, fontSize: 12, lineHeight: 1.7, color: '#E2E8F0', overflowX: 'auto', whiteSpace: 'pre' }}>
        <CodeHighlight code={cssCode} />
      </pre>
    </div>
  )
}
