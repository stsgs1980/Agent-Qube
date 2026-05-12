import type { Rule } from 'eslint'

const DEFAULT_MAX_LINES = 200

export const maxLines: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce maximum file line count (default: 200) for anti-monolith compliance',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      maxLinesExceeded:
        'File has {{lineCount}} lines, exceeding the maximum of {{maxLines}}. ' +
        'Split this file into smaller modules following anti-monolith rules.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          max: { type: 'number', minimum: 1 },
          excludePatterns: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {}
    const maxLines = options.max || DEFAULT_MAX_LINES
    const excludePatterns: string[] = options.excludePatterns || []

    const filename = context.filename

    // Skip excluded patterns
    if (excludePatterns.some((pattern) => filename.includes(pattern))) {
      return {}
    }

    return {
      Program(node) {
        const sourceCode = context.sourceCode ?? context.getSourceCode()
        const lines = sourceCode.getText().split('\n')
        const lineCount = lines.length

        if (lineCount > maxLines) {
          context.report({
            node,
            messageId: 'maxLinesExceeded',
            data: {
              lineCount,
              maxLines,
            },
          })
        }
      },
    }
  },
}
