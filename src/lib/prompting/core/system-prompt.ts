/**
 * @stsgs/prompting -- System Prompt Architect
 * 5-layer system prompt construction engine.
 * Each layer is independent, composable, and weighted.
 */

import type { PromptBlock, SystemPromptLayer, PromptContext } from './types'

// ─── Layer Templates ─────────────────────────────────────────

const identityTemplate = (ctx: PromptContext) =>
  `You are ${ctx.role}, an expert in ${ctx.domain} with deep knowledge of ` +
  `industry best practices, current trends, and common pitfalls. ` +
  `You communicate in ${ctx.tone} ${ctx.language} and specialize in ` +
  `creating solutions for ${ctx.audience} audiences.`

const contextTemplate = (ctx: PromptContext) =>
  `## Environment\n` +
  `- Domain: ${ctx.domain}\n` +
  `- Target audience: ${ctx.audience}\n` +
  `- Language: ${ctx.language}\n` +
  `- Available tools: ${ctx.constraints.length > 0 ? ctx.constraints.join(', ') : 'standard development tools'}\n` +
  `## Project Context\n` +
  `This is a ${ctx.domain} project using modern ${ctx.language} development practices. ` +
  `All outputs must be production-ready and follow established patterns.`

const constraintsTemplate = (ctx: PromptContext) => {
  const rules = ctx.constraints.map((c, i) => `${i + 1}. ${c}`)
  return `## Rules\n${rules.join('\n')}\n\n` +
    `## Forbidden\n` +
    `- Do not use placeholder values (use null or explicit defaults)\n` +
    `- Do not add explanations outside the requested format\n` +
    `- Do not use Unicode emoji or special characters in output\n` +
    `- Do not omit any required fields from the output format`
}

const outputTemplate = (ctx: PromptContext) => {
  const formatMap: Record<string, string> = {
    json: `Return ONLY valid JSON. No markdown, no explanation, no code fences.`,
    markdown: `Return well-structured Markdown. Use headers (##), lists, tables, and code blocks.`,
    'plain-text': `Return plain text. No formatting, no markdown, no code blocks.`,
    code: `Return executable code. Include imports, type definitions, and error handling.`,
    html: `Return semantic HTML. Use proper tags, ARIA attributes, and accessible markup.`,
    yaml: `Return valid YAML. Use proper indentation and follow YAML best practices.`,
    table: `Return data as a formatted table with clear headers and aligned columns.`,
    list: `Return a structured list with clear hierarchy and consistent formatting.`,
    conversation: `Return a natural conversation response. Match the tone and language of the user.`,
  }
  return `## Output Format\n${formatMap[ctx.outputFormat] ?? 'Return the response in the requested format.'}`
}

const behaviorTemplate = (ctx: PromptContext) => {
  const toneMap: Record<string, string> = {
    professional: 'Communicate in a clear, business-professional manner. Use precise language and avoid jargon unless the audience expects it.',
    casual: 'Communicate in a friendly, approachable manner. Use conversational language while maintaining accuracy.',
    technical: 'Communicate with technical precision. Use correct terminology and provide implementation-level details.',
    creative: 'Communicate with creativity and originality. Think beyond obvious solutions and propose innovative approaches.',
    authoritative: 'Communicate with confidence and expertise. Make clear recommendations backed by reasoning and experience.',
    empathetic: 'Communicate with understanding and care. Acknowledge the user perspective and address concerns proactively.',
    neutral: 'Communicate objectively and factually. Present information without bias or unnecessary editorializing.',
  }
  return `## Behavior\n${toneMap[ctx.tone] ?? 'Respond clearly and helpfully.'}\n\n` +
    `## Quality Standards\n` +
    `- Every claim should be backed by evidence or reasoning\n` +
    `- Prefer concrete examples over abstract descriptions\n` +
    `- When uncertain, state the uncertainty and suggest how to resolve it\n` +
    `- Prioritize correctness over completeness`
}

// ─── Layer Configuration ─────────────────────────────────────

interface LayerConfig {
  layer: SystemPromptLayer
  template: (ctx: PromptContext) => string
  defaultWeight: number
  optional: boolean
}

const LAYERS: LayerConfig[] = [
  { layer: 'identity', template: identityTemplate, defaultWeight: 0.9, optional: false },
  { layer: 'context', template: contextTemplate, defaultWeight: 0.7, optional: false },
  { layer: 'constraints', template: constraintsTemplate, defaultWeight: 1.0, optional: false },
  { layer: 'output', template: outputTemplate, defaultWeight: 0.95, optional: false },
  { layer: 'behavior', template: behaviorTemplate, defaultWeight: 0.6, optional: true },
]

// ─── Public API ──────────────────────────────────────────────

/**
 * Build a complete system prompt from a PromptContext.
 * All 5 layers are composed in order: identity, context, constraints, output, behavior.
 */
export function buildSystemPrompt(ctx: PromptContext): string {
  return buildSystemPromptCustom(ctx, LAYERS.map(l => ({ layer: l.layer })))
}

/**
 * Build a system prompt with custom layer selection and weights.
 * @param ctx - The prompt context
 * @param layers - Array of {layer, weight?} to include (in order)
 */
export function buildSystemPromptCustom(
  ctx: PromptContext,
  layers: Array<{ layer: SystemPromptLayer; weight?: number }>
): string {
  return layers
    .map(({ layer, weight }) => {
      const config = LAYERS.find(l => l.layer === layer)
      if (!config) return null
      const block: PromptBlock = {
        layer,
        content: config.template(ctx),
        weight: weight ?? config.defaultWeight,
        optional: config.optional,
      }
      return block
    })
    .filter(Boolean)
    .map((block: PromptBlock | null) => {
      if (!block) return ''
      const header = `<!-- Layer: ${block.layer} (weight: ${block.weight}) -->`
      return `${header}\n${block.content}`
    })
    .join('\n\n')
}

/**
 * Build individual prompt blocks for manual composition.
 * Returns an array of PromptBlock objects that can be selectively composed.
 */
export function buildPromptBlocks(ctx: PromptContext): PromptBlock[] {
  return LAYERS.map(config => ({
    layer: config.layer,
    content: config.template(ctx),
    weight: config.defaultWeight,
    optional: config.optional,
  }))
}

/**
 * Compose already-built prompt blocks into a single string.
 * Blocks are joined in order, filtered by minimum weight threshold.
 */
export function composeBlocks(blocks: PromptBlock[], minWeight: number = 0): string {
  return blocks
    .filter(b => b.weight >= minWeight)
    .map(b => b.content)
    .join('\n\n')
}

/**
 * Create a minimal system prompt (identity + output only).
 * Useful for simple, direct tasks where context and constraints add noise.
 */
export function buildMinimalSystemPrompt(role: string, outputFormat: PromptContext['outputFormat']): string {
  return buildSystemPromptCustom(
    { role, domain: 'general', audience: 'developer', tone: 'neutral', language: 'English', constraints: [], outputFormat },
    [{ layer: 'identity' }, { layer: 'output' }]
  )
}

/**
 * Validate a PromptContext has all required fields.
 * Returns an array of validation error messages (empty if valid).
 */
export function validateContext(ctx: Partial<PromptContext>): string[] {
  const errors: string[] = []
  if (!ctx.role?.trim()) errors.push('role is required')
  if (!ctx.outputFormat) errors.push('outputFormat is required')
  if (ctx.constraints && !Array.isArray(ctx.constraints)) errors.push('constraints must be an array')
  return errors
}
