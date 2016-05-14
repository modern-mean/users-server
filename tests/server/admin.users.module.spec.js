'use strict';

import adminRoutes from '../../src/server/routes/admin.server.routes';
import adminPolicy from '../../src/server/policies/admin.server.policy';
import * as adminUsers from '../../src/server/admin.users.module';

let sandbox,
  app = express();

describe('/modules/users/server/admin.users.module.js', () => {

  beforeEach(() => {
    return sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    return sandbox.restore();
  });

  describe('export', () => {

    it('should export default', () => {
      return adminUsers.default.should.be.an('object');
    });

    it('should export init', () => {
      return adminUsers.init.should.be.a('function');
    });

    describe('init()', () => {
      let routesStub, policyStub;

      describe('success', () => {

        beforeEach(() => {
          routesStub = sandbox.stub(adminRoutes, 'init').resolves();
          policyStub = sandbox.stub(adminPolicy, 'policy').resolves();
        });

        it('should setup user admin routes', () => {
          return adminUsers.init(app)
                  .then(() => {
                    return routesStub.should.have.been.called;
                  });
        });

        it('should setup admin policy', () => {
          return adminUsers.init(app)
                  .then(() => {
                    return policyStub.should.have.been.called;
                  });
        });

        it('should resolve a promise', () => {
          return adminUsers.init(app).should.be.fulfilled;
        });

      });

      describe('error', () => {


        describe('acl', () => {
          let policyStub;

          beforeEach(() => {
            policyStub = sandbox.stub(adminPolicy, 'policy').rejects('Error!');
          });

          it('should reject a promise', () => {
            return adminUsers.init(app).should.be.rejectedWith('Error!');
          });

        });

        describe('routes', () => {
          let routesStub, policyStub;

          beforeEach(() => {

            policyStub = sandbox.stub(adminPolicy, 'policy').resolves();
            routesStub = sandbox.stub(adminRoutes, 'init').rejects('Error!');
          });

          it('should reject a promise', () => {
            return adminUsers.init(app).should.be.rejectedWith('Error!');
          });

        });

      });

    });

  });

});
