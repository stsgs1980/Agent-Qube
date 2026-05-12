/**
 * stsgs add <component> — Add a component from @stsgs/ui to the project
 *
 * Behavior:
 * - If component exists in @stsgs/ui → copy to project
 * - If component is a collection (e.g., @dashboard-kit) → install all components
 * - Checks for existing components to prevent duplicates
 */

import type { Command } from 'commander'

export async function addCommand(
  component: string,
  options: { layer?: string; dir?: string }
) {
  const { default: chalk } = await import('chalk')
  const { default: ora } = await import('ora')

  const spinner = ora(`Looking up ${component}...`).start()

  try {
    // Check if it's a collection
    if (component.startsWith('@')) {
      const collectionName = component.slice(1)
      spinner.text = `Installing collection: ${collectionName}...`
      await installCollection(collectionName, options)
      spinner.succeed(chalk.green(`Collection @${collectionName} installed!`))
      return
    }

    // Single component
    const layer = options.layer || detectLayer(component)
    if (!layer) {
      spinner.fail(chalk.red(`Cannot determine layer for "${component}". Use --layer flag.`))
      return
    }

    spinner.text = `Adding ${component} from @stsgs/ui/${layer}...`
    await addComponent(component, layer, options.dir || './components')
    spinner.succeed(chalk.green(`${component} added from @stsgs/ui/${layer}`))

    console.log(chalk.dim(`\n  import { ${component} } from '@stsgs/ui/${layer}'\n`))
  } catch (error: any) {
    spinner.fail(chalk.red(error.message))
  }
}

function detectLayer(component: string): string | null {
  // Heuristic: sections end with "Section", hooks start with "use", etc.
  if (component.startsWith('use')) return 'hooks'
  if (component.endsWith('Provider')) return 'providers'
  if (component.endsWith('Section')) return 'sections'
  // Features: common interactive patterns
  const featurePatterns = ['Panel', 'Canvas', 'Palette', 'Grid', 'Form', 'Toggle']
  if (featurePatterns.some((p) => component.includes(p))) return 'features'
  // Default to ui for base components
  return 'ui'
}

async function addComponent(name: string, layer: string, dir: string) {
  // TODO: Implementation — copy from @stsgs/ui package
  // 1. Find component in @stsgs/ui/src/{layer}/
  // 2. Copy to {dir}/{layer}/{name}.tsx
  // 3. Update barrel exports
  // 4. Run stsgs scan to verify
  console.log(`[TODO] Adding ${name} from ${layer} to ${dir}`)
}

async function installCollection(name: string, options: any) {
  // Collections mapping
  const collections: Record<string, string[]> = {
    'dashboard-kit': [
      'SidebarSection', 'StatsSection', 'ChartSection', 'DataTable',
      'FilterPanel', 'NotificationPanel', 'UserMenuSection',
    ],
    'auth-pages': [
      'LoginFormSection', 'SignupFormSection', 'ForgotPasswordSection',
      'ResetPasswordSection', 'AuthProvider',
    ],
    'landing-page': [
      'NavbarSection', 'HeroSection', 'FeaturesSection',
      'PricingSection', 'TestimonialsSection', 'CTASection', 'FooterSection',
    ],
    'chat-ui': [
      'ChatSection', 'MessageList', 'ChatInput', 'UserList', 'TypingIndicator',
    ],
  }

  const components = collections[name]
  if (!components) {
    throw new Error(`Unknown collection: @${name}. Available: ${Object.keys(collections).join(', ')}`)
  }

  for (const comp of components) {
    const layer = detectLayer(comp) || 'sections'
    await addComponent(comp, layer, options.dir || './components')
  }
}
