'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const DashboardPanel = dynamic(() => import('./dashboard-panel'), { ssr: false })
const AgentHierarchy = dynamic(() => import('@/components/hierarchy/agent-hierarchy-v2'), { ssr: false })
const WorkflowPipeline = dynamic(() => import('@/components/workflows/workflow-pipeline'), { ssr: false })

export default function Home() {
  const [activeView, setActiveView] = useState<'dashboard' | 'hierarchy' | 'workflows'>('dashboard')

  if (activeView === 'hierarchy') return <AgentHierarchy onBack={() => setActiveView('dashboard')} />
  if (activeView === 'workflows') return <WorkflowPipeline onBack={() => setActiveView('dashboard')} onOpenHierarchy={() => setActiveView('hierarchy')} fullPage />

  return <DashboardPanel onOpenHierarchy={() => setActiveView('hierarchy')} onOpenWorkflows={() => setActiveView('workflows')} />
}
