/**
 * Created by pradeepkadiyala on 6/14/18.
 */
import * as proxy from 'http-proxy-middleware';

import config from '../../config/environment';
import { Route } from './Route';

export class RouteDevelopment extends Route {
  constructor(app: any,
      appPath: string,
      athentication: object) {
    super(app, appPath, athentication);
  }

  public setRoutes(passport: any) {
    this.configureApiRoutes();
  }
}
