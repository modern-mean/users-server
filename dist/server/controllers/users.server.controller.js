'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authorization = exports.profile = exports.password = exports.authentication = undefined;

var _usersAuthenticationServer = require('./users/users.authentication.server.controller');

var authentication = _interopRequireWildcard(_usersAuthenticationServer);

var _usersPasswordServer = require('./users/users.password.server.controller');

var password = _interopRequireWildcard(_usersPasswordServer);

var _usersProfileServer = require('./users/users.profile.server.controller');

var profile = _interopRequireWildcard(_usersProfileServer);

var _usersAuthorizationServer = require('./users/users.authorization.server.controller');

var authorization = _interopRequireWildcard(_usersAuthorizationServer);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

let controller = { authentication: authentication, password: password, profile: profile, authorization: authorization };

exports.default = controller;
exports.authentication = authentication;
exports.password = password;
exports.profile = profile;
exports.authorization = authorization;