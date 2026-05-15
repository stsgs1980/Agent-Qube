'use client'

import { useState } from 'react'

export type ViewTab = 'preview' | 'code' | 'docs' | 'playground'
export type ViewMode = 'grid' | 'list'

interface FilterState {
  selectedCategory: string | null
  activeLayer: string
  viewTab: ViewTab
  viewMode: ViewMode
}

const initialFilters: FilterState = {
  selectedCategory: null,
  activeLayer: 'ui',
  viewTab: 'preview',
  viewMode: 'grid',
}

export function useExplorerFilters() {
  const [filters, setFilters] = useState<FilterState>(initialFilters)

  const setSelectedCategory = (v: string | null) => setFilters(f => ({ ...f, selectedCategory: v }))
  const setActiveLayer = (v: string) => setFilters(f => ({ ...f, activeLayer: v }))
  const setViewTab = (v: ViewTab) => setFilters(f => ({ ...f, viewTab: v }))
  const setViewMode = (v: ViewMode) => setFilters(f => ({ ...f, viewMode: v }))

  return {
    selectedCategory: filters.selectedCategory, setSelectedCategory,
    activeLayer: filters.activeLayer, setActiveLayer,
    viewTab: filters.viewTab, setViewTab,
    viewMode: filters.viewMode, setViewMode,
  }
}
