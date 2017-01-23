// @flow weak
const expect = require('chai').expect;
const Add = require('../src/add');
const fakeHandlerIO = require('./helper').fakeHandlerIO;

describe('add', () => {
  let add, io;

  beforeEach(() => {
    io = fakeHandlerIO();
    add = Add(io);
  });

  it('handles no linkedDependencies', () => {
    io.readPackageJson.onFirstCall().resolves({name: 'foo'});
    io.readPackageJson.onSecondCall().resolves({'name': 'bar'});
    io.writePackageJson.resolves();

    return add({
      cwd: 'example/path',
      args: ['../bar']
    }).then(() => {
      expect(io.writePackageJson.lastCall.args).to.eql([
        'example/path', {
          name: 'foo',
          linkedDependencies: {'bar': '../bar'}
        }
      ]);
    });
  });

  it('handles existing linkedDependencies', () => {
    io.readPackageJson.onFirstCall().resolves({
      name: 'foo',
      linkedDependencies: {
        baz: 'path/to/baz'
      }
    });

    io.readPackageJson.onSecondCall().resolves({'name': 'bar'});
    io.writePackageJson.resolves();

    return add({
      cwd: 'example/path',
      args: ['../bar']
    }).then(() => {
      expect(io.writePackageJson.lastCall.args).to.eql([
        'example/path', {
          name: 'foo',
          linkedDependencies: {
            'bar': '../bar',
            'baz': 'path/to/baz'
          }
        }
      ]);
    });
  });

  it('errors if given an existing name', (done) => {
    io.readPackageJson.onFirstCall().resolves({
      name: 'foo',
      linkedDependencies: {
        baz: 'path/to/baz'
      }
    });

    io.readPackageJson.onSecondCall().resolves({'name': 'baz'});

    add({
      cwd: 'example/path',
      args: ['../bar']
    }).then(() => {
      done(new Error('should have been an error'));
    }, () => {
      done();
    });
  });
});
