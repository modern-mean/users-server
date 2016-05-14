'use strict';

import * as aclModule from '../../../src/server/config/acl';

let sandbox;

describe('/modules/users/server/config/acl.js', () => {

  beforeEach(() => {
    return sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    return sandbox.restore();
  });

  describe('export', () => {

    it('should export default', () => {
      return aclModule.default.should.be.an('object');
    });


    it('should export acl', () => {
      return aclModule.acl.should.be.an('object');
    });

    it('should export destroy', () => {
      return aclModule.destroy.should.be.a('function');
    });

  });

});
