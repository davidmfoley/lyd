// @flow
const expect = require('chai').expect;
const Remove = require('../src/remove');
const helper = require('./helper');

const fakeHandlerIO = helper.fakeHandlerIO;

describe('remove', () => {
  let io, remove;

  function withPackageJson(contents) {
    io.readPackageJson.onFirstCall().resolves(contents);
  }

  function shouldHaveWrittenPackageJson(expected) {
    expect(io.writePackageJson.lastCall.args[1]).to.eql(expected);
  }

  beforeEach(() => {
    io = fakeHandlerIO();
    remove = Remove(io);
  });

  it('requires a name to be given', done => {
    remove({
      cwd: '.',
      args: []
    }, io).then(() => {
      done(new Error('should be an error if no args'));
    }, () => done());
  });

  it('errors if name is not found', done => {
    withPackageJson({
      linkedDependencies: { }
    });

    remove({
      cwd: '.',
      args: ['what']
    }, io).then(() => {
      done(new Error('should be an error if no args'));
    }, () => done());
  });

  it('errors if multiple names given', done => {
    remove({
      cwd: '.',
      args: ['what', 'who']
    }, io).then(() => {
      done(new Error('should be an error if multiple args'));
    }, () => done());
  });

  it('can remove a linked dependency', () => {
    io.readPackageJson.resolves({
      linkedDependencies: {
        what: 'example/path/what',
        who: 'example/path/who',
      }
    });

    io.writePackageJson.resolves();

    return remove({
      cwd: '.',
      args: ['what']
    }, io).then(() => {
      shouldHaveWrittenPackageJson({
        linkedDependencies: {
          who: 'example/path/who'
        }
      });
    });
  });

  it('removes the linkedDependecies section when removing the last one', () => {
    io.readPackageJson.resolves({
      linkedDependencies: {
        what: 'example/path/what',
      }
    });

    io.writePackageJson.resolves();

    return remove({
      cwd: '.',
      args: ['what']
    }).then(() => {
      shouldHaveWrittenPackageJson({ });
    });
  });
});
