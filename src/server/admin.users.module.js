'use strict';

import logger from './config/logger';
import { ready as aclReady } from './config/acl';
import adminRoutes from './routes/admin.server.routes';
import adminPolicy from './policies/admin.server.policy';
import { config } from './config/config';

function init(app) {
  return new Promise(function(resolve, reject) {
    logger.debug('UsersAdmin::Init::Pre');
    if (config.modules.admin.enable !== 'true') {
      logger.debug('UsersAdmin::Init::Disabled');
      return resolve();
    }

    //Preinit
    let preInit = Promise.all([aclReady]);


    return preInit
      .then(() => {
        logger.debug('UsersAdmin::Init::Start');
        Promise.all([adminPolicy.policy(), adminRoutes.init(app)])
          .then(() => {
            logger.verbose('UsersAdmin::Init::Success');
            return resolve(app);
          })
          .catch(err => {
            logger.error('UsersAdmin::Init::Error', err);
            return reject(err);
          });
      });

  });
}

let service = { init: init };

export default service;
export { init };
