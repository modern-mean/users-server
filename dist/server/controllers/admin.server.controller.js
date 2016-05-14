'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userByID = exports.list = exports.remove = exports.update = exports.read = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _mongoose = require('../config/mongoose');

var _usersServerModel = require('../models/users.server.model.user');

var _usersServerModel2 = _interopRequireDefault(_usersServerModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function read(req, res) {
  return res.json(req.model);
}

function update(req, res) {
  let user = req.model;

  //Since this is admin functionality assuming they know what they are doing
  _lodash2.default.merge(user, req.body);

  return user.save().then(user => {
    return res.json(user);
  }).catch(err => {
    return res.status(400).json(err.message);
  });
}

function remove(req, res) {
  let user = req.model;

  return user.remove().then(user => {
    return res.json(user);
  }).catch(err => {
    return res.status(400).json(err.message);
  });
}

function list(req, res) {
  let User = _usersServerModel2.default.getModels().user;
  return User.find({}).then(users => {
    return res.json(users);
  }).catch(err => {
    return res.status(400).json(err.message);
  });
}

function userByID(req, res, next, id) {

  if (!_mongoose.mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json('User is invalid');
  }

  let User = _usersServerModel2.default.getModels().user;

  return User.findById(id).then(user => {
    if (!user) {
      return next('Failed to load user ' + id);
    }

    req.model = user;
    return next();
  }).catch(err => {
    return next(err.message);
  });
}

let controller = { read: read, update: update, remove: remove, list: list, userByID: userByID, userByID: userByID };

exports.default = controller;
exports.read = read;
exports.update = update;
exports.remove = remove;
exports.list = list;
exports.userByID = userByID;