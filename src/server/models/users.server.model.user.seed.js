'use strict';

import chalk from 'chalk';
import logger from '../config/logger';
import userModel from './users.server.model.user';
import { acl } from '../config/acl.js';

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
  let User = userModel.getModels().user;
  users.user = undefined;
  return User.remove({ 'providers.email': userTemplate.email });
}

function removeAdmin() {
  let User = userModel.getModels().user;
  users.admin = undefined;
  return User.remove({ 'providers.email': adminTemplate.email });
}


function getUser(template) {
  return new Promise((resolve, reject) => {
    let User = userModel.getModels().user;

    User.findOne({ 'providers.email': template.email, 'providers.type': 'local' })
      .then(user => {
        if (!user) {
          logger.debug('Users::Model::Seed::getUser::Creating');
          return resolve(new User(template));
        }
        logger.debug('Users::Model::Seed::getUser::Found');
        return resolve(user);
      })
      .catch(err => {
        logger.error('Users::Model::Seed::getUser', err);
        reject(err);
      });
  });
}

function seedUser(template) {
  return new Promise((resolve, reject) => {
    logger.debug('Users::Model::Seed::User::Start');
    let LocalProvider = userModel.getModels().provider;
    let Email = userModel.getModels().email;
    if (!template) {
      template = userTemplate;
    }
    let passwordPromise = LocalProvider.generateRandomPassphrase();
    let userPromise = getUser(template);

    Promise.all([passwordPromise, userPromise])
      .then(promises => {
        let user = promises[1];
        let password = template.password || promises[0];

        //Set email if its not set
        if (user.emails.length === 0) {
          let email = new userModel.getModels().email({
            email: template.email,
            primary: true
          });
          user.emails.push(email);
        }

        //Set address if its not set
        if (user.addresses.length === 0) {
          let address = new userModel.getModels().address({
            addressType: 'Shipping',
            streetAddress: '123 Bedrock',
            locality: 'Hollywood',
            region: 'CA',
            postalCode: '90210',
            country: 'US'
          });
          logger.debug('Users::Model::Seed::Address::Added');
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
        logger.debug('Users::Model::Seed::User::PreSave');
        return user.save()
          .then(() => {
            logger.debug('Users::Model::Seed::User::PostSave');
            return acl.addUserRoles(user._id.toString(), ['user'])
                .then(() => {
                  users.user = user.toObject();
                  users.user.password = password;
                  logger.info('Users::Model::Seed::User::' + chalk.bold.magenta(user.providers[0].email + ':' + password));
                  return resolve(user);
                })
                .catch(err => {
                  console.log(chalk.bold.red('Users::Model::Seed::User::Role::Error::' + err));
                  return reject(err);
                });
          })
          .catch(err => {
            console.log(chalk.bold.red('Users::Model::Seed::User::Error::' + err));
            return reject(err);
          });



      });
  });
}

function seedAdmin() {
  return new Promise((resolve, reject) => {

    let LocalProvider = userModel.getModels().provider;
    let Email = userModel.getModels().email;

    let passwordPromise = LocalProvider.generateRandomPassphrase();
    let userPromise = getUser(adminTemplate);

    Promise.all([passwordPromise, userPromise])
      .then(promises => {
        let user = promises[1];
        let password = promises[0];

        //Set email if its not set
        if (user.emails.length === 0) {
          let email = new userModel.getModels().email({
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

        user.save()
          .then(() => {
            acl
            .addUserRoles(user._id.toString(), ['admin'])
            .then(() => {
              users.admin = user.toObject();
              users.admin.password = password;
              logger.info('Users::Model::Seed::User::' + chalk.bold.magenta(user.emails[0].email + ':' + password));
              resolve(user);
            })
            .catch(err => {
              console.log(chalk.bold.red('Users::Model::Seed::Admin::Role::Error::' + err));
              reject(err);
            });

          })
          .catch(err => {
            console.log(chalk.bold.red('Users::Model::Seed::Admin::Error::' + err));
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

    logger.debug('Users::Model::Seed::Start');
    seedUser()
      .then(seedAdmin)
      .then(() => {
        logger.verbose('Users::Model::Seed::Success');
        resolve(users);
      })
      .catch((err) => {
        console.log(chalk.bold.red('Users::Model::Seed::Error::' + err));
        reject(err);
      });


  });
}

function getUsers() {
  return users;
}



let service = { init: init, getUsers: getUsers, seedUser: seedUser, seedAdmin: seedAdmin, removeUser: removeUser, removeAdmin: removeAdmin };

export default service;
export { init, getUsers, seedUser, seedAdmin, removeUser, removeAdmin };
