'use strict';

import * as authorizationController from '../../../../src/server/controllers/users/users.authorization.server.controller';
import { acl } from '../../../../src/server/config/acl';
import userModel from '../../../../src/server/models/users.server.model.user';

let sandbox;

describe('/modules/users/server/controllers/users/users.authorization.server.controller.js', () => {

  beforeEach(() => {
    return sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    return sandbox.restore();
  });

  describe('export', () => {

    it('should export default', () => {
      return authorizationController.default.should.be.an('object');
    });

    it('should export signin', () => {
      return authorizationController.read.should.be.a('function');
    });

    describe('read()', () => {
      let mockReq, mockRes, mockUser, rolesStub, resourcesStub, user, model;

      beforeEach(() => {
        model = mongoose.model('User');
        user = new model();
        mockReq = {
          user: user,
        };
        mockRes = {
          json: sandbox.spy(),
          status: sandbox.stub().returnsThis()
        };

      });


      describe('success', () => {

        beforeEach(() => {
          rolesStub = sandbox.stub(acl, 'userRoles').resolves(['user']);
          resourcesStub = sandbox.stub(acl, 'whatResources').resolves(['test']);
          return authorizationController.read(mockReq, mockRes);
        });

        it('should call acl userRoles', () => {
          return rolesStub.should.have.been.calledWith(user._id.toString());
        });

        it('should call acl whatResources', () => {
          return resourcesStub.should.have.been.calledWith(['user']);
        });

        it('should call res.json', () => {
          return mockRes.json.should.have.been.called;
        });

      });

      describe('error', () => {

        beforeEach(() => {
          rolesStub = sandbox.stub(acl, 'userRoles').rejects('Error!');
          return authorizationController.read(mockReq, mockRes);
        });

        it('should set status to 500', () => {
          return mockRes.status.should.have.been.calledWith(500);
        });

        it('should call res.json with error', () => {
          return mockRes.json.should.have.been.calledWith('Error!');
        });

      });

    });


  });

});
