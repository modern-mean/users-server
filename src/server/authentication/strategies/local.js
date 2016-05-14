'use strict';

import lodash from 'lodash';
import passport from 'passport';
import logger from '../../config/logger';
import userModel from '../../models/users.server.model.user';

let LocalStrategy = require('passport-local').Strategy;

function strategy() {
  return new Promise(function (resolve, reject) {
    logger.debug('Users::Authentication::Local::Start');
    // Use local strategy
    passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function (email, password, done) {
      let User = userModel.getModels().user;
      logger.debug('Users::Authentication::Local::User', email, password);
      User.findOne({ 'providers.type': 'local', 'providers.email': email.toLowerCase() })
        .then(user => {
          if (!user) {
            logger.debug('Users::Authentication::Local::UserNotFound');
            return done('Invalid email or password', false);
          }

          let localProvider = lodash.find(user.providers, { type: 'local' });

          if (!localProvider || !localProvider.authenticate(password)) {
            logger.debug('Users::Authentication::Local::Wrong Password');
            return done('Invalid email or password', false);
          }



          return done(null, user);
        })
        .catch(err => {
          return done(err, false);
        });
    }));
    logger.verbose('Users::Authentication::Local::Success');
    return resolve();
  });
}

let service = { strategy: strategy };

export default service;
export { strategy };
