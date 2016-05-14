'use strict';

import expressModule from 'modern-mean-core-server/dist/server/app/express';
import * as users from '../../src/server/users.module';
import userRoutes from '../../src/server/routes/users.server.routes';
import authRoutes from '../../src/server/routes/auth.server.routes';
import userModel from '../../src/server/models/users.server.model.user';
import userSeed from '../../src/server/models/users.server.model.user.seed';
import authentication from '../../src/server/authentication/authentication';

let sandbox;

describe('/modules/users/server/users.module.js', () => {

  beforeEach(() => {
    return sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    return sandbox.restore();
  });

  describe('export', () => {

    it('should export default', () => {
      return users.default.should.be.an('object');
    });

    it('should export init', () => {
      return users.init.should.be.a('function');
    });

    describe('init()', () => {
      let userRoutesSpy, authRoutesSpy, authenticationSpy, mockModel, app;

      describe('seed', () => {
        let mockSeed;

        beforeEach(() => {
          app = expressModule.getExpressApp();
          mockModel = sandbox.stub(userModel, 'init').resolves();
          mockSeed = sandbox.stub(userSeed, 'init');
          process.env.MM_USERS_MONGOOSE_SEED = true;
          config.load();
          return users.init(app);
        });

        afterEach(() => {
          delete process.env.MEAN_USERS_SEED;
          config.load();
        });

        it('should call user seed init', () => {
          return mockSeed.should.have.been.called;
        });

      });

      describe('success', () => {

        beforeEach(() => {
          app = expressModule.getExpressApp();
          mockModel = sandbox.stub(userModel, 'init').resolves();
          authenticationSpy = sandbox.spy(authentication, 'init');
          userRoutesSpy = sandbox.spy(userRoutes, 'init');
          authRoutesSpy = sandbox.spy(authRoutes, 'init');
        });

        it('should setup user authentication', () => {

          return users.init(app)
                  .then(() => {
                    return authenticationSpy.should.have.been.called;
                  });
        });

        it('should setup user routes', () => {

          return users.init(app)
                  .then(() => {
                    return userRoutesSpy.should.have.been.called;
                  });
        });

        it('should setup authentication routes', () => {

          return users.init(app)
                  .then(() => {
                    return authRoutesSpy.should.have.been.called;
                  });
        });



        it('should resolve a promise', () => {
          return users.init(app).should.be.fulfilled;
        });

      });

      describe('error', () => {

        let mockRoutes;

        describe('express init', () => {
          beforeEach(() => {
            app = expressModule.getExpressApp();
            mockRoutes = sandbox.stub(userRoutes, 'init').rejects();
            mockModel = sandbox.stub(userModel, 'init').resolves();
          });

          it('should reject a promise', () => {
            return users.init(app).should.be.rejected;
          });

        });

        describe('model init', () => {
          beforeEach(() => {
            app = expressModule.getExpressApp();
            mockModel = sandbox.stub(userModel, 'init').rejects();
          });

          it('should reject a promise', () => {
            return users.init(app).should.be.rejected;
          });

        });



      });

    });

  });

});
