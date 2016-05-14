'use strict';

import userModel from '../../../src/server/models/users.server.model.user';

let sandbox;

describe('/modules/users/server/schemas/users.server.schema.provider.js', () => {

  beforeEach(() => {
    return sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    return sandbox.restore();
  });

  describe('virtuals', () => {
    let model;

    beforeEach(() => {
      model = new userModel.getModels().provider();
    });

    describe('clearpassword', () => {

      it('should set hashedPassword', () => {
        model.clearpassword = 'test';
        return model.hashedPassword.length.should.be.above(1);
      });

    });
  });



  describe('presave', () => {

    it('should set updated timestamp if modified', () => {
      let timestamp = testUser.providers[0].timestamps.updated;
      testUser.providers[0].timestamps.created = Date.now();
      return testUser.save()
        .then(result => {
          testUser = result;
          return result.providers[0].timestamps.updated.toString().should.not.equal(timestamp.toString());
        });
    });

    it('should not updated timestamp if not modified', () => {
      let timestamp = testUser.providers[0].timestamps.updated;
      return testUser.save()
        .then(result => {
          testUser = result;
          return result.providers[0].timestamps.updated.toString().should.equal(timestamp.toString());
        });
    });

  });

  describe('toJSON', () => {
    let model;

    beforeEach(() => {
      model = new userModel.getModels().user();
    });

    describe('filter', () => {

      it('should not include hashedPassword', () => {
        model.clearpassword = 'test';
        return expect(model.toJSON().hashedPassword).to.not.exist;
      });

      it('should not include salt', () => {
        model.clearpassword = 'test';
        return expect(model.toJSON().salt).to.not.exist;
      });

    });
  });

});
