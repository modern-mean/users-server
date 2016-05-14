'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = undefined;

var _logger = require('./config/logger');

var _logger2 = _interopRequireDefault(_logger);

var _usersServerModel = require('./models/users.server.model.user');

var _usersServerModel2 = _interopRequireDefault(_usersServerModel);

var _usersServerModelUser = require('./models/users.server.model.user.seed');

var _usersServerModelUser2 = _interopRequireDefault(_usersServerModelUser);

var _usersServer = require('./routes/users.server.routes');

var _usersServer2 = _interopRequireDefault(_usersServer);

var _authServer = require('./routes/auth.server.routes');

var _authServer2 = _interopRequireDefault(_authServer);

var _authentication = require('./authentication/authentication');

var _authentication2 = _interopRequireDefault(_authentication);

var _config = require('./config/config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init(app) {
  _logger2.default.debug('Users::Init::Start');

  if (_config.config.modules.users.enable !== 'true') {
    _logger2.default.debug('Users::Init::Disabled');
    return Promise.resolve();
  }

  let modelInit = new Promise(function (resolve, reject) {
    _logger2.default.debug('Users::Init::Model::Start');
    _usersServerModel2.default.init().then(function (model) {
      if (_config.config.mongoose.seed === 'true') {
        _usersServerModelUser2.default.init();
      }
      _logger2.default.verbose('Users::Init::Model::Success');
      return resolve();
    }).catch(function (err) {
      _logger2.default.error('Users::Init::Model::Error::' + err);
      return reject(err);
    });
  });

  let expressInit = new Promise(function (resolve, reject) {
    _logger2.default.debug('Users::Init::Express::Start');
    _authentication2.default.init(app).then(_usersServer2.default.init).then(_authServer2.default.init).then(function () {
      _logger2.default.verbose('Users::Init::Express::Success');
      return resolve(app);
    }).catch(function (err) {
      _logger2.default.error('Users::Init::Express::Error::' + err);
      return reject(err);
    });
  });

  return Promise.all([modelInit, expressInit]);
}

let service = { init: init };

exports.default = service;
exports.init = init;