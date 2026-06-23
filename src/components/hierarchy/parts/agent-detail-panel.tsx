'use client'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, Activity } from 'lucide-react'
import type { Agent } from './types'
import { ROLE_CONFIG, FORMULA_COLORS, STATUS_COLORS } from './types'
import { AgentAvatarIcon } from './agent-avatar-icon'

export function AgentDetailPanel({
  agent,
  allAgents,
  onClose,
}: {
  agent: Agent
  allAgents: Agent[]
  onClose: () => void
}) {
  const config = ROLE_CONFIG[agent.roleGroup] || ROLE_CONFIG['\u0418\u0441\u043f\u043e\u043b\u043d\u0435\u043d\u0438\u0435']
  const formulaColor = FORMULA_COLORS[agent.formula] || '#888'
  const statusColor = STATUS_COLORS[agent.status] || STATUS_COLORS.offline
  const skills = agent.skills ? agent.skills.split(',').filter(Boolean) : []

  const parent = agent.parentId ? allAgents.find(a => a.id === agent.parentId) : null
  const twin = agent.twinId ? allAgents.find(a => a.id === agent.twinId) : null
  const children = allAgents.filter(a => a.parentId === agent.id)
  const siblings = allAgents.filter(a => a.roleGroup === agent.roleGroup && a.id !== agent.id && a.parentId === agent.parentId)

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="absolute right-4 bottom-4 w-[340px] z-50 rounded-2xl overflow-hidden"
      style={{
        top: '48px',
        background: 'rgba(26, 26, 26, 0.92)',
        backdropFilter: 'blur(24px)',
        border: `1px solid rgba(${config.colorRgb}, 0.3)`,
        boxShadow: `0 0 40px rgba(${config.colorRgb}, 0.1), 0 8px 32px rgba(0,0,0,0.5)`,
      }}
    >
      <ScrollArea className="h-full">
        {/* Top colored stripe with animation */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            height: 3,
            background: `linear-gradient(90deg, transparent, ${config.color}, transparent)`,
            opacity: 0.7,
            transformOrigin: 'center',
          }}
        />
        <div className="p-5">
          {/* Header with close button */}
          <div className="flex items-start justify-between mb-5">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background: `rgba(${config.colorRgb}, 0.15)`,
                  border: `1px solid rgba(${config.colorRgb}, 0.3)`,
                }}
              >
                <AgentAvatarIcon avatar={agent.avatar} size={24} color={config.color} />
              </div>
              <div>
                <h3 className="text-white font-bold text-base">{agent.name}</h3>
                <p className="text-xs" style={{ color: config.color }}>{agent.role}</p>
              </div>
            </motion.div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-7 h-7 rounded-lg transition-all hover:scale-110"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(51,51,51,0.5)',
                color: '#B0B0B0',
              }}
              title="Close panel"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Status & Formula row */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="flex items-center gap-2 mb-4"
          >
            <Badge
              className="text-[10px] font-semibold"
              style={{
                background: `${statusColor}20`,
                color: statusColor,
                borderColor: `${statusColor}40`,
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full mr-1 inline-block"
                style={{ background: statusColor }}
              />
              {agent.status.toUpperCase()}
            </Badge>
            <Badge
              className="text-[10px] font-bold"
              style={{
                background: `${formulaColor}20`,
                color: formulaColor,
                borderColor: `${formulaColor}40`,
              }}
            >
              {agent.formula}
            </Badge>
            <Badge
              variant="outline"
              className="text-[10px]"
              style={{
                color: config.color,
                borderColor: `rgba(${config.colorRgb}, 0.4)`,
              }}
            >
              {agent.roleGroup}
            </Badge>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="mb-5"
          >
            <h4 className="text-[#B0B0B0] text-[10px] uppercase tracking-wider font-semibold mb-1.5">Description</h4>
            <p className="text-[#B0B0B0] text-xs leading-relaxed">{agent.description}</p>
          </motion.div>

          {/* Cognitive Formula */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.3 }}
            className="mb-5"
          >
            <h4 className="text-[#B0B0B0] text-[10px] uppercase tracking-wider font-semibold mb-1.5">Cognitive Formula</h4>
            <div
              className="rounded-lg p-3"
              style={{
                background: `rgba(${config.colorRgb}, 0.08)`,
                border: `1px solid rgba(${config.colorRgb}, 0.2)`,
              }}
            >
              <span className="font-bold text-sm" style={{ color: formulaColor }}>{agent.formula}</span>
              <p className="text-[#B0B0B0] text-[10px] mt-1">
                {agent.formula === 'CoT' && 'Chain of Thought -- step-by-step reasoning decomposition'}
                {agent.formula === 'ToT' && 'Tree of Thoughts -- explores multiple reasoning paths'}
                {agent.formula === 'GoT' && 'Graph of Thoughts -- models reasoning as a directed graph'}
                {agent.formula === 'AoT' && 'Algorithm of Thoughts -- algorithmic reasoning via LLM'}
                {agent.formula === 'SoT' && 'Skeleton of Thought -- outline first, then fill details'}
                {agent.formula === 'CoVe' && 'Chain of Verification -- validates outputs with self-checks'}
                {agent.formula === 'ReWOO' && 'Research without Observation -- plans then executes'}
                {agent.formula === 'Reflexion' && 'Self-reflection -- learns from past mistakes'}
                {agent.formula === 'ReAct' && 'Reasoning + Action -- interleaves thought and action'}
                {agent.formula === 'MoA' && 'Mixture of Agents -- combines multiple agent outputs'}
                {agent.formula === 'SelfRefine' && 'Self-Refine -- iteratively improves its own output'}
                {agent.formula === 'LATS' && 'Language Agent Tree Search -- MCTS + LLM reasoning'}
                {agent.formula === 'SelfConsistency' && 'Self-Consistency -- multiple paths + majority vote'}
                {agent.formula === 'PoT' && 'Program of Thought -- reasons via code execution'}
                {agent.formula === 'DSPy' && 'DSPy -- Declarative Self-Improving Prompt Optimization'}
                {agent.formula === 'PromptChaining' && 'Prompt Chaining -- Sequential task decomposition via chained prompts'}
                {agent.formula === 'LeastToMost' && 'Least-to-Most -- Progressive complexity reasoning from simple to hard'}
                {agent.formula === 'StepBack' && 'Step-Back -- Abstract before solving for deeper reasoning'}
                {agent.formula === 'PlanAndSolve' && 'Plan-and-Solve -- Two-phase: plan first, then execute'}
                {agent.formula === 'MetaCoT' && 'Meta-Co-T -- Meta-reasoning over Chain of Thought decomposition'}
              </p>
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            className="mb-5"
          >
            <h4 className="text-[#B0B0B0] text-[10px] uppercase tracking-wider font-semibold mb-2">Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, i) => (
                <Badge
                  key={i}
                  variant="outline"
                  className="text-[10px] px-2 py-0.5"
                  style={{
                    color: config.color,
                    borderColor: `rgba(${config.colorRgb}, 0.4)`,
                    background: `rgba(${config.colorRgb}, 0.08)`,
                  }}
                >
                  {skill.trim()}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Connections */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.3 }}
            className="mb-5"
          >
            <h4 className="text-[#B0B0B0] text-[10px] uppercase tracking-wider font-semibold mb-2">Connections</h4>
            <div className="space-y-1.5">
              {parent && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#B0B0B0] w-16">Parent</span>
                  <AgentAvatarIcon avatar={parent.avatar} size={14} color={ROLE_CONFIG[parent.roleGroup]?.color || '#888'} />
                  <span className="text-white">{parent.name}</span>
                </div>
              )}
              {twin && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#B0B0B0] w-16">Twin</span>
                  <AgentAvatarIcon avatar={twin.avatar} size={14} color={ROLE_CONFIG[twin.roleGroup]?.color || '#888'} />
                  <span className="text-white">{twin.name}</span>
                </div>
              )}
              {children.length > 0 && (
                <div>
                  <span className="text-[#B0B0B0] text-xs">Children</span>
                  <div className="ml-2 mt-1 space-y-1">
                    {children.map(c => (
                      <div key={c.id} className="flex items-center gap-1.5 text-xs text-[#B0B0B0]">
                        <AgentAvatarIcon avatar={c.avatar} size={14} color={ROLE_CONFIG[c.roleGroup]?.color || '#888'} />
                        <span>{c.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {siblings.length > 0 && (
                <div>
                  <span className="text-[#B0B0B0] text-xs">Sync peers</span>
                  <div className="ml-2 mt-1 space-y-1">
                    {siblings.map(s => (
                      <div key={s.id} className="flex items-center gap-1.5 text-xs text-[#B0B0B0]">
                        <AgentAvatarIcon avatar={s.avatar} size={14} color={ROLE_CONFIG[s.roleGroup]?.color || '#888'} />
                        <span>{s.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Task Count */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <h4 className="text-[#B0B0B0] text-[10px] uppercase tracking-wider font-semibold mb-1.5">Tasks</h4>
            <div
              className="rounded-lg px-3 py-2 inline-flex items-center gap-2"
              style={{
                background: `rgba(${config.colorRgb}, 0.08)`,
                border: `1px solid rgba(${config.colorRgb}, 0.2)`,
              }}
            >
              <Activity className="h-3.5 w-3.5" style={{ color: config.color }} />
              <span className="text-white font-bold text-sm">{agent.tasks?.length ?? 0}</span>
              <span className="text-[#B0B0B0] text-[10px]">assigned</span>
            </div>
          </motion.div>
        </div>
      </ScrollArea>
    </motion.div>
  )
}

// ─── Legend Panel (Compact with icons) ────────────────────────────────────────

