import { TranslationError } from './translation-error';
describe('Test for Translation error', () => {
  test('should construct translation error object with stacktrace', async () => {
    let transErrorObj;
    try {
      let testObj = null;
      testObj.dummyFailedCall();
    } catch (error) {
        transErrorObj = new TranslationError(error, 'Custom error message');
    }
    expect(transErrorObj.message).toEqual('Cannot read property \'dummyFailedCall\' of null');
    expect(transErrorObj.stackTrace).toBeDefined();
  });

  test('should construct translation error object without stack', async () => {
    let testError = new Error();
    testError.stack = null;
    let transErrorObj = new TranslationError(testError, 'Custom error message');
    expect(transErrorObj.message).toEqual('Custom error message');
    expect(transErrorObj.stackTrace).not.toBeDefined();
  });

  test('should construct translation error object without stacktrace', async () => {
    let resError: any = {};
    let transErrorObj = new TranslationError(resError, 'Custom error message');
    expect(transErrorObj.message).toEqual('Custom error message');
    expect(transErrorObj.stackTrace).not.toBeDefined();
  });

  test('should construct translation error object when error is null', async () => {
    let transErrorObj = new TranslationError(null, 'Custom error message');
    expect(transErrorObj.message).toEqual('Custom error message');
    expect(transErrorObj.stackTrace).toEqual('N/A');
  });

  test('should record error in the document object as an array', async () => {
    let doc:any = {};
    let testError = new Error();
    let errMesg = 'Custom error message';

    TranslationError.record(doc, testError, errMesg);

    expect(doc.error).toBeDefined();
    expect(doc.error).toBeInstanceOf(Array);
    expect(doc.error.length).toBe(1);
    expect(doc.error[0].message).toEqual('Custom error message');
  });

  test('should not record error in the document object when doc null', async () => {
    let doc:any = null;
    let testError = new Error();
    let errMesg = 'Custom error message';

    TranslationError.record(doc, testError, errMesg);
    expect(doc).toBe(null);
  });

  test('should record error in the document object - Error not Array', async () => {
    let doc:any = {
      error: {}
    };
    let testError = new Error();
    let errMesg = 'Custom error message';

    TranslationError.record(doc, testError, errMesg);
    expect(doc.error).toBeDefined();
    expect(doc.error).toBeInstanceOf(Array);
    expect(doc.error.length).toBe(1);
    expect(doc.error[0].message).toEqual('Custom error message');
  });

  test('should record error in the document object - Error is Array', async () => {
    let doc:any = {
      error: []
    };
    let testError = new Error();
    let errMesg = 'Custom error message';

    TranslationError.record(doc, testError, errMesg);
    expect(doc.error).toBeDefined();
    expect(doc.error).toBeInstanceOf(Array);
    expect(doc.error.length).toBe(1);
    expect(doc.error[0].message).toEqual('Custom error message');
  });
});
