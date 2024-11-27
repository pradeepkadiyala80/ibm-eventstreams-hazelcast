//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2018 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
import * as jwt from 'jsonwebtoken';
import {Strategy as PassportJWTStrategy} from 'passport-jwt';
import {Strategy} from './index';
import * as logHelpers from '../../components/utils/logHelpers';
const loggers = logHelpers.loggers;
const logger = loggers.get('database');

export class JWTStrategy extends Strategy {
  private userService;
  public strategy;

  constructor(authOpts: any) {
    super();
    this.strategy = new PassportJWTStrategy(authOpts, this.verifyPayload);
  }

  public setAPIRoutes(app: any, passport: any) {
  }

  //This method will handle the authentication logic for jwtToken using an apikey
  private verifyPayload(req: any, jwtPayload: any, done: any) {
    done(null, jwtPayload);
  }
}
