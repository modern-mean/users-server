'use strict';

let sandbox;

describe('/modules/users/server/schemas/users.server.schema.email.js', () => {

  beforeEach(() => {
    return sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    return sandbox.restore();
  });



  describe('presave', () => {

    it('should set updated timestamp if modified', () => {
      let timestamp = testUser.emails[0].timestamps.updated;
      testUser.emails[0].primary = !testUser.emails[0].primary;
      return testUser.save()
        .then(result => {
          testUser = result;
          return result.emails[0].timestamps.updated.toString().should.not.equal(timestamp.toString());

        });
    });

    it('should not updated timestamp if not modified', () => {
      let timestamp = testUser.emails[0].timestamps.updated;
      return testUser.save()
        .then(result => {
          testUser = result;
          return result.emails[0].timestamps.updated.toString().should.equal(timestamp.toString());
        });
    });

  });

});
