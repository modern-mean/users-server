'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = undefined;

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _logger = require('../config/logger');

var _logger2 = _interopRequireDefault(_logger);

var _jwt = require('./strategies/jwt');

var _jwt2 = _interopRequireDefault(_jwt);

var _local = require('./strategies/local');

var _local2 = _interopRequireDefault(_local);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init(app) {
  return new Promise(function (resolve, reject) {
    _logger2.default.debug('Users::Authentication::Start');
    Promise.all([_jwt2.default.strategy(app), _local2.default.strategy(app)]).then(function () {
      app.use(_passport2.default.initialize());
      _logger2.default.verbose('Users::Authentication::Success');
      return resolve(app);
    }).catch(function (err) {
      _logger2.default.error(err);
      return reject(err);
    });
  });
}

let service = { init: init };

exports.default = service;
exports.init = init;