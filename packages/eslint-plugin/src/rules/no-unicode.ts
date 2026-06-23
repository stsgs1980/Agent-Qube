/**
 * no-unicode.ts — ESLint rule: No-Unicode Policy v2.1
 *
 * Prohibits emoji and Unicode graphic characters in:
 * - Source code and UI text [C] Critical
 * - Template literals [C]
 * - JSX text [C]
 *
 * Based on: standards/No-Unicode_Policy_v2.1.md
 */

import type { Rule } from 'eslint'

// Unicode ranges for emoji and graphic characters
const EMOJI_PATTERN =
  /[\u{1F000}-\u{1FFFF}]|[\u{2600}-\u{27BF}]|[\u{FE00}-\u{FEFF}]|[\u{1F900}-\u{1F9FF}]|[\u{2702}-\u{27B0}]|[\u{2B50}]|[\u{25AA}-\u{25FE}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce No-Unicode Policy — no emoji or Unicode graphic characters in source code',
    },
    messages: {
      noUnicodeLiteral: 'Unicode graphic character prohibited in string literal. Use SVG icon instead.',
      noUnicodeTemplate: 'Unicode graphic character prohibited in template literal. Use SVG icon instead.',
      noUnicodeJSX: 'Unicode graphic character prohibited in JSX. Use SVG icon instead.',
    },
  },
  create(context: Rule.RuleContext) {
    return {
      Literal(node) {
        if (typeof node.value === 'string' && EMOJI_PATTERN.test(node.value)) {
          context.report({
            node,
            messageId: 'noUnicodeLiteral',
          })
        }
      },
      TemplateLiteral(node) {
        for (const quasi of node.quasis) {
          if (quasi.value.cooked && EMOJI_PATTERN.test(quasi.value.cooked)) {
            context.report({
              node,
              messageId: 'noUnicodeTemplate',
            })
            break
          }
        }
      },
      JSXText(node) {
        if (EMOJI_PATTERN.test(node.value)) {
          context.report({
            node,
            messageId: 'noUnicodeJSX',
          })
        }
      },
    }
  },
}

export { rule as noUnicode }
