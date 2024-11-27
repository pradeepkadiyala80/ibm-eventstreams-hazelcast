/**
 * Created by pradeepkadiyala on 6/14/18.
 */
import * as BodyParser from 'body-parser';
import * as path from 'path';

import config from '../config/environment';
import { ExtractJwt } from 'passport-jwt';
import { RouteDevelopment } from './routes/RouteDevelopment';
import { RouteProduction } from './routes/RouteProduction';
import { JWTStrategy } from './authentication/jwt.strategy';
import * as uuid from 'uuid';
import { loggers } from '../components/utils/logHelpers';
import { createNamespace } from 'cls-hooked';
const onFinished = require('on-finished');
const onHeaders = require('on-headers');
const cls = createNamespace(config.logging.clsLogStore);
const logger = loggers.get('app');

export class MiddleWare {
  static authentication;
  static jwtAuthentication;

  static initialize(app: any, passport: any) {
    this.setLogContext(app);
    this.setProperties(app);
    this.setBodyParser(app);
    this.setRequestLogging(app);
    this.setPassportConfig(app, passport);
    this.setRoutes(app, passport);
  }

  static setLogContext(app) {
    app.use((req, res, next) => {
      cls.run(() => {
        cls.bindEmitter(req);
        cls.bindEmitter(res);
        cls.set('correlationId', uuid.v4());
        next();
      });
    });
  }

  static setProperties(app: any) {
    app.set('x-powered-by', false);
    app.set('trust proxy', true);
  }

  static setBodyParser(app: any) {
    app.use(BodyParser.json({limit: '15mb'}));
    app.use(BodyParser.urlencoded({extended: true}));
  }

  static setRequestLogging(app: any) {
    app.use((req, res, next) => {
      req._start = process.hrtime();

      onHeaders(res, () => {
        res._start = process.hrtime();
      });

      onFinished(res, () => {
        let log = {
          message: 'server',
          type: 'http',
          label: 'express',
          process: process.pid,
          method: req.method,
          url: req.originalUrl || req.url,
          httpVersion: req.httpVersionMajor + '.' + req.httpVersionMinor,
          status: res.statusCode,
          contentLength: res.getHeader('content-length'),
          referer: req.headers.referer || req.headers.referrer,
          userAgent: req.headers['user-agent'],
          duration: ((res._start[0] - req._start[0]) * 1e9) + (res._start[1] - req._start[1])
        };

        logger.info(log);
      });

      next();
    });
  }

  static setPassportConfig(app: any, passport: any) {
    this.setJWTStrategy(app, passport);
  }

  static setJWTStrategy(app: any, passport: any) {
    this.jwtAuthentication = new JWTStrategy({
      secretOrKey: config.tokenSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
      algorithms: config.jwtAlgorithms,
      passReqToCallback: true
    });
    passport.use(this.jwtAuthentication.strategy);
    this.jwtAuthentication.setAPIRoutes(app, passport);
  }

  static setRoutes(app: any, passport: any) {
    let routes;
    let appPath = path.join(config.root, 'client');
    if(process.env.NODE_ENV === 'development') {
      routes = new RouteDevelopment(app, appPath, this.authentication);
      routes.setRoutes(passport);
    } else {
      routes = new RouteProduction(app, appPath, this.authentication);
      routes.setRoutes(passport);
    }
  }

}
