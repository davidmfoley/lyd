// @flow

import type { HandlerIO, HandlerParams } from './types';
const path = require('path');

module.exports = (io: HandlerIO) => (params: HandlerParams) => {
  const cwd = params.cwd;

  return io.readPackageJson(cwd).then(contents => {
    const linkedDependencies = Object.assign({}, contents.linkedDependencies || {});

    if (params.args.length > 1) return Promise.reject(new Error('multiple links not yet supported'));

    const relativePath = params.args[0];

    return getPackageName(params.cwd, relativePath).then(name => {
      if (typeof linkedDependencies[name] !== 'undefined') {
        throw new Error(`Package ${name} already exists`);
      }

      linkedDependencies[name] = relativePath;

      contents = Object.assign({ }, contents, {
        linkedDependencies
      });

      return io.writePackageJson(params.cwd, contents);
    });
  });

  function getPackageName(cwd: string, relativePath: string) {
    const projectPath = path.normalize(path.join(cwd, relativePath));
    return io.readPackageJson(projectPath).then(contents => contents.name);
  }
};
