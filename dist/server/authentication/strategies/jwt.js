'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.strategy = undefined;

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _config = require('../../config/config');

var _logger = require('../../config/logger');

var _logger2 = _interopRequireDefault(_logger);

var _passportJwt = require('passport-jwt');

var _passportJwt2 = _interopRequireDefault(_passportJwt);

var _usersServerModel = require('../../models/users.server.model.user');

var _usersServerModel2 = _interopRequireDefault(_usersServerModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let jwtStrategy = _passportJwt2.default.Strategy;
let extract = _passportJwt2.default.ExtractJwt;

function strategy() {
  return new Promise(function (resolve, reject) {
    _logger2.default.debug('Users::Authentication::JWT::Start');
    var opts = {};
    opts.secretOrKey = _config.config.jwt.secret;
    opts.jwtFromRequest = extract.fromAuthHeader();

    _passport2.default.use(new jwtStrategy(opts, function (jwt_payload, done) {
      let User = _usersServerModel2.default.getModels().user;
      User.findById({ _id: jwt_payload.user }).then(function (user) {
        if (!user) {
          return done('User not found');
        }

        return done(null, user);
      }).catch(function (err) {
        return done(err, false);
      });
    }));
    _logger2.default.verbose('Users::Authentication::Jwt::Success');
    return resolve();
  });
}

let service = { strategy: strategy };

exports.default = service;
exports.strategy = strategy;