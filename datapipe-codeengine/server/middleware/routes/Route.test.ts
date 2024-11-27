let hasLoginError = false;
const mockLogin = jest.fn();
const mockSave = jest.fn();
const mockDestroy = jest.fn();
const mockRequest = {
  login: mockLogin,
  session: {
    destroy: mockDestroy,
    returnTo: '/home',
    save: mockSave
  },
  logOut: jest.fn()
};

const mockEnd = jest.fn();
const mockStatus = jest.fn();
const mockResponse = {
  redirect: jest.fn(),
  clearCookie: jest.fn(),
  status: mockStatus,
  end: mockEnd
};
const mockNext = jest.fn();

const mockGetCallBackFn = jest.fn();

const mockGet = jest.fn();

//mock app
let mockApp = {
  set: jest.fn(),
  use: jest.fn(),
  get: mockGet
}

//mockIs function
const mockIsFn = jest.fn();

const mockRoles = {
  is: mockIsFn
};

//mock roles
jest.mock('../roles', () => (
  {
    default: mockRoles
  })
);

const mockReturnAuthFn = jest.fn();
let mockError = null;
let mockUser = {iui: '123XXX'};
let mockInfo = {desc: 'info'};

const mockAuthenticate = jest.fn();
const mockPassport = {
  authenticate: mockAuthenticate
};

import { Route } from './Route';
import config from '../../config/environment';

describe('Route class test', () => {
  beforeEach(() => {
    mockError = null;
    mockUser = {iui: '123XXX'};
    mockInfo = {desc: 'info'};
    hasLoginError = false;
    mockRequest.session.returnTo = '/home';

    mockAuthenticate.mockImplementation((authType, cb) => {
      if (cb) {
        cb(mockError, mockUser, mockInfo);
        return mockReturnAuthFn;
      }
    });

    mockLogin.mockImplementation((user, cb) => {
      cb(hasLoginError);
    });

    mockStatus.mockReturnThis();

    mockGet.mockImplementation((path, cb) => {
      if(cb instanceof Function) {
        cb(mockRequest, mockResponse, mockNext);
      }
    });

    mockSave.mockImplementation((cb) => {
      cb(null);
    });

    mockDestroy.mockImplementation((cb) => {
      cb();
    });
  });

  test('initialize the Route class', async () => {
    let route = new Route(mockApp,
      '/marketplace/operator/service/translations',
      {});
    expect(mockApp.set.mock.calls.length).toBe(1);
    expect(mockApp.set.mock.calls[0][0]).toEqual('appPath');
    expect(mockApp.set.mock.calls[0][1]).toEqual('/marketplace/operator/service/translations');
  });


  test('configure Api routes', async () => {
    let route = new Route(mockApp,
      '/marketplace/operator/service/translations',
      {});
    route['configureApiRoutes']();

    expect(mockApp.use.mock.calls.length).toBe(1);
    expect(mockApp.use.mock.calls[0][0]).toEqual('/api/monitor');
    expect(mockApp.use.mock.calls[0][1]).toEqual(require('../../api/monitor/'));
    //expect(mockApp.use.mock.calls[0][0]).toEqual('/v1/');
    // expect(mockApp.use.mock.calls[0][1]).toEqual(require('../../api/v1/marketplace'));
  });
});
