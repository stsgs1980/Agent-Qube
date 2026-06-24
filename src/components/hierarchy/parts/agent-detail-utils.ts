'use client'
import { motion } from 'framer-motion'
import type { Agent } from './types'
import { ROLE_CONFIG, STATUS_COLORS, FORMULA_COLORS } from './types'
import { AgentAvatarIcon } from './agent-avatar-icon'

const FORMULA_DESCRIPTIONS: Record<string, string> = {
  CoT: 'Chain of Thought -- step-by-step reasoning decomposition',
  ToT: 'Tree of Thoughts -- explores multiple reasoning paths',
  GoT: 'Graph of Thoughts -- models reasoning as a directed graph',
  AoT: 'Algorithm of Thoughts -- algorithmic reasoning via LLM',
  SoT: 'Skeleton of Thought -- outline first, then fill details',
  CoVe: 'Chain of Verification -- validates outputs with self-checks',
  ReWOO: 'Research without Observation -- plans then executes',
  Reflexion: 'Self-reflection -- learns from past mistakes',
  ReAct: 'Reasoning + Action -- interleaves thought and action',
  MoA: 'Mixture of Agents -- combines multiple agent outputs',
  SelfRefine: 'Self-Refine -- iteratively improves its own output',
  LATS: 'Language Agent Tree Search -- MCTS + LLM reasoning',
  SelfConsistency: 'Self-Consistency -- multiple paths + majority vote',
  PoT: 'Program of Thought -- reasons via code execution',
  DSPy: 'DSPy -- Declarative Self-Improving Prompt Optimization',
  PromptChaining: 'Prompt Chaining -- Sequential task decomposition via chained prompts',
  LeastToMost: 'Least-to-Most -- Progressive complexity reasoning from simple to hard',
  StepBack: 'Step-Back -- Abstract before solving for deeper reasoning',
  PlanAndSolve: 'Plan-and-Solve -- Two-phase: plan first, then execute',
  MetaCoT: 'Meta-Co-T -- Meta-reasoning over Chain of Thought decomposition',
}

function getRoleConfig(roleGroup: string) {
  return ROLE_CONFIG[roleGroup] || ROLE_CONFIG['\u0418\u0441\u043f\u043e\u043b\u043d\u0435\u043d\u0438\u0435']
}

export function getAgentRelations(agent: Agent, allAgents: Agent[]) {
  const parent = agent.parentId ? allAgents.find(a => a.id === agent.parentId) : null
  const twin = agent.twinId ? allAgents.find(a => a.id === agent.twinId) : null
  const children = allAgents.filter(a => a.parentId === agent.id)
  const siblings = allAgents.filter(a => a.roleGroup === agent.roleGroup && a.id !== agent.id && a.parentId === agent.parentId)
  return { parent, twin, children, siblings }
}

export { FORMULA_DESCRIPTIONS, getRoleConfig }