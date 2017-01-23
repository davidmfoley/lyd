// @flow

import type { HandlerIO } from '../src/types';

const sinon = require('sinon');
require('sinon-as-promised');

module.exports = {
  fakeHandlerIO
};

function fakeHandlerIO(): HandlerIO {
  return {
    readFile: sinon.stub(),
    writeFile: sinon.stub(),
    symlink: sinon.stub(),
    unlink: sinon.stub(),
    readPackageJson: sinon.stub(),
    writePackageJson: sinon.stub(),
  };
}
