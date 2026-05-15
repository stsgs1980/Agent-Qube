#!/usr/bin/env node

/**
 * @stsgs/cli — CLI tool for @stsgs/ui
 *
 * Commands:
 *   stsgs add <component>     Add component to project
 *   stsgs list [layer]        List available components
 *   stsgs scan                Scan project for anti-monolith violations
 *   stsgs recommend <prompt>  Get layout recommendations
 *   stsgs theme list          List available theme presets
 *   stsgs theme recommend     Get theme recommendation
 */

import { Command } from 'commander'
import { addCommand } from './commands/add'
import { listCommand } from './commands/list'
import { scanCommand } from './commands/scan'
import { themeCommand } from './commands/theme'
import { recommendCommand } from './commands/recommend'

const program = new Command()

program
  .name('stsgs')
  .description('CLI tool for @stsgs/ui — Foundation Component Library')
  .version('0.1.0')

// stsgs add <component>
program
  .command('add')
  .description('Add a component from @stsgs/ui to your project')
  .argument('<component>', 'Component name (e.g., Button, HeroSection, @dashboard-kit)')
  .option('-l, --layer <layer>', 'Target layer (ui, sections, features, hooks, providers)')
  .option('-d, --dir <dir>', 'Target directory', './components')
  .action(addCommand)

// stsgs list [layer]
program
  .command('list')
  .description('List available components in @stsgs/ui')
  .argument('[layer]', 'Layer to list (tokens, ui, sections, features, hooks, providers)')
  .option('-t, --tag <tag>', 'Filter by tag')
  .action(listCommand)

// stsgs scan
program
  .command('scan')
  .description('Scan project for anti-monolith violations')
  .option('-p, --path <path>', 'Project path', '.')
  .option('--fix', 'Auto-fix violations where possible')
  .action(scanCommand)

// stsgs recommend <prompt>
recommendCommand(program)

// stsgs theme (subcommands)
themeCommand(program)

program.parse()
