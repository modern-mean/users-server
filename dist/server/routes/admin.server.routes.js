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

var _acl = require('acl');

var _acl2 = _interopRequireDefault(_acl);

var _acl3 = require('../config/acl');

var _adminServer = require('../controllers/admin.server.controller');

var admin = _interopRequireWildcard(_adminServer);

var _config = require('../config/config');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init(app) {
  return new Promise((resolve, reject) => {
    _logger2.default.debug('UsersAdmin::Routes::Start');
    let router = _express2.default.Router();

    //Set JWT Auth for all user Routes
    router.all('*', _passport2.default.authenticate('jwt', { session: false }));

    router.route('/').get(_acl3.acl.middleware(99, getUser), admin.list);

    // Single user routes
    router.route('/:userId').get(_acl3.acl.middleware(99, getUser), admin.read).put(_acl3.acl.middleware(99, getUser), admin.update).delete(_acl3.acl.middleware(99, getUser), admin.remove);

    // Finish by binding the user middleware
    router.param('userId', admin.userByID);

    app.use(_config.config.modules.admin.api.endpoint, router);

    _logger2.default.verbose('UsersAdmin::Routes::Success');
    return resolve(app);
  });
}

/* istanbul ignore next: Ignore for now... prolly could export the function to test it */
function getUser(req, res) {
  return req.user._id.toString();
}

let routes = { init: init };

exports.default = routes;
exports.init = init;