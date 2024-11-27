import * as helper from './index';
import * as logHelpers from '../../components/utils/logHelpers';

jest.mock('../../components/utils/logHelpers', () => {
    return {
      loggers: {
        get: () => {
          return {
            error: jest.fn()
          }
        }
      },
      initErrorLogMeta: jest.fn()
    }
});

let initErrorLogMetaSpy = jest.spyOn(logHelpers, 'initErrorLogMeta');

describe('Service helper', () => {

  describe('Log Error', () => {
    test('should log the error', async () => {
      let error = new Error('Mock test error');
      helper.logError(error);
      expect(initErrorLogMetaSpy.mock.calls.length).toBe(1);
      expect(initErrorLogMetaSpy.mock.calls[0][2]).toEqual('Mock test error');
    });
  });

  describe('Invoke Error', () => {
    test('should invoke with error', async (done) => {
      let error = new Error('Mock test error');
      helper.triggerError(error).catch(() => {
          expect(initErrorLogMetaSpy.mock.calls.length).toBe(1);
          expect(initErrorLogMetaSpy.mock.calls[0][2]).toEqual('Mock test error');
          done();
      });
    });

    test('should invoke with error message', async (done) => {
      helper.triggerError(null, 'Mock test error').catch(() => {
          expect(initErrorLogMetaSpy.mock.calls.length).toBe(1);
          expect(initErrorLogMetaSpy.mock.calls[0][2]).toEqual('Mock test error');
          done();
      });
    });
  });
});
