'use strict';

import mongoose from 'mongoose';
import logger from './logger';
import { config } from './config';

let ready;

mongoose.Promise = global.Promise;

if (config.mongoose.debug === 'true') {
  logger.debug('Users::Mongoose::Debug::Enabled');
  mongoose.set('debug', true);
}

function connect() {
  ready = new Promise((resolve, reject) => {
    logger.info('Users::Mongoose::Connect::Start');
    if (mongoose.connection.readyState !== 0) {
      logger.info('Users::Mongoose::Already Connected');
      return resolve(mongoose);
    }

    mongoose.connect(config.mongoose.uri + config.mongoose.db, config.mongoose.options, function (err) {
      if (err) {
        return reject(err);
      }
    });

    mongoose.connection.once('connected', function () {
      logger.info('Users::Mongoose::Connected', config.mongoose.uri + config.mongoose.db);
      return resolve(mongoose);
    });

  });
  return ready;
}

function disconnect() {
  return new Promise(function (resolve, reject) {
    logger.debug('Users::Mongoose::Disconnect::Start');
    if (mongoose.connection.readyState === 0) {
      logger.info('Users::Mongoose::Disconnect::Not Connected');
      return resolve();
    }

    mongoose.disconnect(function (err) {
      if (err) {
        return reject(err);
      }
    });

    mongoose.connection.once('disconnected', function () {
      logger.info('Users::Mongoose::Disconnect::Success');
      ready = undefined;
      return resolve();
    });

  });
}

if (ready === undefined) {
  connect();
}

let service = { connect: connect, disconnect: disconnect, mongoose: mongoose, ready: ready };

export default service;
export { connect, disconnect, mongoose, ready };
