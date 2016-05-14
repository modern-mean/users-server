import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import sinonPromised from 'sinon-as-promised';
import promised from 'chai-as-promised';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import mean from 'modern-mean-core-server/dist/server/app/init';
import { load } from 'modern-mean-core-server/dist/server/config/server';
import logger from '../src/server/config/logger';
import * as config from '../src/server/config/config';
import userSeed from '../src/server/models/users.server.model.user.seed';
import userModel from '../src/server/models/users.server.model.user';
import adminModule from '../src/server/admin.users.module.js';
import userModule from '../src/server/users.module.js';


logger.debug('Users::Test::Setup::Start');

//Setup testing libraries
chai.use(promised);
chai.use(sinonChai);

//Setup environment variables and load configuration
process.env.MM_CORE_SERVER_MODULE_CUSTOM = './src/server/*.module.js';
load();

//Test user that doesn't change on seeding
let userTemplate = {
  email: 'user@test.com',
  password: 'Test123456!',
  name: {
    first: 'User',
    last: 'Test'
  }
};

//Clear Users, start mean then seed.
let User = userModel.getModels().user;
Promise.all([mean.start(), User.remove({})])
  .then(promises => {
    global.meanexpress = promises[0];
  })
  .then(userSeed.init)
  .then(users => {
    global.users = users;
  })
  .then(() => {
    return userSeed.seedUser(userTemplate);
  })
  .then(user => {
    global.testUser = user;
  });



global.expect = chai.expect;
global.express = express;
global.mongoose = mongoose;
global.should = chai.should();
global.sinon = sinon;
global.request = request;
global.config = config;
global.app = express();
global.testUserPassword = userTemplate.password;
