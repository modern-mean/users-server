'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ready = exports.destroy = exports.acl = undefined;

var _acl = require('acl');

var _acl2 = _interopRequireDefault(_acl);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _mongoose = require('./mongoose');

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let ready, acl;

function init() {
  exports.ready = ready = new Promise((resolve, reject) => {
    _logger2.default.silly(_chalk2.default.red('User::Acl::Init::Start'), _mongoose.ready);
    return _mongoose.ready.then(() => {
      exports.acl = acl = new _acl2.default(new _acl2.default.mongodbBackend(_mongoose.mongoose.connection.db, 'acl_'));
      _logger2.default.verbose('User::Acl::Init::Success');
      return resolve(acl);
    }).catch(err => {
      _logger2.default.error('User::Acl::Init::Error');
      return reject(err);
    });
  });
}

function destroy() {
  _logger2.default.debug('User::Acl::Destroy');
  exports.acl = acl = undefined;
  exports.ready = ready = undefined;
}

if (ready === undefined && acl === undefined) {
  init();
}

let service = { acl: acl, ready: ready, destroy: destroy };

exports.default = service;
exports.acl = acl;
exports.destroy = destroy;
exports.ready = ready;