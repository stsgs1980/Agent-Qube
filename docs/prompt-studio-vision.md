# Prompt Studio -- Design Document

> Agent Qube feature: interactive prompt engineering workspace
> Created: 2026-05-15
> Author: Z.ai + stsgs1980

---

## 1. Vision

Prompt Studio is the "brain" of Agent Qube -- the interface where you:

1. **Write a task** in natural language (RU/EN)
2. **See how the system thinks** -- intent detection, formula selection, agent assignment
3. **Learn prompt engineering** by observing which prompts produce which system responses
4. **Execute workflows** -- from prompt to real agent pipeline

This is NOT a chatbot. This is a **training ground + control panel** for semi-autonomous agent orchestration.

---

## 2. Current Assets (already built, not connected)

### 2.1 @stsgs/prompting Library (src/lib/prompting/)

| Module | Files | What it does |
|--------|-------|-------------|
| core/types.ts | 30+ types | PromptRequest, IntentType, CognitiveFormula, OrchestrationPattern... |
| core/techniques.ts | 20 techniques | Few-shot, Chain-of-Thought, Role Play, Self-Consistency... |
| core/frameworks.ts | 11 frameworks | CoT, ReAct, ToT, GoT, ReWOO, Reflexion, MoA... |
| core/system-prompt.ts | 5-layer architect | Identity -> Context -> Constraints -> Output -> Behavior |
| templates/intent-templates.ts | 12 intents + matchIntent() | analyze, debug, generate, review, explain... (EN+RU) |
| templates/agent-templates.ts | 12 agent roles + getBestAgentForIntent() | Strategist, Analyst, Coder, Reviewer... |
| templates/flow-templates.ts | 8 flow patterns | linear, parallel, feedback loop, debate... |
| agents/cognitive-formulas.ts | 20 formulas | Anchoring Break, Pre-Mortem, Inversion, SCAMPER... |
| agents/orchestration.ts | 12 patterns | sequential, map-reduce, debate, round-robin... |
| agents/resilience.ts | retry + CircuitBreaker | withRetry(), withTimeout(), CircuitBreaker class |
| evaluation/scoring.ts | 6-dimension scoring | Clarity, Specificity, Structure, Context, Constraints, Output |
| evaluation/blind-compare.ts | A/B comparison | blindCompare(promptA, promptB) |
| evaluation/benchmark.ts | 40-check audit | CORE-EEAT benchmark |

### 2.2 Agent Qube Agents (26 in DB)

8 groups x 20 cognitive formulas x 6 action types = fully operational pipeline system.

### 2.3 API Routes

- POST /api/prompting -- already exists (interpret + route)
- POST /api/workflows/execute -- simulate pipeline execution
- POST /api/workflows/execute-llm -- LLM execution (stub)
- GET /api/agents -- all agents
- GET /api/workflows -- all workflows

---

## 3. Architecture

```
User Input (natural language)
     |
     v
[Intent Detector] -- matchIntent() from @stsgs/prompting
     |
     v
[Formula Selector] -- which cognitive formula fits this intent?
     |
     v
[Agent Mapper] -- which agents from Agent Qube DB handle this?
     |
     v
[Workflow Builder] -- auto-generate PipelineSteps from the above
     |
     v
[Execution Engine] -- simulate or call LLM
     |
     v
[Result Display] -- show what happened, why, and how to improve
```

---

## 4. UI Design

### 4.1 Layout

Prompt Studio is a **4th view** alongside Dashboard, Hierarchy, Workflows:

```
[Dashboard] [Hierarchy] [Workflows] [Prompt Studio]
```

### 4.2 Prompt Studio Screen

```
+-----------------------------------------------+
| Agent Qube  > Prompt Studio              [LIVE]     |
+-----------------------------------------------+
|                                                 |
| +-------------------------------------------+  |
| | Write your task...                         |  |
| |                                            |  |
| | e.g. "Proanalisiruy kod i najdi bashi"    |  |
| +-------------------------------------------+  |
| [Analyze] [Clear]                    [History]  |
|                                                 |
| ── System Analysis ─────────────────────────── |
|                                                 |
| Intent: debugging (87%)                         |
| + data-analysis (45%) + code-review (32%)       |
|                                                 |
| Formula: ReAct (reason+act loop)               |
| Why: debugging needs iterative exploration       |
|                                                 |
| Agents:                                         |
| [Analyst] -> [Coder] -> [Tester] -> [Reviewer] |
|  Strategy    Execution   Execution    Control   |
|                                                 |
| ── Generated Pipeline ──────────────────────── |
|                                                 |
| Step 1: Diagnose (Analyst, ReAct)              |
| Step 2: Investigate (Coder, process)           |
| Step 3: Verify Fix (Tester, review)            |
| Step 4: Approve (Reviewer, decision)           |
|                                                 |
| [Execute Simulation]  [Execute with LLM]       |
|                                                 |
| ── Execution Result ────────────────────────── |
| (shows after execution)                         |
|                                                 |
+-----------------------------------------------+
```

### 4.3 Sections

1. **Input Area** -- textarea with placeholder examples (RU/EN)
2. **System Analysis** -- shows what the system detected:
   - Intent bar chart (top 3 with confidence %)
   - Formula recommendation with explanation
   - Agent chain visualization (horizontal flow)
3. **Generated Pipeline** -- auto-built PipelineSteps
   - Editable: can change agent, formula, action per step
   - Can add/remove/reorder steps
4. **Execution** -- two modes:
   - **Simulate**: uses simulateStepExecution() (instant, no LLM)
   - **With LLM**: calls /api/workflows/execute-llm (real AI)
5. **Result Panel** -- shows:
   - Step-by-step execution log
   - AgentMessages between steps
   - Feedback loops (if any)
   - Score/evaluation of the prompt quality

---

## 5. Implementation Phases

### Phase A: Core (this session)
- Add "Prompt Studio" tab to page.tsx
- Build PromptStudio component (input + analysis display)
- Connect to matchIntent() and getBestAgentForIntent()
- Add API route for prompt analysis (enhanced /api/prompting)
- Show generated pipeline steps

### Phase B: Execution (next session)
- Connect to /api/workflows/execute for simulation
- Show step-by-step execution results
- AgentMessage visualization
- LLM execution mode

### Phase C: Learning (future)
- Prompt quality scoring (scorePrompt from evaluation/)
- Side-by-side comparison (blindCompare)
- History of past prompts with scores
- Tips and suggestions for improvement

---

## 6. Design Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Where to put | 4th tab alongside Dashboard/Hierarchy/Workflows | Same UX pattern, no new routes |
| Intent detection | Client-side first (matchIntent), API for LLM enhancement | Fast feedback, no network latency for basic analysis |
| Pipeline generation | Auto from intent+formula+agents, editable | User learns by seeing what system suggests, then tweaking |
| Execution modes | Simulate vs LLM | Simulate is instant and free, LLM is real but costs tokens |
| Language | RU+EN in intent templates | User writes in both, system detects both |
| Scoring | 6 dimensions from evaluation/scoring.ts | More useful than single score |

---

## 7. Files to Create/Modify

### New Files
- `src/components/prompt-studio/prompt-studio.tsx` -- main component
- `src/components/prompt-studio/intent-display.tsx` -- intent detection results
- `src/components/prompt-studio/pipeline-preview.tsx` -- generated pipeline steps
- `src/components/prompt-studio/execution-result.tsx` -- execution log
- `src/hooks/use-prompt-analysis.ts` -- hook for prompt analysis state

### Modified Files
- `src/app/page.tsx` -- add 4th tab "Prompt Studio"
- `src/app/api/prompting/route.ts` -- enhance with agent mapping + pipeline generation

---

## 8. Success Criteria

- [ ] User types a task in RU or EN
- [ ] System shows detected intent with confidence %
- [ ] System shows recommended cognitive formula with explanation
- [ ] System maps Agent Qube agents to steps
- [ ] User can see the auto-generated pipeline
- [ ] User can simulate execution and see step results
- [ ] Everything is documented in worklog after each step
