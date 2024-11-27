const mockApp = {
  use: jest.fn()
};
const mockExpressStatic = jest.fn();

let routeProd;

jest.mock('./Route');
jest.mock('express', () => {
  return {
    static: mockExpressStatic
  };
});

import { Route } from './Route';
import config from '../../config/environment';
import * as path from 'path';
import { RouteProduction } from './RouteProduction';


describe('RouteProduction class test', () => {
  beforeEach(() => {
    routeProd = new RouteProduction(mockApp, 'app path', {});
    routeProd['app'] = mockApp;
  });

  test('should extend Route class', async () => {
    expect(Route).toHaveBeenCalledTimes(1);
    expect(Route).toHaveBeenCalledWith(mockApp, 'app path', {});
  });

  test('should set default routes', async () => {
    routeProd.setRoutes({});
    expect(routeProd.configureApiRoutes).toHaveBeenCalled();
  });
});
