'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.policy = undefined;

var _logger = require('../config/logger');

var _logger2 = _interopRequireDefault(_logger);

var _acl = require('../config/acl');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function policy() {
  return new Promise((resolve, reject) => {
    _logger2.default.debug('UsersAdmin::Policy::Start');
    _acl.acl.allow([{
      roles: ['admin'],
      allows: [{
        resources: '/api/users',
        permissions: '*'
      }]
    }]).then(() => {
      _logger2.default.verbose('UsersAdmin::Policy::Success');
      return resolve();
    }).catch(err => {
      _logger2.default.error(err);
      return reject(err.message);
    });
  });
}

let adminPolicy = { policy: policy };

exports.policy = policy;
exports.default = adminPolicy;