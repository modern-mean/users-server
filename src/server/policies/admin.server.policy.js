'use strict';

import logger from '../config/logger';
import { ready as aclReady, acl } from '../config/acl';

function policy() {
  return new Promise((resolve, reject) => {
    logger.debug('UsersAdmin::Policy::Start');
    acl.allow([{
      roles: ['admin'],
      allows: [{
        resources: '/api/users',
        permissions: '*'
      }]
    }])
    .then(() => {
      logger.verbose('UsersAdmin::Policy::Success');
      return resolve();
    })
    .catch(err => {
      logger.error(err);
      return reject(err.message);
    });
  });
}

let adminPolicy = { policy: policy };

export { policy };
export default adminPolicy;
