'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ready = exports.mongoose = exports.disconnect = exports.connect = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let ready;

_mongoose2.default.Promise = global.Promise;

if (_config.config.mongoose.debug === 'true') {
  _logger2.default.debug('Users::Mongoose::Debug::Enabled');
  _mongoose2.default.set('debug', true);
}

function connect() {
  exports.ready = ready = new Promise((resolve, reject) => {
    _logger2.default.info('Users::Mongoose::Connect::Start');
    if (_mongoose2.default.connection.readyState !== 0) {
      _logger2.default.info('Users::Mongoose::Already Connected');
      return resolve(_mongoose2.default);
    }

    _mongoose2.default.connect(_config.config.mongoose.uri + _config.config.mongoose.db, _config.config.mongoose.options, function (err) {
      if (err) {
        return reject(err);
      }
    });

    _mongoose2.default.connection.once('connected', function () {
      _logger2.default.info('Users::Mongoose::Connected', _config.config.mongoose.uri + _config.config.mongoose.db);
      return resolve(_mongoose2.default);
    });
  });
  return ready;
}

function disconnect() {
  return new Promise(function (resolve, reject) {
    _logger2.default.debug('Users::Mongoose::Disconnect::Start');
    if (_mongoose2.default.connection.readyState === 0) {
      _logger2.default.info('Users::Mongoose::Disconnect::Not Connected');
      return resolve();
    }

    _mongoose2.default.disconnect(function (err) {
      if (err) {
        return reject(err);
      }
    });

    _mongoose2.default.connection.once('disconnected', function () {
      _logger2.default.info('Users::Mongoose::Disconnect::Success');
      exports.ready = ready = undefined;
      return resolve();
    });
  });
}

if (ready === undefined) {
  connect();
}

let service = { connect: connect, disconnect: disconnect, mongoose: _mongoose2.default, ready: ready };

exports.default = service;
exports.connect = connect;
exports.disconnect = disconnect;
exports.mongoose = _mongoose2.default;
exports.ready = ready;