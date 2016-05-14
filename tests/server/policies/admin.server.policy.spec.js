'use strict';

import * as adminPolicy from '../../../src/server/policies/admin.server.policy';
import { acl } from '../../../src/server/config/acl';

let sandbox;

describe('/modules/users/server/policies/admin.server.policy.js', () => {

  beforeEach(() => {
    return sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    return sandbox.restore();
  });

  describe('export', () => {

    it('should export default', () => {
      return adminPolicy.default.should.be.an('object');
    });

    it('should export policy', () => {
      return adminPolicy.policy.should.be.a('function');
    });

    describe('policy()', () => {

      describe('success', () => {
        let promise, aclSpy;

        beforeEach(() => {
          aclSpy = sandbox.spy(acl, 'allow');
          promise = adminPolicy.policy();
          return promise;
        });

        it('should resolve a promise', () => {
          return promise.should.be.fulfilled;
        });

        it('should call acl allow', () => {
          return aclSpy.should.have.been.calledWith([{
            roles: ['admin'],
            allows: [{
              resources: '/api/users',
              permissions: '*'
            }]
          }]);
        });

      });

      describe('error', () => {
        let aclStub;

        beforeEach(() => {
          return aclStub = sandbox.stub(acl, 'allow').rejects('Error!');
        });

        it('should reject a promise', () => {
          return adminPolicy.policy().should.be.rejectedWith('Error!');
        });

      });

    });

  });

});
