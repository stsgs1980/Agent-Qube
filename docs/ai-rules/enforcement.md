# ESLint Enforcement Rules

## Plugin: eslint-plugin-stsgs

### no-cross-layer-imports
**Severity: error**
Detects and blocks upward layer imports.
Example violation: `ui/Button.tsx` importing from `features/SearchPanel.tsx`

### max-lines
**Severity: warning**
Max 200 lines per file (configurable).
Exclude patterns: `*.test.tsx`, `*.stories.tsx`

### max-use-state
**Severity: warning**
Max 3 `useState` calls per component (configurable).
Suggests extracting into custom hooks.

## Configuration

```javascript
// .eslintrc.js
import stsgs from 'eslint-plugin-stsgs'

export default [
  {
    plugins: { stsgs },
    rules: {
      'stsgs/no-cross-layer-imports': 'error',
      'stsgs/max-lines': ['warn', { max: 200, excludePatterns: ['.test.', '.stories.'] }],
      'stsgs/max-use-state': ['warn', { max: 3 }],
    },
  },
]
```
