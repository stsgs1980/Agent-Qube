'use client'

import { Sparkles, Wand2 } from 'lucide-react'
import { useLayoutTheme } from '@/lib/layout/theme'
import { useAiPrompt } from '@/lib/layout/use-ai-prompt'
import { radius, spacing, fontSize, fontWeight } from '@/lib/layout/tokens'

// ─── Prompt Input Area ─────────────────────────────────────────

interface PromptInputProps {
  prompt: string
  onPromptChange: (v: string) => void
  onSubmit: () => void
  aiMode: boolean
  aiLoading: boolean
  onToggleAiMode: () => void
}

export function PromptInput({ prompt, onPromptChange, onSubmit, aiMode, aiLoading, onToggleAiMode }: PromptInputProps) {
  const { tokens } = useLayoutTheme()

  return (
    <div style={{ width: '100%', maxWidth: 600 }}>
      <div style={{
        border: `2px solid ${prompt ? tokens.borderBright : tokens.borderSubtle}`,
        borderRadius: radius['4xl'], background: tokens.bgBase,
        boxShadow: prompt ? `0 4px 24px ${tokens.accentPrimary}10` : tokens.cardShadow,
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}>
        {/* Input row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing.md, padding: `${spacing.md}px ${spacing.lg}px` }}>
          {aiLoading ? (
            <div style={{ width: 20, height: 20, border: `2px solid ${tokens.borderDefault}`, borderTopColor: tokens.textPrimary, borderRadius: '50%', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
          ) : (
            <Wand2 style={{ width: 20, height: 20, flexShrink: 0, color: prompt ? tokens.accentAI : tokens.textMuted, transition: 'color 0.3s' }} />
          )}
          <input type="text" value={prompt}
            onChange={e => onPromptChange(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !aiLoading && onSubmit()}
            placeholder="Build me an admin dashboard with sidebar..."
            aria-label="Layout description"
            style={{ flex: 1, background: 'transparent', fontSize: fontSize.lg, outline: 'none', color: tokens.textPrimary, fontFamily: tokens.fontFamilyBody }}
            disabled={aiLoading} />
          <SubmitButton disabled={!prompt.trim() || aiLoading} aiMode={aiMode} aiLoading={aiLoading} onClick={onSubmit} />
        </div>

        {/* Footer row */}
        <div style={{ padding: `${spacing.sm}px ${spacing.lg}px`, borderTop: `1px solid ${tokens.borderSubtle}`, display: 'flex', alignItems: 'center', gap: spacing.md }}>
          <button onClick={onToggleAiMode} aria-label={`AI Mode ${aiMode ? 'on' : 'off'}`} aria-pressed={aiMode} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            padding: `${spacing.xs}px ${spacing.md}px`, borderRadius: radius.lg,
            fontSize: fontSize.sm, fontWeight: fontWeight.bold, fontFamily: tokens.fontFamilyMono,
            background: aiMode ? `${tokens.accentAI}14` : tokens.bgSurface,
            color: aiMode ? tokens.accentAI : tokens.textMuted,
            border: `1px solid ${aiMode ? `${tokens.accentAI}30` : tokens.borderDefault}`,
            cursor: 'pointer', transition: 'all 0.15s', minHeight: 44,
          }}>
            <Sparkles style={{ width: 12, height: 12 }} />
            AI Mode {aiMode ? 'ON' : 'OFF'}
          </button>
          <span style={{ fontSize: fontSize.sm, color: tokens.textDim, fontFamily: tokens.fontFamilyMono }}>
            {aiMode ? 'LLM interprets -> structured params' : 'Keyword matching -> fast, local'}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── Submit Button ─────────────────────────────────────────────

function SubmitButton({ disabled, aiMode, aiLoading, onClick }: {
  disabled: boolean; aiMode: boolean; aiLoading: boolean; onClick: () => void
}) {
  const { tokens } = useLayoutTheme()
  const canSubmit = !disabled
  return (
    <button onClick={onClick} disabled={disabled} aria-label={aiLoading ? 'Processing' : 'Generate'} style={{
      padding: `${spacing.sm}px ${spacing.xl}px`, borderRadius: radius.xl,
      fontSize: fontSize.md, fontWeight: fontWeight.bold, fontFamily: tokens.fontFamilyBody,
      background: canSubmit ? tokens.bgOnAccent : tokens.bgSurface,
      color: canSubmit ? tokens.textOnAccent : tokens.textDim,
      border: 'none', cursor: canSubmit ? 'pointer' : 'not-allowed',
      transition: 'all 0.2s', minHeight: 44,
    }}>
      {aiLoading ? 'Thinking...' : aiMode ? 'AI Generate' : 'Generate'}
    </button>
  )
}
