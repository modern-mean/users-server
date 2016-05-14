'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signToken = undefined;

var _config = require('../config/config');

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function signToken(user, options) {
  return new Promise(function (resolve, reject) {
    let payload, token, jwtOptions;

    if (!user || !user._id) {
      reject('User not valid');
    }

    options = options || {};

    payload = {
      user: user._id.toString()
    };

    jwtOptions = _lodash2.default.merge(_config.config.jwt.options, options);

    token = _jsonwebtoken2.default.sign(payload, _config.config.jwt.secret, jwtOptions);

    resolve(token);
  });
}

let service = { signToken: signToken };

exports.default = service;
exports.signToken = signToken;