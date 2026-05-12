import { defineConfig } from 'tsup'

const layers = ['tokens', 'ui', 'sections', 'features', 'hooks', 'providers']

const external = [
  'react',
  'react-dom',
  'react/jsx-runtime',
  // Radix UI
  '@radix-ui/react-accordion',
  '@radix-ui/react-alert-dialog',
  '@radix-ui/react-aspect-ratio',
  '@radix-ui/react-avatar',
  '@radix-ui/react-checkbox',
  '@radix-ui/react-collapsible',
  '@radix-ui/react-context-menu',
  '@radix-ui/react-dialog',
  '@radix-ui/react-dropdown-menu',
  '@radix-ui/react-hover-card',
  '@radix-ui/react-label',
  '@radix-ui/react-menubar',
  '@radix-ui/react-navigation-menu',
  '@radix-ui/react-popover',
  '@radix-ui/react-progress',
  '@radix-ui/react-radio-group',
  '@radix-ui/react-scroll-area',
  '@radix-ui/react-select',
  '@radix-ui/react-separator',
  '@radix-ui/react-slider',
  '@radix-ui/react-slot',
  '@radix-ui/react-switch',
  '@radix-ui/react-tabs',
  '@radix-ui/react-toast',
  '@radix-ui/react-toggle',
  '@radix-ui/react-toggle-group',
  '@radix-ui/react-tooltip',
  // Other deps
  'class-variance-authority',
  'clsx',
  'tailwind-merge',
  'cmdk',
  'embla-carousel-react',
  'lucide-react',
  'next-themes',
  'react-day-picker',
  'react-hook-form',
  'react-resizable-panels',
  'recharts',
  'sonner',
  'vaul',
]

export default defineConfig([
  // Root barrel export
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    sourcemap: true,
    minify: false,
    external,
  },
  // Each layer as separate export
  ...layers.map((layer) => ({
    entry: [`src/${layer}/index.ts`],
    format: ['esm', 'cjs'] as const,
    dts: true,
    sourcemap: true,
    minify: false,
    external,
    outDir: `dist/${layer}`,
  })),
])
