'use strict';

import { mongoose } from '../config/mongoose';
import crypto from 'crypto';
import validator from 'validator';
import generatePassword from 'generate-password';
import owasp from 'owasp-password-strength-test';
import Provider from './users.server.schema.provider';
import Email from './users.server.schema.email';
import Address from './users.server.schema.address';

let Schema = mongoose.Schema;

/**
 * User Schema
 */
let UserSchema = new Schema({
  addresses: [Address],
  emails: [Email],
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
  providers: [Provider],
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
UserSchema.virtual('name.full')
  .get(function () {
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


export default UserSchema;
