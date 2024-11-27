const mockApp = {
  use: jest.fn()
};
const mockProxy = jest.fn();
const mockReq = {
  path: ''
};
const mockNext = jest.fn();

let routeDev;

jest.mock('./Route');

import { Route } from './Route';
import config from '../../config/environment';
import { RouteDevelopment } from './RouteDevelopment';

describe('RouteDevelopment class test', () => {
  beforeEach(() => {
    routeDev = new RouteDevelopment(mockApp, 'app path', {});
    routeDev['app'] = mockApp;
  });

  test('should extend Route class', async () => {
    expect(Route).toHaveBeenCalledTimes(1);
    expect(Route).toHaveBeenCalledWith(mockApp, 'app path', {});
  });

  test('should set dev routes', async () => {
    routeDev.setRoutes({});
    expect(routeDev.configureApiRoutes).toHaveBeenCalled();
  });
});
