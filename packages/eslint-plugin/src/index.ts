import { noCrossLayerImports } from './rules/no-cross-layer-imports'
import { maxLines } from './rules/max-lines'
import { maxUseState } from './rules/max-use-state'
import { noUnicode } from './rules/no-unicode'

/**
 * ESLint plugin for @stsgs/ui anti-monolith rules
 *
 * Enforces:
 * 1. No cross-layer imports (dependency direction: tokens->ui->sections->features->hooks->providers)
 * 2. Max lines per file (200)
 * 3. Max useState per component (3)
 * 4. No Unicode/emoji in source code (No-Unicode Policy v2.1)
 */
export const plugin = {
  meta: {
    name: 'eslint-plugin-stsgs',
    version: '0.2.0',
  },
  rules: {
    'no-cross-layer-imports': noCrossLayerImports,
    'max-lines': maxLines,
    'max-use-state': maxUseState,
    'no-unicode': noUnicode,
  },
}

export default plugin

// Named exports for programmatic usage
export { noCrossLayerImports } from './rules/no-cross-layer-imports'
export { maxLines } from './rules/max-lines'
export { maxUseState } from './rules/max-use-state'
export { noUnicode } from './rules/no-unicode'
