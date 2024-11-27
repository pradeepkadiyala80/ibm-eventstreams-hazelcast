import { ERROR_CODES } from "../../components/errors/error.codes";
import * as apiHelper from './api-helper';

describe('API Helper', () => {
  let resObj = {};
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    }
  });

  describe('success response', () => {
    test('should return success response', () => {
      let response = apiHelper.success(res, resObj, [123456, 123456]);
      expect(response.status.mock.calls.length).toBe(1);
      expect(response.status.mock.calls[0][0]).toBe(200);
      expect(response.json.mock.calls.length).toBe(1);
      expect(response.json.mock.calls[0][0]).toBe(resObj);
    });
  });

  describe('failed response', () => {
    let err;
    beforeEach(() => {
      err = {
          status: ERROR_CODES.BAD_REQUEST_ERROR,
          message: 'User defined exception'
      };
    });
    test('should return failed response', () => {
      let response = apiHelper.failed(res, err, [123456, 123456]);
      expect(response.status.mock.calls.length).toBe(1);
      expect(response.status.mock.calls[0][0]).toBe(ERROR_CODES.BAD_REQUEST_ERROR);
      expect(response.json.mock.calls.length).toBe(1);
      expect(response.json.mock.calls[0][0].message).toBe(err.message);

    });

    test('should return failed response when error code does not exists', () => {
      delete err.status;
      let response = apiHelper.failed(res, err, [123456, 123456]);
      expect(response.status.mock.calls.length).toBe(1);
      expect(response.status.mock.calls[0][0]).toBe(ERROR_CODES.CRITICAL_ERROR);
      expect(response.json.mock.calls.length).toBe(1);
      expect(response.json.mock.calls[0][0].message).toBe('Failed to perform request');
    });
  });

});
