'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('../config/mongoose');

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _generatePassword = require('generate-password');

var _generatePassword2 = _interopRequireDefault(_generatePassword);

var _owaspPasswordStrengthTest = require('owasp-password-strength-test');

var _owaspPasswordStrengthTest2 = _interopRequireDefault(_owaspPasswordStrengthTest);

var _usersServerSchema = require('./users.server.schema.provider');

var _usersServerSchema2 = _interopRequireDefault(_usersServerSchema);

var _usersServerSchema3 = require('./users.server.schema.email');

var _usersServerSchema4 = _interopRequireDefault(_usersServerSchema3);

var _usersServerSchema5 = require('./users.server.schema.address');

var _usersServerSchema6 = _interopRequireDefault(_usersServerSchema5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let Schema = _mongoose.mongoose.Schema;

/**
 * User Schema
 */
let UserSchema = new Schema({
  addresses: [_usersServerSchema6.default],
  emails: [_usersServerSchema4.default],
  name: {
    first: {
      type: String,
      trim: true,
      required: 'Please provide a first name'
    },
    last: {
      type: String,
      trim: true,
      required: 'Please provide a last name'
    }
  },
  profileImageURL: {
    type: String,
    default: '/dist/img/modern-mean-users-material/profile/default.png'
  },
  providers: [_usersServerSchema2.default],
  timestamps: {
    updated: {
      type: Date
    },
    created: {
      type: Date,
      default: Date.now
    }
  }
});

/*
*Virtuals
*/
UserSchema.virtual('name.full').get(function () {
  return this.name.first + ' ' + this.name.last;
});

/**
 * PreSave
 */
UserSchema.pre('save', function (next) {
  if (this.isModified()) {
    this.timestamps.updated = Date.now();
  }

  next();
});

UserSchema.set('toJSON', {
  virtuals: true
});

exports.default = UserSchema;