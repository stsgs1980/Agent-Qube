'use client'
import React, { useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { fetchWithRetry } from '@/lib/client-fetch'
import { ROLE_ORDER } from './types'

export function AgentCreationDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [roleGroup, setRoleGroupVal] = useState(ROLE_ORDER[0])
  const [status, setStatusVal] = useState('active')
  const [formula, setFormula] = useState('ReAct')
  const [skills, setSkillsStr] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = useCallback(async () => {
    if (!name.trim() || !role.trim()) return
    setSubmitting(true)
    try {
      const res = await fetchWithRetry('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          role: role.trim(),
          roleGroup,
          status,
          formula,
          skills: skills.trim(),
          description: `${role.trim()} agent`,
          avatar: 'brain',
        }),
      })
      if (!res.ok) throw new Error('Failed to create agent')
      toast.success(`Agent ${name.trim()} created successfully`)
      setName('')
      setRole('')
      setSkillsStr('')
      setOpen(false)
      onCreated()
    } catch {
      toast.error('Failed to create agent')
    } finally {
      setSubmitting(false)
    }
  }, [name, role, roleGroup, status, formula, skills, onCreated])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-[#B0B0B0] hover:text-white"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-sm"
        style={{
          background: 'rgba(26, 26, 26, 0.95)',
          border: '1px solid rgba(51,51,51,0.5)',
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-white">Create Agent</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <div>
            <label className="text-[#B0B0B0] text-[10px] uppercase tracking-wider font-semibold mb-1 block">Name</label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Agent name"
              className="bg-white/5 border-white/10 text-white text-xs"
            />
          </div>
          <div>
            <label className="text-[#B0B0B0] text-[10px] uppercase tracking-wider font-semibold mb-1 block">Role</label>
            <Input
              value={role}
              onChange={e => setRole(e.target.value)}
              placeholder="Agent role"
              className="bg-white/5 border-white/10 text-white text-xs"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[#B0B0B0] text-[10px] uppercase tracking-wider font-semibold mb-1 block">Group</label>
              <Select value={roleGroup} onValueChange={setRoleGroupVal}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white text-xs h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent style={{ background: 'rgba(26, 26, 26, 0.95)' }}>
                  {ROLE_ORDER.map(g => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[#B0B0B0] text-[10px] uppercase tracking-wider font-semibold mb-1 block">Status</label>
              <Select value={status} onValueChange={setStatusVal}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white text-xs h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent style={{ background: 'rgba(26, 26, 26, 0.95)' }}>
                  {['active', 'idle', 'error', 'offline'].map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-[#B0B0B0] text-[10px] uppercase tracking-wider font-semibold mb-1 block">Formula</label>
              <Select value={formula} onValueChange={setFormula}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white text-xs h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent style={{ background: 'rgba(26, 26, 26, 0.95)' }}>
                  {['CoT', 'ToT', 'GoT', 'AoT', 'SoT', 'CoVe', 'ReWOO', 'Reflexion', 'ReAct', 'MoA', 'SelfRefine', 'LATS', 'SelfConsistency', 'PoT', 'DSPy', 'PromptChaining', 'LeastToMost', 'StepBack', 'PlanAndSolve', 'MetaCoT'].map(f => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-[#B0B0B0] text-[10px] uppercase tracking-wider font-semibold mb-1 block">Skills (comma-separated)</label>
            <Input
              value={skills}
              onChange={e => setSkillsStr(e.target.value)}
              placeholder="skill1,skill2,skill3"
              className="bg-white/5 border-white/10 text-white text-xs"
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !name.trim() || !role.trim()}
            className="w-full bg-[#06B6D4] hover:bg-[#0891B2] text-white text-xs gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            {submitting ? 'Creating...' : 'Create Agent'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Keyboard Shortcuts Dialog ────────────────────────────────────────────────

