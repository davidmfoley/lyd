// @flow

const path = require('path');
const promisify = require('es6-promisify');
const mkdirp = promisify(require('mkdirp'));

import type { HandlerIO, HandlerParams } from './types';

module.exports = (io: HandlerIO) => (params: HandlerParams) => {
  const cwd = params.cwd;

  if (params.args.length) return Promise.reject(new Error('install-links doesn\'t take arguments'));

  return io.readPackageJson(cwd).then(contents => {
    const linkedDependencies = contents.linkedDependencies || {};
    if (Object.keys(linkedDependencies).length === 0) return Promise.resolve();

    let promise = mkdirp(path.join(cwd, 'node_modules'));

    Object.keys(linkedDependencies).forEach(name => {
      promise = promise.then(() => handlePackage(name));
    });

    return promise;

    function handlePackage(name) {
      const relativePath = linkedDependencies[name];
      const targetPath = path.normalize(path.join(cwd, relativePath));
      const nodeModulesPath = path.normalize(path.join(cwd, 'node_modules', name));

      return io.symlink(targetPath, nodeModulesPath).catch(err => {
        if (err.code === 'EEXIST') {
          return io.unlink(nodeModulesPath).then(() => io.symlink(targetPath, nodeModulesPath));
        }
        else {
          throw err;
        }
      });
    }
  });
};
