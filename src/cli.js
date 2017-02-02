#! /usr/bin/env node
// @flow
/* eslint-disable no-console */

import type {Handler} from './types';

const [command, ...args] = process.argv.slice(2);
main(command, args || []);

function main(command, args) {
  let action = getAction(command);
  const cwd = process.cwd();
  const io = require('./io');
  const params = { cwd, args };

  if (!action) {
    require('./print_usage')(io, command);
    process.exit(2);
    return; // thanks flowbama
  }

  action(io)(params).then(() => {
    process.exit(0);
  }, (err) => {
    console.error('Error occurred:', err.message);
    process.exit(1);
  });
}

function getAction(command: string): ?Handler {
  if (command === 'install' || !command) {
    return require('./install_links');
  }
  else if (command === 'add') {
    return require('./add');
  }
  else if (command === 'remove') {
    return require('./remove');
  }
}

