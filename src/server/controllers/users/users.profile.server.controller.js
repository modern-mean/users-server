'use strict';

import lodash from 'lodash';
import multer from 'multer';
import { config } from '../../config/config';

function addresses(req, res) {
  let user = req.user;

  user.addresses = req.body.addresses;

  return user.save()
    .then(user => {
      res.json(user);
    }).catch(err => {
      res.status(400).json(err.message);
    });
}

function changeProfilePicture(req, res) {

  var user = req.user;
  user.profileImageURL = config.uploads.profile.public + req.file.filename;
  return user.save()
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      res.status(400).json(err.message);
    });
}

function emails(req, res) {
  let user = req.user;

  user.emails = req.body.emails;

  return user.save()
    .then(user => {
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

  return user.save()
    .then(user => {
      res.json(user);
    }).catch(err => {
      res.status(400).json(err.message);
    });
}


let controller = { addresses: addresses, changeProfilePicture: changeProfilePicture, emails: emails, me: me, update: update };

export default controller;
export {
  addresses,
  changeProfilePicture,
  emails,
  me,
  update
};
