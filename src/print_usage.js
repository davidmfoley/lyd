// @flow

import type { HandlerIO } from '../src/types';

module.exports = (io: HandlerIO, command: string) =>{
  io.log(`Unknown command: ${command}`);
};
