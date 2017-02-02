// @flow

import type { HandlerIO, HandlerParams } from './types';

module.exports = (io: HandlerIO) => (params: HandlerParams) => {
  if (params.args.length === 0) return Promise.reject(new Error('missing name'));
  if (params.args.length > 1) return Promise.reject(new Error('multiple links not yet supported'));

  const packageName = params.args[0];

  return io.readPackageJson(params.cwd).then(contents => {
    const linkedDependencies = Object.assign({}, contents.linkedDependencies || {});

    if (typeof linkedDependencies[packageName] === 'undefined') {
      throw new Error(`Could not find package ${packageName}`);
    }
    delete linkedDependencies[packageName];

    contents = Object.assign({ }, contents, {
      linkedDependencies
    });

    if (Object.keys(linkedDependencies).length === 0) {
      delete(contents.linkedDependencies);
    }

    return io.writePackageJson(params.cwd, contents);
  });
};
