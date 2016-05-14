'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.changePassword = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function changePassword(req, res) {

  let passwordDetails = req.body;
  let user = req.user;

  if (passwordDetails.newPassword !== passwordDetails.verifyPassword) {
    return res.status(400).json('Passwords do not match');
  }

  let localProvider = _lodash2.default.find(user.providers, { type: 'local' });

  if (!localProvider) {
    return res.status(400).json('No record of local provider');
  }

  if (!localProvider.authenticate(passwordDetails.currentPassword)) {
    return res.status(400).json('Current password is incorrect');
  }

  localProvider.clearpassword = passwordDetails.newPassword;

  return user.save().then(function (user) {
    return res.json(user);
  }).catch(function (err) {
    return res.status(400).json(err.message);
  });
}

let controller = { changePassword: changePassword };

exports.default = controller;
exports.changePassword
//forgot,
//reset,
//validateResetToken
 = changePassword;