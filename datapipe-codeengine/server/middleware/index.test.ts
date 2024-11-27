//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2018 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.

const mockRouteDvelopment = jest.fn();
const mockRouter = {
  setRoutes: jest.fn()
};
const mockRouteProduction = jest.fn();
const mockPassport = {
  initialize: jest.fn(),
  session: jest.fn(),
  serializeUser: jest.fn(),
  deserializeUser: jest.fn(),
  use: jest.fn(),
  authenticate: jest.fn()
};
const mockApp = {
  set: jest.fn(),
  use: jest.fn()
};
const mockRes = {
  redirect: jest.fn(),
  set: jest.fn(),
  header: jest.fn(),
  cookie: jest.fn(),
  getHeader: jest.fn(),
  statusCode: 200
};
const mockReq = {
  headers: {
    'user-agent': 'user-agent',
    referer: null,
    referrer: null
  },
  user: null,
  originalUrl: 'test_original_url',
  url: 'test_url',
  csrfToken: null,
  method: 'GET',
  httpVersionMajor: 1,
  httpVersionMinor: 1
};
const mockCls = {
  run: jest.fn(),
  bindEmitter: jest.fn(),
  set: jest.fn()
};
const mockDone = jest.fn();
const mockNext = jest.fn();
const mockOnHeaders = jest.fn();
const mockOnFinished = jest.fn();
const mockLogInfo = jest.fn();

jest.mock('./routes/RouteDevelopment', () => {
  return {
    RouteDevelopment: mockRouteDvelopment
  }
});
jest.mock('./routes/RouteProduction', () => {
  return {
    RouteProduction: mockRouteProduction
  }
});
jest.mock('on-headers', () => {
  return mockOnHeaders;
});
jest.mock('on-finished', () => {
  return mockOnFinished;
});
jest.mock('cls-hooked', () => {
  return {
    createNamespace: () => {
      return mockCls;
    }
  };
});
jest.mock('../components/utils/logHelpers', () => {
  return {
    loggers: {
      get: () => {
        return {
          info: mockLogInfo
        }
      }
    }
  };
});

import config from '../config/environment';
import { MiddleWare } from './index';
import {Strategy as PassportJWTStrategy} from 'passport-jwt';

describe('setting up middleware', () => {
  const OLD_ENV = process.env;

  test('should set routes for development environment', async () => {
    process.env.NODE_ENV = 'development';
    mockRouteDvelopment.mockImplementation(() => {
      return mockRouter;
    });

    MiddleWare.setRoutes(mockApp, mockPassport);

    expect(mockRouteDvelopment.mock.calls.length).toBe(1);
    expect(mockRouteDvelopment.mock.calls[0].length).toBe(3);
    expect(mockRouteDvelopment.mock.calls[0][0]).toEqual(mockApp);
    expect(mockRouteDvelopment.mock.calls[0][1]).toBe(config.root + '/' + 'client');

    expect(mockRouter.setRoutes.mock.calls.length).toBe(1);
    expect(mockRouter.setRoutes.mock.calls[0][0]).toBe(mockPassport);
    process.env = { ...OLD_ENV };
  });

  test('should set routes for production environment', async () => {
    process.env.NODE_ENV = 'production';
    mockRouteProduction.mockImplementation(() => {
      return mockRouter;
    });

    MiddleWare.setRoutes(mockApp, mockPassport);

    expect(mockRouteProduction.mock.calls.length).toBe(1);
    expect(mockRouteProduction.mock.calls[0].length).toBe(3);
    expect(mockRouteProduction.mock.calls[0][0]).toEqual(mockApp);
    expect(mockRouteProduction.mock.calls[0][1]).toBe(config.root + '/' + 'client');

    expect(mockRouter.setRoutes.mock.calls.length).toBe(1);
    expect(mockRouter.setRoutes.mock.calls[0][0]).toBe(mockPassport);
    process.env = { ...OLD_ENV };
  });

  test('should set properties', async () => {
    MiddleWare.setProperties(mockApp);
    expect(mockApp.set.mock.calls.length).toBe(2);
    expect(mockApp.set.mock.calls[0][0]).toBe('x-powered-by');
    expect(mockApp.set.mock.calls[0][1]).toBeFalsy();
    expect(mockApp.set.mock.calls[1][0]).toBe('trust proxy');
    expect(mockApp.set.mock.calls[1][1]).toBeTruthy();
  });

  test('should set body parser', async () => {
    MiddleWare.setBodyParser(mockApp);
    expect(mockApp.use.mock.calls.length).toBe(2);
    expect(mockApp.use.mock.calls[0][0]).toBeInstanceOf(Function);
    expect(mockApp.use.mock.calls[1][0]).toBeInstanceOf(Function);
  });

  test('should set request logging', async () => {
    mockOnHeaders.mockImplementation((res, cb) => {
      cb();
    });
    mockOnFinished.mockImplementation((res, cb) => {
      cb();
    });
    mockApp.use.mockImplementation((cb) => {
      cb(mockReq, mockRes, mockNext);
    });
    mockReq.headers.referer = 'referer';
    MiddleWare.setRequestLogging(mockApp);
    expect(mockLogInfo.mock.calls.length).toBe(1);
    expect(mockLogInfo.mock.calls[0][0].message).toBe('server');
    expect(mockLogInfo.mock.calls[0][0].type).toBe('http');
    expect(mockLogInfo.mock.calls[0][0].label).toBe('express');
    expect(mockLogInfo.mock.calls[0][0].process).toBe(process.pid);
    expect(mockLogInfo.mock.calls[0][0].method).toBe(mockReq.method);
    expect(mockLogInfo.mock.calls[0][0].url).toBe(mockReq.originalUrl);
    expect(mockLogInfo.mock.calls[0][0].httpVersion).toBe(mockReq.httpVersionMajor + '.' + mockReq.httpVersionMinor);
    expect(mockLogInfo.mock.calls[0][0].status).toBe(mockRes.statusCode);
    expect(mockLogInfo.mock.calls[0][0].contentLength).toBe(mockRes.getHeader('content-length'));
    expect(mockLogInfo.mock.calls[0][0].referer).toBe(mockReq.headers.referer);
    expect(mockLogInfo.mock.calls[0][0].userAgent).toBe(mockReq.headers['user-agent']);
    expect(typeof mockLogInfo.mock.calls[0][0].duration).toBe('number');
  });

  test('should set request logging - original url not present', async () => {
    mockOnHeaders.mockImplementation((res, cb) => {
      cb();
    });
    mockOnFinished.mockImplementation((res, cb) => {
      cb();
    });
    mockApp.use.mockImplementation((cb) => {
      cb(mockReq, mockRes, mockNext);
    });
    mockReq.headers.referer = null;
    mockReq.headers.referrer = 'referrer';
    mockReq.originalUrl = null;
    MiddleWare.setRequestLogging(mockApp);
    expect(mockLogInfo.mock.calls.length).toBe(1);
    expect(mockLogInfo.mock.calls[0][0].url).toBe(mockReq.url);
    expect(mockLogInfo.mock.calls[0][0].referer).toBe(mockReq.headers.referrer);
    mockReq.originalUrl = 'test_original_url';
  });


  test('should set JWT strategy', async () => {
    MiddleWare.setPassportConfig(mockApp, mockPassport);
    expect(mockPassport.use.mock.calls[0][0]).toBeInstanceOf(PassportJWTStrategy);
  });

  test('should initialize', async () => {
    let spySetProps  = jest.spyOn(MiddleWare, 'setProperties');
    let spySetBodyParser  = jest.spyOn(MiddleWare, 'setBodyParser');
    let spySetReqLog  = jest.spyOn(MiddleWare, 'setRequestLogging');
    let spySetPassportConfig  = jest.spyOn(MiddleWare, 'setPassportConfig');
    let spySetRoutes  = jest.spyOn(MiddleWare, 'setRoutes');
    process.env.NODE_ENV = 'development';
    mockRouteDvelopment.mockImplementation(() => {
      return mockRouter;
    });
    MiddleWare.initialize(mockApp, mockPassport);
    process.env = { ...OLD_ENV };
    expect(spySetProps).toHaveBeenCalled();
    expect(spySetBodyParser).toHaveBeenCalled();
    expect(spySetReqLog).toHaveBeenCalled();
    expect(spySetPassportConfig).toHaveBeenCalled();
    expect(spySetRoutes).toHaveBeenCalled();
  });

  test('should set log context', async () => {
    mockCls.run.mockImplementation((cb) => {
      cb();
    });
    mockApp.use.mockImplementation((cb) => {
      cb(mockReq, mockRes, mockNext);
    });
    try{
        MiddleWare.setLogContext(mockApp);
    } catch(e) {console.log(e)};

    expect(mockCls.bindEmitter.mock.calls.length).toBe(2);
    expect(mockCls.run.mock.calls.length).toBe(1);
    expect(mockCls.set.mock.calls.length).toBe(1);
    expect(mockCls.bindEmitter.mock.calls[0][0]).toEqual(mockReq);
    expect(mockCls.bindEmitter.mock.calls[1][0]).toEqual(mockRes);
    expect(mockCls.set.mock.calls[0][0]).toBe('correlationId');
    expect(typeof mockCls.set.mock.calls[0][1]).toBe('string');
  });
});
