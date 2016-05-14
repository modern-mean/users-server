'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = undefined;

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _logger = require('../config/logger');

var _logger2 = _interopRequireDefault(_logger);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _usersServer = require('../controllers/users.server.controller');

var _profileUpload = require('../config/profileUpload');

var _profileUpload2 = _interopRequireDefault(_profileUpload);

var _config = require('../config/config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init(app) {
  return new Promise((resolve, reject) => {
    _logger2.default.debug('Users::Routes::Start');
    let router = _express2.default.Router();

    let upload = (0, _multer2.default)({
      storage: _profileUpload2.default.storage(),
      fileFilter: _profileUpload2.default.filter
    });

    //Set JWT Auth for all user Routes
    router.all('*', _passport2.default.authenticate('jwt', { session: false }));

    // Setting up the users profile api
    router.route('/').get(_usersServer.profile.me).put(_usersServer.profile.update);

    //TODO  renable when social accounts are working again.
    //router.route('/accounts').delete(controllers.authentication.removeOAuthProvider);
    router.route('/addresses').put(_usersServer.profile.addresses);
    router.route('/authorization').get(_usersServer.authorization.read);
    router.route('/emails').put(_usersServer.profile.emails);
    router.route('/password').post(_usersServer.password.changePassword);
    router.route('/picture').post(upload.single('newProfilePicture'), _usersServer.profile.changeProfilePicture);

    app.use(_config.config.modules.users.api.endpoints.me, router);
    _logger2.default.verbose('Users::Routes::Success');
    return resolve(app);
  });
}

let service = { init: init };

exports.default = service;
exports.init = init;