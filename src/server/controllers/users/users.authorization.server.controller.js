'use strict';

import { acl } from '../../config/acl';

function read(req, res) {
  let response = {};

  return acl
    .userRoles(req.user._id.toString())
    .then(roles => {
      response.roles = roles;
      return roles;
    })
    .then(roles => {
      return acl
        .whatResources(roles)
        .then(resources => {
          response.resources = resources;
          return resources;
        });
    })
    .then(() => {
      return res.json(response);
    })
    .catch(err => {
      return res.status(500).json(err.message);
    });
}


let controller = { read: read };

export default controller;
export { read };
