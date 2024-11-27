/**
 * Created by pradeepkadiyala on 6/14/18.
 */
export class Route {
  protected Authentication;
  protected app;

  constructor(app: any,
      appPath: string,
      athentication: object) {
    this.app = app;
    this.app.set('appPath', appPath);
    this.Authentication = athentication;
  }

  protected configureApiRoutes(): void {
    // this.app.use(
    //   '/v1/',
    //   require('../../api/v1/marketplace')
    // );
    this.app.use(
      '/api/monitor',
      require('../../api/monitor')
    );
    
    this.app.use(
      '/',
      require('../../api/rtp')
    );
  }
}
