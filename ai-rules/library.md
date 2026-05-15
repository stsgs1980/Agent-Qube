# @stsgs/ui Library Rules

## Component Quality Checklist

Every component in @stsgs/ui must pass these checks:

- [ ] Has TypeScript interface for all props (no `any`)
- [ ] Has JSDoc comment describing the component
- [ ] Uses `cn()` for className merging
- [ ] Follows the correct layer (ui = no state, sections = no state, features = has state)
- [ ] Has barrel export in `index.ts`
- [ ] File ≤ 200 lines (components ≤ 150 lines)
- [ ] No inline styles (use Tailwind CSS classes only)
- [ ] Supports `className` prop for customization
- [ ] Uses `forwardRef` where DOM access may be needed
- [ ] Accessible: proper ARIA attributes, keyboard navigation

## Adding New Components

1. Check `npx stsgs list <layer>` — does it already exist?
2. Create file in the correct layer directory
3. Add proper TypeScript props interface
4. Add JSDoc comment
5. Add barrel export
6. Run `npx stsgs scan` to verify
7. Test with `eslint-plugin-stsgs`

## Collections

Collections are pre-packaged sets of features for common use cases:

| Collection | Features | Components |
|-----------|----------|------------|
| Dashboard Kit | features/dashboard | ~18 components |
| Auth Pages | features/auth | ~8 components |
| Landing Page | features/landing | ~14 components |
| Chat UI | features/chat | ~6 components |

Install a collection: `npx stsgs add @dashboard-kit`
