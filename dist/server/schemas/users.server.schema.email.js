'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('../config/mongoose');

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let Schema = _mongoose.mongoose.Schema;

/**
 * A Validation function for local strategy email
 */
let validateEmail = function validateEmail(email) {
  return _validator2.default.isEmail(email, { require_tld: false });
};

let EmailSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    validate: [validateEmail, 'Please fill a valid email address']
  },
  primary: {
    type: Boolean,
    required: true,
    default: false
  },
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

/**
* PreSave
*/
EmailSchema.pre('save', function (next) {
  if (this.isModified()) {
    this.timestamps.updated = Date.now();
  }

  next();
});

EmailSchema.index({ email: 1 });

exports.default = EmailSchema;