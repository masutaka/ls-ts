#!/usr/bin/env node

import { program } from 'commander';
import { ls } from './ls';

program
  .option('-a, --all', 'show hidden files')
  .option('-l, --long', 'use a long listing format')
  .option('-F, --classify', 'append indicator (one of */=>@|) to entries')
  .option('--color', 'colorize the output')
  .argument('[paths...]', 'paths to list')
  .parse(process.argv);

const options = program.opts();
const paths = program.args.length > 0 ? program.args : ['.'];

ls(paths, options).catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
}); 