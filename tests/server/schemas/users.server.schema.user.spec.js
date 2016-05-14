'use strict';

import userModel from '../../../src/server/models/users.server.model.user';

let sandbox;

describe('/modules/users/server/schemas/users.server.schema.user.js', () => {

  beforeEach(() => {
    return sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    return sandbox.restore();
  });

  describe('virtuals', () => {
    let model;

    beforeEach(() => {
      model = new userModel.getModels().user();
    });

    describe('name.full', () => {

      it('should return first name + last name', () => {
        model.name.first = 'Fred';
        model.name.last = 'Flintstone';
        return model.name.full.should.equal('Fred Flintstone');
      });

    });
  });

  describe('toJSON', () => {
    let model;

    beforeEach(() => {
      model = new userModel.getModels().user();
    });

    describe('virtuals', () => {

      it('should include virtuals', () => {
        model.name.first = 'Fred';
        model.name.last = 'Flintstone';
        return model.toJSON().name.full.should.equal('Fred Flintstone');
      });

    });
  });



  describe('presave', () => {

    it('should set updated timestamp if modified', () => {
      let timestamp = new Date(2015, 1);
      testUser.timestamps.updated = timestamp;
      testUser.name.first = ~testUser.name.first;
      return testUser.save()
        .then(result => {
          return result.timestamps.updated.toString().should.not.equal(timestamp.toString());
        });
    });

    it('should not updated timestamp if not modified', () => {
      let timestamp = testUser.timestamps.updated;
      return testUser.save()
        .then(result => {
          return result.timestamps.updated.toString().should.equal(timestamp.toString());
        });
    });

  });

});
