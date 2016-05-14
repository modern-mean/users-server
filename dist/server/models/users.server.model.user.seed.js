'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeAdmin = exports.removeUser = exports.seedAdmin = exports.seedUser = exports.getUsers = exports.init = undefined;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _logger = require('../config/logger');

var _logger2 = _interopRequireDefault(_logger);

var _usersServerModel = require('./users.server.model.user');

var _usersServerModel2 = _interopRequireDefault(_usersServerModel);

var _acl = require('../config/acl.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let users = {};

let userTemplate = {
  email: 'user@localhost.com',
  name: {
    first: 'User',
    last: 'Local'
  }
};

let adminTemplate = {
  email: 'admin@localhost.com',
  name: {
    first: 'User',
    last: 'Admin'
  }
};

function removeUser() {
  let User = _usersServerModel2.default.getModels().user;
  users.user = undefined;
  return User.remove({ 'providers.email': userTemplate.email });
}

function removeAdmin() {
  let User = _usersServerModel2.default.getModels().user;
  users.admin = undefined;
  return User.remove({ 'providers.email': adminTemplate.email });
}

function getUser(template) {
  return new Promise((resolve, reject) => {
    let User = _usersServerModel2.default.getModels().user;

    User.findOne({ 'providers.email': template.email, 'providers.type': 'local' }).then(user => {
      if (!user) {
        _logger2.default.debug('Users::Model::Seed::getUser::Creating');
        return resolve(new User(template));
      }
      _logger2.default.debug('Users::Model::Seed::getUser::Found');
      return resolve(user);
    }).catch(err => {
      _logger2.default.error('Users::Model::Seed::getUser', err);
      reject(err);
    });
  });
}

function seedUser(template) {
  return new Promise((resolve, reject) => {
    _logger2.default.debug('Users::Model::Seed::User::Start');
    let LocalProvider = _usersServerModel2.default.getModels().provider;
    let Email = _usersServerModel2.default.getModels().email;
    if (!template) {
      template = userTemplate;
    }
    let passwordPromise = LocalProvider.generateRandomPassphrase();
    let userPromise = getUser(template);

    Promise.all([passwordPromise, userPromise]).then(promises => {
      let user = promises[1];
      let password = template.password || promises[0];

      //Set email if its not set
      if (user.emails.length === 0) {
        let email = new _usersServerModel2.default.getModels().email({
          email: template.email,
          primary: true
        });
        user.emails.push(email);
      }

      //Set address if its not set
      if (user.addresses.length === 0) {
        let address = new _usersServerModel2.default.getModels().address({
          addressType: 'Shipping',
          streetAddress: '123 Bedrock',
          locality: 'Hollywood',
          region: 'CA',
          postalCode: '90210',
          country: 'US'
        });
        _logger2.default.debug('Users::Model::Seed::Address::Added');
        user.addresses.push(address);
      }

      //Remove Providers
      user.providers = [];
      //Set provider
      let provider = new LocalProvider({
        type: 'local',
        email: template.email,
        clearpassword: password
      });

      user.providers.push(provider);
      _logger2.default.debug('Users::Model::Seed::User::PreSave');
      return user.save().then(() => {
        _logger2.default.debug('Users::Model::Seed::User::PostSave');
        return _acl.acl.addUserRoles(user._id.toString(), ['user']).then(() => {
          users.user = user.toObject();
          users.user.password = password;
          _logger2.default.info('Users::Model::Seed::User::' + _chalk2.default.bold.magenta(user.providers[0].email + ':' + password));
          return resolve(user);
        }).catch(err => {
          console.log(_chalk2.default.bold.red('Users::Model::Seed::User::Role::Error::' + err));
          return reject(err);
        });
      }).catch(err => {
        console.log(_chalk2.default.bold.red('Users::Model::Seed::User::Error::' + err));
        return reject(err);
      });
    });
  });
}

function seedAdmin() {
  return new Promise((resolve, reject) => {

    let LocalProvider = _usersServerModel2.default.getModels().provider;
    let Email = _usersServerModel2.default.getModels().email;

    let passwordPromise = LocalProvider.generateRandomPassphrase();
    let userPromise = getUser(adminTemplate);

    Promise.all([passwordPromise, userPromise]).then(promises => {
      let user = promises[1];
      let password = promises[0];

      //Set email if its not set
      if (user.emails.length === 0) {
        let email = new _usersServerModel2.default.getModels().email({
          email: adminTemplate.email,
          primary: true
        });
        user.emails.push(email);
      }

      //Remove Providers
      user.providers = [];
      //Set provider
      let provider = new LocalProvider({
        type: 'local',
        email: adminTemplate.email,
        clearpassword: password
      });

      user.providers.push(provider);

      user.save().then(() => {
        _acl.acl.addUserRoles(user._id.toString(), ['admin']).then(() => {
          users.admin = user.toObject();
          users.admin.password = password;
          _logger2.default.info('Users::Model::Seed::User::' + _chalk2.default.bold.magenta(user.emails[0].email + ':' + password));
          resolve(user);
        }).catch(err => {
          console.log(_chalk2.default.bold.red('Users::Model::Seed::Admin::Role::Error::' + err));
          reject(err);
        });
      }).catch(err => {
        console.log(_chalk2.default.bold.red('Users::Model::Seed::Admin::Error::' + err));
        reject(err);
      });
    });
  });
}

function init() {
  return new Promise(function (resolve, reject) {

    if (users.admin !== undefined && users.user !== undefined) {
      return resolve(users);
    }

    _logger2.default.debug('Users::Model::Seed::Start');
    seedUser().then(seedAdmin).then(() => {
      _logger2.default.verbose('Users::Model::Seed::Success');
      resolve(users);
    }).catch(err => {
      console.log(_chalk2.default.bold.red('Users::Model::Seed::Error::' + err));
      reject(err);
    });
  });
}

function getUsers() {
  return users;
}

let service = { init: init, getUsers: getUsers, seedUser: seedUser, seedAdmin: seedAdmin, removeUser: removeUser, removeAdmin: removeAdmin };

exports.default = service;
exports.init = init;
exports.getUsers = getUsers;
exports.seedUser = seedUser;
exports.seedAdmin = seedAdmin;
exports.removeUser = removeUser;
exports.removeAdmin = removeAdmin;