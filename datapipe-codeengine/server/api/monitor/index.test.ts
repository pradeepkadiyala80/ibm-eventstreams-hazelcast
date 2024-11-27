//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2018 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.

const get = jest.fn();
jest.mock('express', () => {
  return {
    Router: () => {
      return {
        get: get
      };
    }
  }
});

describe('monitor index', function () {
  test('should create monitor api index', async () => {
    require('./index');

    expect(get.mock.calls.length).toEqual(1);
    expect(get.mock.calls[0][0]).toEqual('/v1/availability');
    expect(get.mock.calls[0][1]).toBeInstanceOf(Function);
    expect(get.mock.calls[0][1].name).toBe('checkAvailability');
  });
});
