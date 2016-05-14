'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _logger = require('../config/logger');

var _logger2 = _interopRequireDefault(_logger);

var _usersServer = require('../controllers/users.server.controller');

var _usersServerModel = require('../models/users.server.model.user');

var _usersServerModel2 = _interopRequireDefault(_usersServerModel);

var _config = require('../config/config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init(app) {
  return new Promise(function (resolve, reject) {
    _logger2.default.debug('Users::Routes::Authentication::Start');
    let router = _express2.default.Router();

    router.route('/signup').post(_usersServerModel2.default.create, _usersServer.authentication.signup);
    router.route('/signin').post(_passport2.default.authenticate('local', { session: false }), _usersServer.authentication.signin);

    app.use(_config.config.modules.users.api.endpoints.auth, router);
    _logger2.default.verbose('Users::Routes::Authentication::Success');
    return resolve(app);
  });
}

let controller = { init: init };

exports.default = controller;
exports.init = init;
/*
module.exports = function (app) {
// User Routes
var users = require('../controllers/users.server.controller');
 // Setting up the users password api
//app.route('/api/auth/forgot').post(users.forgot);
//app.route('/api/auth/reset/:token').get(users.validateResetToken);
//app.route('/api/auth/reset/:token').post(users.reset);
 // Setting up the users authentication api

// Setting the facebook oauth routes
app.route('/api/auth/facebook').get(users.oauthCall('facebook', {
  scope: ['email']
}));
app.route('/api/auth/facebook/callback').get(users.oauthCallback('facebook'));
 // Setting the twitter oauth routes
app.route('/api/auth/twitter').get(users.oauthCall('twitter'));
app.route('/api/auth/twitter/callback').get(users.oauthCallback('twitter'));
 // Setting the google oauth routes
app.route('/api/auth/google').get(users.oauthCall('google', {
  scope: [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
  ]
}));
app.route('/api/auth/google/callback').get(users.oauthCallback('google'));
 // Setting the linkedin oauth routes
app.route('/api/auth/linkedin').get(users.oauthCall('linkedin', {
  scope: [
    'r_basicprofile',
    'r_emailaddress'
  ]
}));
app.route('/api/auth/linkedin/callback').get(users.oauthCallback('linkedin'));
 // Setting the github oauth routes
app.route('/api/auth/github').get(users.oauthCall('github'));
app.route('/api/auth/github/callback').get(users.oauthCallback('github'));
 // Setting the paypal oauth routes
app.route('/api/auth/paypal').get(users.oauthCall('paypal'));
app.route('/api/auth/paypal/callback').get(users.oauthCallback('paypal'));
};
*/