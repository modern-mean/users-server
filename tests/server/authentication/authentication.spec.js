'use strict';

import passport from 'passport';
import * as authentication from '../../../src/server/authentication/authentication';
import jwtStrategy from '../../../src/server/authentication/strategies/jwt';
import localStrategy from '../../../src/server/authentication/strategies/local';

let sandbox;

describe('/modules/users/server/authentication/authentication.js', () => {
  let app;
  before(() => {
    return app = express();
  });

  beforeEach(() => {
    return sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    return sandbox.restore();
  });


  describe('export', () => {

    it('should export default', () => {
      return authentication.default.should.be.an('object');
    });

    it('should export init', () => {
      return authentication.init.should.be.a('function');
    });

    describe('init()', () => {
      let jwtSpy, passportSpy;

      describe('success', () => {

        beforeEach(() => {
          jwtSpy = sandbox.spy(jwtStrategy, 'strategy');
          passportSpy = sandbox.spy(passport, 'initialize');
        });

        it('should setup user admin routes', () => {
          return authentication.init(app)
                  .then(() => {
                    return jwtSpy.should.have.been.called;
                  });
        });

        it('should initialize passport', () => {
          return authentication.init(app)
                  .then(() => {
                    return passportSpy.should.have.been.called;
                  });
        });

        it('should resolve a promise', () => {
          return authentication.init(app).should.be.fulfilled;
        });

      });

      describe('error', () => {
        let mockStrategy;

        beforeEach(() => {
          mockStrategy = sandbox.stub(jwtStrategy, 'strategy').rejects();
        });

        it('should reject a promise', () => {
          return authentication.init(app).should.be.rejected;
        });

      });

    });

  });

});
