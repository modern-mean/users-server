'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.storage = exports.filename = exports.destination = exports.filter = undefined;

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function filter(req, file, cb) {
  if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/gif') {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

function storage() {
  return _multer2.default.diskStorage({
    destination: destination,
    filename: filename
  });
}

function destination(req, file, cb) {
  cb(null, _config.config.uploads.profile.destination);
}

function filename(req, file, cb) {
  var datetimestamp = Date.now();
  cb(null, req.user._id + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
}

let service = { filter: filter, destination: destination, filename: filename, storage: storage };

exports.default = service;
exports.filter = filter;
exports.destination = destination;
exports.filename = filename;
exports.storage = storage;