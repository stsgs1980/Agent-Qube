'use client'

import { useState } from 'react'
import DashboardPanel from './dashboard-panel'
import AgentHierarchy from '@/components/hierarchy/agent-hierarchy-v2'
import WorkflowPipeline from '@/components/workflows/workflow-pipeline'

export default function Home() {
  const [activeView, setActiveView] = useState<'dashboard' | 'hierarchy' | 'workflows'>('dashboard')

  if (activeView === 'hierarchy') return <AgentHierarchy onBack={() => setActiveView('dashboard')} />
  if (activeView === 'workflows') return <WorkflowPipeline onBack={() => setActiveView('dashboard')} onOpenHierarchy={() => setActiveView('hierarchy')} fullPage />

  return <DashboardPanel onOpenHierarchy={() => setActiveView('hierarchy')} onOpenWorkflows={() => setActiveView('workflows')} />
}
