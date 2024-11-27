//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2018 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.


const mockAuthOpts = {};

const mockApp  = {
  use: jest.fn()
};

const mockPassport  = {
  authenticate: jest.fn()
};
const mockDone = jest.fn();

const mockStrategy = function(opts, verify) {
  verify({}, {sub:'jwtSub', name:'jwtName', roles: 'jwtRoles'}, mockDone);
  return {};
};

const mockPassportJWTStrategy = {
  Strategy: mockStrategy
};

jest.mock('passport-jwt', () => {
  return mockPassportJWTStrategy;
});

import {JWTStrategy} from './jwt.strategy';

describe('setting JwtStrategy', () => {

  test('should create JWTObject for user resolve', async() => {
    let strategyObj = await new JWTStrategy(mockAuthOpts);
    expect(strategyObj.strategy).toBeDefined();
  });

  test('test api routes', async() => {
    mockPassport.authenticate.mockImplementation(() => {
      return {};
    });
    let strategyObj = await new JWTStrategy(mockAuthOpts);
    strategyObj.setAPIRoutes(mockApp, mockPassport);
  })

});
