import type { Rule } from 'eslint'

/**
 * Layer hierarchy: lower index = lower layer (can only import from same or lower)
 * tokens(0) → ui(1) → sections(2) → features(3) → hooks(4) → providers(5)
 */
const LAYERS = ['tokens', 'ui', 'sections', 'features', 'hooks', 'providers'] as const
type Layer = (typeof LAYERS)[number]

const LAYER_INDEX: Record<Layer, number> = {
  tokens: 0,
  ui: 1,
  sections: 2,
  features: 3,
  hooks: 4,
  providers: 5,
}

/** Detect which layer a file belongs to based on its path */
function detectLayer(filePath: string): Layer | null {
  const normalized = filePath.replace(/\\/g, '/')
  for (const layer of LAYERS) {
    // Match patterns like /ui/Button.tsx, /ui/index.ts, @stsgs/ui/ui/Button
    if (
      normalized.includes(`/${layer}/`) ||
      normalized.includes(`/${layer}"`) ||
      normalized.includes(`/stsgs/ui/${layer}`)
    ) {
      return layer
    }
  }
  return null
}

/** Detect target layer from an import path */
function detectImportLayer(importPath: string): Layer | null {
  // Direct layer import: @stsgs/ui/sections, @stsgs/ui/features
  const directMatch = importPath.match(/@stsgs\/ui\/(\w+)/)
  if (directMatch) {
    const layer = directMatch[1] as Layer
    if (LAYERS.includes(layer)) return layer
  }

  // Relative import: ../ui/Button, ./sections/HeroSection
  const relMatch = importPath.match(/(?:\.\.\/)*(\w+)\//)
  if (relMatch) {
    const layer = relMatch[1] as Layer
    if (LAYERS.includes(layer)) return layer
  }

  return null
}

export const noCrossLayerImports: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce one-directional layer dependencies in @stsgs/ui',
      category: 'Architecture',
      recommended: true,
    },
    messages: {
      crossLayerImport:
        'Cross-layer import detected: "{{fileLayer}}" imports from "{{importLayer}}". ' +
        'Dependencies must flow downward: tokens → ui → sections → features → hooks → providers. ' +
        '{{fileLayer}} (layer {{fileIndex}}) cannot import from {{importLayer}} (layer {{importIndex}}).',
    },
    schema: [],
  },

  create(context) {
    const fileLayer = detectLayer(context.filename)

    // Only check files within the @stsgs/ui layer structure
    if (!fileLayer) return {}

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value as string
        const importLayer = detectImportLayer(importPath)

        if (!importLayer) return

        const fileIndex = LAYER_INDEX[fileLayer]
        const importIndex = LAYER_INDEX[importLayer]

        // Upward import: file imports from a higher layer (forbidden)
        if (importIndex > fileIndex) {
          context.report({
            node: node.source,
            messageId: 'crossLayerImport',
            data: {
              fileLayer,
              importLayer,
              fileIndex,
              importIndex,
            },
          })
        }
      },
    }
  },
}
