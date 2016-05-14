'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('../config/mongoose');

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let Schema = _mongoose.mongoose.Schema;

let AddressSchema = new Schema({
  streetAddress: {
    type: String,
    trim: true,
    required: true
  },
  extendedAddress: {
    type: String,
    trim: true
  },
  locality: {
    type: String,
    trim: true,
    required: true
  },
  region: {
    type: String,
    trim: true,
    required: true
  },
  postalCode: {
    type: String,
    trim: true,
    required: true
  },
  country: {
    type: String,
    trim: true,
    required: true
  },
  addressType: {
    type: String,
    enum: ['Shipping', 'Billing']
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
AddressSchema.pre('save', function (next) {
  if (this.isModified()) {
    this.timestamps.updated = Date.now();
  }

  next();
});

exports.default = AddressSchema;