const requestCb = jest.fn();
//mock Request
jest.mock('request', () => {
  return requestCb
});
import { RequestInterface } from './request.interface';
describe('Request interface test', () => {
  test('fail to create a request interface object', async (done) => {
    try{
      let obj = new RequestInterface();
    } catch(error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual('Can not construct RequestInterface class.');
      done();
    }
  });

  test('send request successfully', async (done) => {
    requestCb.mockImplementation((opts, cb) => {
      cb(null, {statusCode: 200}, {message: 'success'});
    });
    let opts = {desc: 'request options'};
    RequestInterface.sendRequest(opts).then((result) => {
      expect(requestCb.mock.calls.length).toBe(1);
      expect(requestCb.mock.calls[0][0]).toEqual(opts);
      expect(result).toEqual({
        options: opts,
        data: {
          message: 'success'
        }
      });
      done();
    });
  });

  test('send request failed with error reject', async (done) => {
    let err = new Error('Failed to connect');
    requestCb.mockImplementation((opts, cb) => {
      cb(err, {statusCode: 500}, null);
    });
    let opts = {desc: 'request options'};
    RequestInterface.sendRequest(opts).catch((result) => {
      expect(requestCb.mock.calls.length).toBe(1);
      expect(requestCb.mock.calls[0][0]).toEqual(opts);
      expect(result).toEqual(err);
      done();
    });
  });

  test('send request failed without error reject', async (done) => {
    let body = {message: 'Failed to connect'};
    requestCb.mockImplementation((opts, cb) => {
      cb(null, {statusCode: 500}, body);
    });
    let opts = {desc: 'request options'};
    RequestInterface.sendRequest(opts).catch((result) => {
      expect(requestCb.mock.calls.length).toBe(1);
      expect(requestCb.mock.calls[0][0]).toEqual(opts);
      expect(result.message).toEqual('Failed to connect');
      done();
    });
  });
})
