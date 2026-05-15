'use client'

import { useState } from 'react'
import { Code2, Copy, Check } from 'lucide-react'
import type { LayoutRecipe } from '@/lib/layout/types'
import { useLayoutTheme } from '@/lib/layout/theme'
import { fontSize, fontWeight } from '@/lib/layout/tokens'
import { SyntaxLine } from './syntax-highlight'

// ─── Code Generator ──────────────────────────────────────────

function generateLayoutCode(recipe: LayoutRecipe): string {
  const t = recipe.gridTemplate
  let code = `<Layout structure="${recipe.structure}">\n`
  code += `  display: grid;\n`
  code += `  grid-template-columns: ${t.columns};\n`
  if (t.rows) code += `  grid-template-rows: ${t.rows};\n`
  if (t.areas) {
    code += `  grid-template-areas:\n`
    for (const row of t.areas) code += `    "${row}"\n`
    code += `  ;\n`
  }
  code += `  gap: ${recipe.gap};\n`
  code += `</Layout>`
  return code
}

// ─── Code Drawer ─────────────────────────────────────────────

export function CodeDrawer({ recipe }: { recipe: LayoutRecipe }) {
  const { tokens } = useLayoutTheme()
  const [copied, setCopied] = useState(false)
  const cssCode = generateLayoutCode(recipe)

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{
      borderTop: `1px solid ${tokens.borderSubtle}`,
      background: tokens.codeBg,
      height: 200, padding: '20px 32px', overflow: 'hidden',
      transition: 'background 0.3s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: fontSize.md, fontFamily: tokens.fontFamilyMono, color: tokens.codeMuted, fontWeight: fontWeight.semibold, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Code2 style={{ width: 16, height: 16 }} />
          {recipe.structure}.tsx — CSS Grid Layout
        </div>
        <button onClick={handleCopy} style={{
          fontSize: fontSize.sm, fontFamily: tokens.fontFamilyMono, color: copied ? '#34d399' : tokens.codeAccent, cursor: 'pointer',
          padding: '5px 14px', border: `1px solid ${copied ? '#34d39930' : `${tokens.codeAccent}30`}`,
          borderRadius: 6, background: 'transparent', display: 'flex', alignItems: 'center', gap: 5,
          fontWeight: fontWeight.semibold,
        }}>
          {copied ? <Check style={{ width: 12, height: 12 }} /> : <Copy style={{ width: 12, height: 12 }} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre style={{
        fontFamily: tokens.fontFamilyMono, fontSize: fontSize.md, lineHeight: 1.8,
        color: tokens.codeText, margin: 0, overflowX: 'auto', whiteSpace: 'pre',
      }}>
        {cssCode.split('\n').map((line, i) => <SyntaxLine key={i} line={line} />)}
      </pre>
    </div>
  )
}
