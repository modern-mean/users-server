'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = undefined;

var _logger = require('./config/logger');

var _logger2 = _interopRequireDefault(_logger);

var _acl = require('./config/acl');

var _adminServer = require('./routes/admin.server.routes');

var _adminServer2 = _interopRequireDefault(_adminServer);

var _adminServer3 = require('./policies/admin.server.policy');

var _adminServer4 = _interopRequireDefault(_adminServer3);

var _config = require('./config/config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init(app) {
  return new Promise(function (resolve, reject) {
    _logger2.default.debug('UsersAdmin::Init::Pre');
    if (_config.config.modules.admin.enable !== 'true') {
      _logger2.default.debug('UsersAdmin::Init::Disabled');
      return resolve();
    }

    //Preinit
    let preInit = Promise.all([_acl.ready]);

    return preInit.then(() => {
      _logger2.default.debug('UsersAdmin::Init::Start');
      Promise.all([_adminServer4.default.policy(), _adminServer2.default.init(app)]).then(() => {
        _logger2.default.verbose('UsersAdmin::Init::Success');
        return resolve(app);
      }).catch(err => {
        _logger2.default.error('UsersAdmin::Init::Error', err);
        return reject(err);
      });
    });
  });
}

let service = { init: init };

exports.default = service;
exports.init = init;