import type { Rule } from 'eslint'

const DEFAULT_MAX_USE_STATE = 3

export const maxUseState: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce maximum useState calls per component (default: 3) for anti-monolith compliance',
      category: 'Best Practices',
      recommended: true,
    },
    messages: {
      maxUseStateExceeded:
        'Component "{{componentName}}" has {{useStateCount}} useState calls, ' +
        'exceeding the maximum of {{maxUseState}}. ' +
        'Extract stateful logic into a custom hook or split the component.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          max: { type: 'number', minimum: 1 },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {}
    const maxUseState = options.max || DEFAULT_MAX_USE_STATE

    let useStateCount = 0
    let currentComponent: string | null = null

    return {
      // Track function components
      FunctionDeclaration(node) {
        currentComponent = node.id?.name || null
        useStateCount = 0
      },

      // Track arrow function components (const MyComp = () => {})
      VariableDeclarator(node) {
        if (
          node.id.type === 'Identifier' &&
          node.init?.type === 'ArrowFunctionExpression'
        ) {
          currentComponent = node.id.name
          useStateCount = 0
        }
      },

      // Count useState calls
      CallExpression(node) {
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'useState'
        ) {
          useStateCount++
        }

        // Also catch React.useState
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.type === 'Identifier' &&
          node.callee.object.name === 'React' &&
          node.callee.property.type === 'Identifier' &&
          node.callee.property.name === 'useState'
        ) {
          useStateCount++
        }
      },

      // Report at end of function body
      'FunctionDeclaration:exit'(node) {
        if (currentComponent && useStateCount > maxUseState) {
          context.report({
            node,
            messageId: 'maxUseStateExceeded',
            data: {
              componentName: currentComponent,
              useStateCount,
              maxUseState,
            },
          })
        }
        currentComponent = null
        useStateCount = 0
      },

      'VariableDeclarator:exit'(node) {
        if (
          node.id.type === 'Identifier' &&
          node.init?.type === 'ArrowFunctionExpression' &&
          currentComponent &&
          useStateCount > maxUseState
        ) {
          context.report({
            node,
            messageId: 'maxUseStateExceeded',
            data: {
              componentName: currentComponent,
              useStateCount,
              maxUseState,
            },
          })
        }
        currentComponent = null
        useStateCount = 0
      },
    }
  },
}
