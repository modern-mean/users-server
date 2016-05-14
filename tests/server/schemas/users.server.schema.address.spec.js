'use strict';

let sandbox;

describe('/modules/users/server/schemas/users.server.schema.address.js', () => {

  beforeEach(() => {
    return sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    return sandbox.restore();
  });

  describe('presave', () => {

    it('should set updated timestamp if modified', () => {
      let timestamp = testUser.addresses[0].timestamps.updated;
      testUser.addresses[0].streetAddress = ~testUser.addresses[0].streetAddress;
      return testUser.save()
        .then(result => {
          testUser = result;
          return testUser.addresses[0].timestamps.updated.toString().should.not.equal(timestamp.toString());
        });
    });

    it('should not updated timestamp if not modified', () => {
      let timestamp = testUser.addresses[0].timestamps.updated;
      return testUser.save()
        .then(result => {
          testUser = result;
          return testUser.addresses[0].timestamps.updated.toString().should.equal(timestamp.toString());
        });
    });

  });

});
