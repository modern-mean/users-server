import nodeacl from 'acl';
import logger from './logger';
import { ready as mongooseReady, mongoose } from './mongoose';
import chalk from 'chalk';

let ready,
  acl;

function init() {
  ready = new Promise((resolve, reject) => {
    logger.silly(chalk.red('User::Acl::Init::Start'), mongooseReady);
    return mongooseReady
      .then(() => {
        acl = new nodeacl(new nodeacl.mongodbBackend(mongoose.connection.db, 'acl_'));
        logger.verbose('User::Acl::Init::Success');
        return resolve(acl);
      })
      .catch(err => {
        logger.error('User::Acl::Init::Error');
        return reject(err);
      });

  });
}

function destroy() {
  logger.debug('User::Acl::Destroy');
  acl = undefined;
  ready = undefined;
}

if (ready === undefined && acl === undefined) {
  init();
}

let service = { acl: acl, ready: ready, destroy: destroy };

export default service;
export { acl, destroy, ready };
