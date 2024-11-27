//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2018 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.

import * as controller from './monitor.controller';

describe('monitor controller', function () {
  test('should check availability', async () => {
    let req = {};
    let res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    controller.checkAvailability(req, res);
    expect(res.status.mock.calls[0][0]).toBe(200);
    expect(res.json.mock.calls[0][0]).toEqual({
      success: true
    });
  });

});
