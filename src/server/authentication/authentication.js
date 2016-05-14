'use strict';

import passport from 'passport';
import logger from '../config/logger';
import jwtStrategy from './strategies/jwt';
import localStrategy from './strategies/local';

function init(app) {
  return new Promise(function (resolve, reject) {
    logger.debug('Users::Authentication::Start');
    Promise.all([ jwtStrategy.strategy(app), localStrategy.strategy(app) ])
      .then(function () {
        app.use(passport.initialize());
        logger.verbose('Users::Authentication::Success');
        return resolve(app);
      })
      .catch(function (err) {
        logger.error(err);
        return reject(err);
      });
  });
}

let service = { init: init };

export default service;
export { init };
