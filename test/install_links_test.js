// @flow weak
const chai = require('chai');
const expect = chai.expect;
const InstallLinks = require('../src/install_links');
const helper = require('./helper');
chai.use(require('sinon-chai'));

describe('remove', () => {
  let io, installLinks;

  beforeEach(() => {
    io = helper.fakeHandlerIO();
    installLinks = InstallLinks(io);
  });

  it('rejects if arguments are passed', done => {
    installLinks({args: ['woot']}).then(() => {
      done(new Error('should have rejected with args'));
    }, () => {
      done();
    });
  });

  it('no-ops if there are no linked packages', () => {
    const exampleContent = {
      foo: 'bar'
    };

    io.readPackageJson.resolves(exampleContent);
    io.writePackageJson.rejects(new Error());

    return installLinks({args: [], cwd: '.'}).then();
  });

  context('when there is an entry in linkedDependences', () => {
    const packageWithLinkedDeps = {
      foo: 'bar',
      linkedDependencies: {
        foo: '../example/path/foo'
      }
    };

    beforeEach(() => {
      io.readPackageJson.resolves(packageWithLinkedDeps);
      io.writePackageJson.resolves();
    });

    it('creates a symlink', () => {
      io.symlink.resolves(undefined);
      return installLinks({args: [], cwd: '.'}).then(() => {
        expect(io.symlink).to.have.been.calledWith('../example/path/foo');
      });
    });

    it('unlinks first if exists', () => {
      const err = new Error();
      err.code = 'EEXIST';
      io.symlink.onCall(0).rejects(err);
      io.unlink.resolves();
      io.symlink.onCall(1).resolves();

      return installLinks({args: [], cwd: '.'}).then(() => {
        expect(io.unlink).to.have.been.called;
        expect(io.symlink).to.have.been.called;
      });
    });
  });
});
