# Dispatching Parallel Agents (GLM Condensed)

When you have 2+ independent problems, dispatch one agent per problem domain in parallel.

## When to Use

- Multiple test files failing with different root causes
- Multiple independent subsystems broken
- No shared state between investigations

## When NOT to Use

- Failures are related (fixing one might fix others)
- Need full system context
- Agents would edit the same files

## Pattern

1. Group failures by problem domain
2. Create focused prompt for each agent (specific scope, clear goal, constraints, expected output)
3. Dispatch all agents in a single message (parallel)
4. Review each result
5. Check for conflicts
6. Run full test suite
7. Integrate changes

## Agent Prompt Rules

- Focused: one clear problem domain
- Self-contained: all context included
- Specific about output: what should the agent return?
- With constraints: "do NOT change other code"