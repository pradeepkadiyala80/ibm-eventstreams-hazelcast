// Licensed Materials - Property of IBM
// @ Copyright IBM Corp. 2017 All Rights Reserved
// US Government Users Restricted Rights - Use, duplication or
// disclosure restricted by GSA ADP Schedule Contract with IBM Corp.

// var jsonWebTokenService = require('../../middleware/auth/jsonWebTokenService');
import * as jwt from 'jsonwebtoken';

const secret = 'secret';

function requestJSONWebToken(userIUI, roles) {
  let userPayload;

  //Create new payload and create new jwt
    let payload = {
      'sub': userIUI,
      'name': 'accessToken',
      'roles': roles
    };
    return jwt.sign(payload, secret);

}

let token = requestJSONWebToken('', ['']);
console.log(token);
