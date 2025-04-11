#!/usr/bin/env node

import { Command } from 'commander';
import { ls } from './ls';

const program = new Command();

program
  .name('ls')
  .description('List directory contents')
  .version('1.0.0')
  .option('-a, --all', 'Show all files including hidden ones')
  .option('-l, --long', 'Use a long listing format')
  .option('-F, --classify', 'Append indicator (one of */=>@|) to entries')
  .option('--color', 'Colorize the output')
  .argument('[paths...]', 'Paths to list', ['.'])
  .action(async (paths: string[], options) => {
    try {
      await ls(paths, options);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error('An unknown error occurred');
      }
      process.exit(1);
    }
  });

program.parse(); 