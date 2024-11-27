/**
 * Licensed Materials - Property of IBM
 *
 * @ Copyright IBM Corp. 2014,2015 All Rights Reserved
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with
 * IBM Corp.
 */

import * as express from 'express';
import * as http from 'http';
import * as https from 'https';
import * as passport from 'passport';
import * as fs from 'fs';
import * as path from 'path';

import { MiddleWare } from './middleware';
import config from './config/environment';

const port =  process.env.PORT || config.cfApp.port;
export class ExpressApp {
  public rootApp: any;
  public app: any;

  constructor () {
    // Initialize the identifiers
    this.rootApp = express();
    this.app = express();
    this.rootApp.use(config.webRoot, this.app);
    this.rootApp.set('x-powered-by', false);
    this.initialize();
    this.exitCallback();
  }

  private initialize() {
    //Initialize the route
    MiddleWare.initialize(this.app, passport);
  }
  /**
   * This will start the express server
   */
  public run() {
    let server = http.createServer(this.rootApp);
    server.timeout = 1000 * 60 * 10;
    server.listen(port, null, function () {
      console.log('Express server listening on '+port+', in Prod mode');
      let options = {
        port: port,
        host: 'localhost'
      };
      let request = http.request(options);
      request.setHeader('content-type', 'application/json');

      request.end();
    });
  }

  public runSSLServer() {
    let sslOpts = {
      pfx: fs.readFileSync(path.join(config.root, config.PFX))
    };
    let secure = https.createServer(sslOpts, this.rootApp);
    secure.listen(3000);
    console.log('Express server listening on 3000, in Dev mode');
  }

  private exitCallback() {
    process.on('SIGTERM', function () {
      process.exit();
    });

    process.on('SIGINT', function () {
      process.exit();
    });
  }
}
