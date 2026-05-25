'use client'

import { Brain, Sparkles, X, ArrowLeft, Cpu, BarChart3, GitCompare } from 'lucide-react'
import { usePromptAnalysis } from '@/hooks/use-prompt-analysis'
import { IntentDisplay } from './intent-display'
import { PipelinePreview } from './pipeline-preview'
import { ExecutionResult } from './execution-result'
import { PromptHistory } from './prompt-history'
import { PromptTips } from './prompt-tips'
import { PromptQualityScore } from './prompt-quality-score'
import { PromptComparison } from './prompt-comparison'
import { useState, useEffect, useCallback } from 'react'

const EXAMPLE_CHIPS = [
  { en: 'Find bugs in my code', ru: 'Найди баги в коде' },
  { en: 'Analyze data trends', ru: 'Проанализируй тренды данных' },
  { en: 'Review my API design', ru: 'Проверь дизайн API' },
  { en: 'Generate unit tests', ru: 'Сгенерируй юнит-тесты' },
  { en: 'Explain this architecture', ru: 'Объясни эту архитектуру' },
]

const PLACEHOLDERS = [
  'e.g. "Find bugs in my authentication code"',
  'e.g. "Analyze code and find issues"',
  'e.g. "Analyze sales data trends for Q4"',
  'e.g. "Check API design for security"',
  'e.g. "Explain how microservices communicate"',
]

export default function PromptStudio({ onBack }: { onBack?: () => void }) {
  const { prompt, setPrompt, analysis, analyzing, executing, executionResult, error, analyze, clear, executeSimulation } = usePromptAnalysis()
  const [placeholderIdx, setPlaceholderIdx] = useState(0)
  const [historyCollapsed, setHistoryCollapsed] = useState(false)
  const [autoAnalyze, setAutoAnalyze] = useState(false)
  const [showQuality, setShowQuality] = useState(false)
  const [showCompare, setShowCompare] = useState(false)
  const [historyEntries, setHistoryEntries] = useState<Array<{ id: string; prompt: string; avgScore: number; createdAt: string }>>([])

  useEffect(() => {
    const timer = setInterval(() => setPlaceholderIdx((i) => (i + 1) % PLACEHOLDERS.length), 4000)
    return () => clearInterval(timer)
  }, [])

  // Auto-analyze after prompt update from history selection
  useEffect(() => {
    if (autoAnalyze && prompt.trim()) { analyze(); setAutoAnalyze(false) }
  }, [autoAnalyze, prompt, analyze])

  const handleHistorySelect = useCallback((newPrompt: string) => {
    setPrompt(newPrompt)
    setAutoAnalyze(true)
  }, [setPrompt])

  const handleHistoryData = useCallback((entries: Array<{ id: string; prompt: string; avgScore: number; createdAt: string }>) => {
    setHistoryEntries(entries)
  }, [])

  return (
    <div className="h-screen bg-black select-none">
      <style>{KEYFRAMES}</style>
      <div className="w-full h-full flex flex-col relative overflow-hidden">
        <StudioHeader onBack={onBack} />
        <div className="flex-1 flex overflow-hidden">
          {/* Main content */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-10 max-w-[1280px] mx-auto w-full" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
            <InputArea prompt={prompt} setPrompt={setPrompt} analyzing={analyzing} onAnalyze={analyze} onClear={clear} placeholder={PLACEHOLDERS[placeholderIdx]} showQuality={showQuality} onToggleQuality={() => setShowQuality(!showQuality)} showCompare={showCompare} onToggleCompare={() => setShowCompare(!showCompare)} />
            {error && <ErrorBanner message={error} />}
            {prompt.trim() && <PromptTips prompt={prompt} />}
            {showQuality && prompt.trim() && <PromptQualityScore prompt={prompt} />}
            {showCompare && prompt.trim() && <PromptComparison currentPrompt={prompt} historyPrompts={historyEntries} />}
            {analysis && <IntentDisplay analysis={analysis} />}
            {analysis && <PipelinePreview steps={analysis.pipelineSteps} executing={executing} onExecute={executeSimulation} />}
            {executionResult && <ExecutionResult result={executionResult} />}
          </div>
          {/* History sidebar */}
          <PromptHistory onSelect={handleHistorySelect} collapsed={historyCollapsed} onToggleCollapse={() => setHistoryCollapsed(!historyCollapsed)} onDataChange={handleHistoryData} />
        </div>
      </div>
    </div>
  )
}

function StudioHeader({ onBack }: { onBack?: () => void }) {
  return (
    <header className="relative z-40 flex items-center h-14 flex-shrink-0 px-5 gap-4" style={{ background: '#0D0D0D', borderBottom: '1px solid rgba(51,51,51,0.5)' }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #06B6D4, transparent)' }} />
      <div className="flex items-center gap-3 flex-shrink-0">
        {onBack && <button onClick={onBack} className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(51,51,51,0.4)' }} title="Back"><ArrowLeft size={16} style={{ color: '#06B6D4' }} /></button>}
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.25)' }}><Sparkles size={16} style={{ color: '#06B6D4' }} /></div>
        <span className="text-base font-bold" style={{ color: '#06B6D4' }}>P-MAS</span><span className="text-sm" style={{ color: '#475569' }}>|</span><span className="text-base font-medium text-white">Prompt Studio</span>
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}>
        <Brain size={14} style={{ color: '#06B6D4' }} />
        <span className="text-xs font-bold" style={{ color: '#06B6D4' }}>AI</span>
      </div>
    </header>
  )
}

function ErrorBanner({ message }: { message: string }) {
  return <div className="mb-5 px-4 py-3 rounded-lg text-sm font-medium" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#FCA5A5' }}>{message}</div>
}

function InputArea({ prompt, setPrompt, analyzing, onAnalyze, onClear, placeholder, showQuality, onToggleQuality, showCompare, onToggleCompare }: {
  prompt: string; setPrompt: (v: string) => void; analyzing: boolean; onAnalyze: () => void; onClear: () => void; placeholder: string
  showQuality: boolean; onToggleQuality: () => void; showCompare: boolean; onToggleCompare: () => void
}) {
  return (
    <div className="space-y-4 mb-8">
      <div className="rounded-xl overflow-hidden" style={{ background: '#0A0A0A', border: '1px solid rgba(51,51,51,0.3)' }}>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !analyzing) onAnalyze() }} placeholder={placeholder} rows={3} className="w-full px-5 py-4 text-sm text-white bg-transparent outline-none resize-none placeholder:text-[#475569]" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }} />
        <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: '1px solid rgba(51,51,51,0.2)' }}>
          <div className="flex items-center gap-3">
            <button onClick={onAnalyze} disabled={analyzing || !prompt.trim()} className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:hover:scale-100" style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', color: '#06B6D4' }}>
              {analyzing ? <><Cpu size={14} className="animate-pulse" />Analyzing...</> : <><Sparkles size={14} />Analyze</>}
            </button>
            <button onClick={onClear} className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 hover:scale-105" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(51,51,51,0.4)', color: '#64748B' }}>
              <X size={12} />Clear
            </button>
            <button onClick={onToggleQuality} className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 hover:scale-105" style={{ background: showQuality ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${showQuality ? 'rgba(6,182,212,0.3)' : 'rgba(51,51,51,0.4)'}`, color: showQuality ? '#06B6D4' : '#64748B' }}>
              <BarChart3 size={12} />Score
            </button>
            <button onClick={onToggleCompare} className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 hover:scale-105" style={{ background: showCompare ? 'rgba(6,182,212,0.15)' : 'rgba(255,255,255,0.05)', border: `1px solid ${showCompare ? 'rgba(6,182,212,0.3)' : 'rgba(51,51,51,0.4)'}`, color: showCompare ? '#06B6D4' : '#64748B' }}>
              <GitCompare size={12} />Compare
            </button>
          </div>
          <span className="text-xs" style={{ color: '#475569' }}>Ctrl+Enter to analyze</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {EXAMPLE_CHIPS.map((chip) => (
          <button key={chip.en} onClick={() => setPrompt(chip.en)} className="px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(51,51,51,0.3)', color: '#94A3B8' }}>{chip.en}</button>
        ))}
      </div>
    </div>
  )
}

const KEYFRAMES = `@keyframes pulseRing{0%{box-shadow:0 0 0 0 rgba(6,182,212,0.4)}70%{box-shadow:0 0 0 8px rgba(6,182,212,0)}100%{box-shadow:0 0 0 0 rgba(6,182,212,0)}}`
