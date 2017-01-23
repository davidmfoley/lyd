// @flow

const nativeFS = require('fs');
const path = require('path');
const promisify = require('es6-promisify');

import type { HandlerIO } from './types';

const readFile = promisify(nativeFS.readFile);
const writeFile = promisify(nativeFS.writeFile);
const symlink = promisify(nativeFS.symlink);
const unlink = promisify(nativeFS.unlink);

function readPackageJson(cwd) {
  const packagePath = getPackagePath(cwd);
  return readFile(packagePath).then(JSON.parse);
}

function writePackageJson(cwd, content) {
  const packagePath = getPackagePath(cwd);
  return writeFile(packagePath, JSON.stringify(content, null, '  ') + '\n');
}

function getPackagePath(cwd) {
  return path.join(cwd, 'package.json');
}

const IO: HandlerIO = {
  readFile,
  writeFile,
  symlink,
  unlink,
  readPackageJson,
  writePackageJson
};

module.exports = IO;
