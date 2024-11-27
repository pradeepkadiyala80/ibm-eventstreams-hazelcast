/**
 * Created by pradeepkadiyala on 6/14/18.
 */
import * as express from 'express';
import * as path from 'path';

import config from '../../config/environment';
import { Route } from './Route';

export class RouteProduction extends Route {

  constructor(app: any,
      appPath: string,
      athentication: object) {
    super(app, appPath, athentication);
  }

  public setRoutes(passport: any): void {
    this.configureApiRoutes();
  }
}
