'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = exports.me = exports.emails = exports.changeProfilePicture = exports.addresses = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _config = require('../../config/config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addresses(req, res) {
  let user = req.user;

  user.addresses = req.body.addresses;

  return user.save().then(user => {
    res.json(user);
  }).catch(err => {
    res.status(400).json(err.message);
  });
}

function changeProfilePicture(req, res) {

  var user = req.user;
  user.profileImageURL = _config.config.uploads.profile.public + req.file.filename;
  return user.save().then(user => {
    res.json(user);
  }).catch(err => {
    res.status(400).json(err.message);
  });
}

function emails(req, res) {
  let user = req.user;

  user.emails = req.body.emails;

  return user.save().then(user => {
    res.json(user);
  }).catch(err => {
    res.status(400).json(err.message);
  });
}

function me(req, res) {
  return res.json(req.user);
}

function update(req, res) {
  let user = req.user;

  user.name = req.body.name;

  return user.save().then(user => {
    res.json(user);
  }).catch(err => {
    res.status(400).json(err.message);
  });
}

let controller = { addresses: addresses, changeProfilePicture: changeProfilePicture, emails: emails, me: me, update: update };

exports.default = controller;
exports.addresses = addresses;
exports.changeProfilePicture = changeProfilePicture;
exports.emails = emails;
exports.me = me;
exports.update = update;