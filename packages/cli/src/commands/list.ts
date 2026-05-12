/**
 * stsgs list [layer] — List available components in @stsgs/ui
 */

import type { Command } from 'commander'

export async function listCommand(
  layer?: string,
  options?: { tag?: string }
) {
  const { default: chalk } = await import('chalk')

  const layers: Record<string, { count: string; components: string[] }> = {
    tokens: {
      count: '5',
      components: ['cn()', 'tokens', 'DesignTokens (type)', 'colors', 'spacing'],
    },
    ui: {
      count: '~50',
      components: [
        'Button', 'Badge', 'Card', 'Dialog', 'Input', 'Sheet',
        'Select', 'Dropdown', 'Tabs', 'Tooltip', 'Switch', 'Checkbox',
        'Label', 'Separator', 'Avatar', 'ScrollArea', 'Accordion',
        'Popover', 'Toast', 'Command', 'Table', 'Skeleton',
        'Alert', 'Progress', 'Textarea', 'Calendar', 'Combobox',
      ],
    },
    sections: {
      count: '~100',
      components: [
        'HeroSection', 'FeaturesSection', 'PricingSection',
        'NavbarSection', 'FooterSection', 'CTASection',
        'TestimonialsSection', 'FAQSection', 'StatsSection',
        'HowItWorksSection', 'TeamSection', 'BlogSection',
        'ContactSection', 'SidebarSection',
      ],
    },
    features: {
      count: '~50',
      components: [
        'SearchPanel', 'ThemeToggle', 'CommandPalette',
        'UserAuthForm', 'FlowCanvas', 'DataTable',
        'NotificationPanel', 'ChartSection', 'FilterPanel',
      ],
    },
    hooks: {
      count: '~8',
      components: [
        'useTheme', 'useMediaQuery', 'useLocalStorage',
        'useDebounce', 'useClickOutside', 'useKeyboard',
        'useIntersectionObserver', 'useCopyToClipboard',
      ],
    },
    providers: {
      count: '~4',
      components: [
        'ThemeProvider', 'ErrorBoundary', 'ToastProvider', 'QueryProvider',
      ],
    },
  }

  if (layer && layers[layer]) {
    console.log(chalk.bold(`\n@stsgs/ui/${layer} (${layers[layer].count} components):\n`))
    layers[layer].components.forEach((comp) => {
      console.log(`  ${chalk.cyan('●')} ${comp}`)
    })
    console.log()
    return
  }

  // Show all layers
  console.log(chalk.bold('\n@stsgs/ui — Foundation Component Library\n'))
  console.log(chalk.dim('  6 layers, 290 components, one-directional dependencies\n'))

  for (const [name, data] of Object.entries(layers)) {
    const preview = data.components.slice(0, 5).join(', ')
    const more = data.components.length > 5 ? ` +${data.components.length - 5} more` : ''
    console.log(`  ${chalk.bold(name)}/ ${chalk.dim(`(${data.count})`)}  ${chalk.gray(preview)}${chalk.dim(more)}`)
  }

  console.log(chalk.dim('\n  Use `stsgs list <layer>` to see full list'))
  console.log(chalk.dim('  Use `stsgs add <component>` to add to project\n'))
}
