# Z.ai (ZCode) Tool Mapping

Skills use Claude Code tool names. When you encounter these in a skill, use the Z.ai equivalent:

| Skill references | Z.ai equivalent |
|-----------------|-----------------|
| `Read` (file reading) | `Read` — identical name, same behavior |
| `Write` (file creation) | `Write` — identical name, same behavior |
| `Edit` (file editing) | `Edit` — identical name, same behavior |
| `MultiEdit` (batch edits) | `MultiEdit` — identical name, same behavior |
| `Bash` (run commands) | `Bash` — identical name, same behavior. **Note:** `run_in_background: true` is NOT supported. All commands run synchronously. |
| `Grep` (search file content) | `Grep` — identical name, same behavior (built on ripgrep) |
| `Glob` (search files by name) | `Glob` — identical name, same behavior |
| `LS` (list directory) | `LS` — Z.ai-specific tool. Lists files and directories. Not available in Claude Code. |
| `Skill` tool (invoke a skill) | `Skill` — use `Skill(command="skill-name")` with the skill name only (no arguments) |
| `Task` tool (dispatch subagent) | `Task` — use with `subagent_type` parameter: `"general-purpose"`, `"Explore"`, `"Plan"`, `"frontend-styling-expert"`, `"full-stack-developer"`, `"ppt-expert"` |
| Multiple `Task` calls (parallel) | Multiple `Task` calls in a single message |
| `TodoWrite` (task tracking) | `TodoWrite` — identical name, same behavior |
| `TodoRead` (read tasks) | `TodoRead` — identical name, same behavior |
| `WebFetch` | `Skill(command="web-reader")` — web page content extraction |
| `WebSearch` | `Skill(command="web-search")` — web search |
| `EnterPlanMode` / `ExitPlanMode` | **No equivalent.** Z.ai has no plan mode toggle. Use brainstorming/writing-plans skills directly. |
| `AskUserQuestion` | `AskUserQuestion` — Z.ai-specific tool for batched clarification questions |
| `Outline` | `Outline` — Z.ai-specific tool for document structure planning |
| `Complete` | `Complete` — Z.ai-specific tool to finalize web dev projects |

## Subagent Dispatch

Claude Code skills reference `Task tool (general-purpose)` syntax. In Z.ai, use the `Task` tool with named parameters:

**Claude Code syntax (in skills):**
```text
Task tool (general-purpose):
  description: "..."
  prompt: |
    ...
```text

**Z.ai equivalent:**
```text
Task(
  subagent_type: "general-purpose",
  description: "...",
  prompt: """..."""
)
```text

Available `subagent_type` values in Z.ai:
- `"general-purpose"` — General research and multi-step tasks
- `"Explore"` — Fast codebase exploration and file search
- `"Plan"` — Software architecture planning
- `"frontend-styling-expert"` — CSS, UI/UX, layout, animations
- `"full-stack-developer"` — Full Next.js development
- `"ppt-expert"` — Slide presentations

## Web Capabilities

Web search and page reading are Skills in Z.ai, not built-in tools. Invoke them before use:

```text
Skill(command="web-search")   -- loads web search instructions
Skill(command="web-reader")   -- loads web page extraction instructions
```markdown

## Missing Capabilities

| Claude Code Feature | Z.ai Status | Workaround |
|---------------------|-------------|------------|
| `run_in_background: true` on Bash | Not supported | Run commands synchronously; for long processes, set longer timeout (up to 600000ms) |
| `EnterPlanMode` / `ExitPlanMode` | Not available | Use brainstorming skill for design exploration, writing-plans for implementation planning |
| Persistent shell sessions | Not available | Each Bash call is a new shell session |
| `read_agent` / `list_agents` | Not available | Task tool returns results directly when agent completes |

## GLM Model Considerations

Z.ai runs GLM models which differ from Claude in important ways:

1. **Instruction following**: GLM is more obedient to explicit instructions but worse at complex conditional logic. Prefer simple, direct instructions over nested conditionals.

2. **Context window**: GLM may have a smaller effective context window. The condensed skill versions (in `references/glm-condensed/`) are optimized for this.

3. **Graphviz diagrams**: GLM may struggle with complex dot syntax. The condensed versions replace Graphviz with simpler text-based flow descriptions.

4. **Tool calls**: GLM supports parallel tool calls in a single message. Skills that say "do X then Y" can often be parallelized if there are no dependencies.