'use strict';

import { mongoose } from '../config/mongoose';
import logger from '../config/logger';
import UserSchema from '../schemas/users.server.schema.user';
import ProviderSchema from '../schemas/users.server.schema.provider';
import EmailSchema from '../schemas/users.server.schema.email';
import AddressSchema from '../schemas/users.server.schema.address';

let models;

function getModels() {
  logger.debug('User::Model::getModels');
  return models;
}

function create(req, res, next) {
  req.model = new models.user();
  next();
  return;
}

function init() {
  logger.debug('User::Model::Init::Start');
  models = {};
  return new Promise(function (resolve, reject) {
    try {
      if (!models.user) {
        models.user = mongoose.model('User', UserSchema);
        logger.silly('User::Model::Init::User');
      }

      if (!models.provider) {
        models.provider = mongoose.model('Provider', ProviderSchema);
        logger.silly('User::Model::Init::Provider');
      }

      if (!models.email) {
        models.email = mongoose.model('Email', EmailSchema);
        logger.silly('User::Model::Init::Email');
      }

      if (!models.address) {
        models.address = mongoose.model('Address', AddressSchema);
        logger.silly('User::Model::Init::Address');
      }
      logger.verbose('User::Model::Init::Success');
      return resolve(models);
    } catch (err) {
      logger.error('User::Model::Init::Error', err);
      return reject(err);
    }

  });
}

if (models === undefined) {
  init();
}



let userModel = { init: init, create: create, models: models, getModels: getModels };

export default userModel;
export { init, create, models, getModels };
