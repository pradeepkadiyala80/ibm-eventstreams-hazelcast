//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2018 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.

const mockStoreMetadataProperty = jest.fn();
const mockGetDuration = jest.fn();
jest.mock('./logger', () => {
  return {
    Logger: () => {
      return {
        storeMetadataProperty: mockStoreMetadataProperty,
        getDuration: mockGetDuration
      };
    }
  };
});
import * as logHelpers from './logHelpers'

describe('Log helper test', () => {
  test('should init an event workflow log - missing body', async () => {
    logHelpers.initEventWorkFlowLog('test task');
    expect(mockStoreMetadataProperty.mock.calls.length).toBe(2);
    expect(mockStoreMetadataProperty.mock.calls[0][0]).toBe('type');
    expect(mockStoreMetadataProperty.mock.calls[0][1]).toBe('event');
    expect(mockStoreMetadataProperty.mock.calls[1][0]).toBe('task');
    expect(mockStoreMetadataProperty.mock.calls[1][1]).toBe('test task');
  });

  test('should init an event workflow log', async () => {
    logHelpers.initEventWorkFlowLog('test task', {});
    expect(mockStoreMetadataProperty.mock.calls.length).toBe(3);
    expect(mockStoreMetadataProperty.mock.calls[0][0]).toBe('type');
    expect(mockStoreMetadataProperty.mock.calls[0][1]).toBe('event');
    expect(mockStoreMetadataProperty.mock.calls[1][0]).toBe('task');
    expect(mockStoreMetadataProperty.mock.calls[1][1]).toBe('test task');
    expect(mockStoreMetadataProperty.mock.calls[2][0]).toBe('body');
    expect(mockStoreMetadataProperty.mock.calls[2][1]).toEqual({});
  });

  test('should init an API workflow log - missing body and query', async () => {
    logHelpers.initAPIWorkFlowLog('test task', 'test action');
    expect(mockStoreMetadataProperty.mock.calls.length).toBe(3);
    expect(mockStoreMetadataProperty.mock.calls[0][0]).toBe('type');
    expect(mockStoreMetadataProperty.mock.calls[0][1]).toBe('workflow');
    expect(mockStoreMetadataProperty.mock.calls[1][0]).toBe('task');
    expect(mockStoreMetadataProperty.mock.calls[1][1]).toBe('test task');
    expect(mockStoreMetadataProperty.mock.calls[2][0]).toBe('action');
    expect(mockStoreMetadataProperty.mock.calls[2][1]).toEqual('test action');
  });

  test('should init an API workflow log', async () => {
    let body = {
      test: 'test body'
    };
    let query = {
      test: 'test query'
    };
    logHelpers.initAPIWorkFlowLog('test task', 'test action', body, query);
    expect(mockStoreMetadataProperty.mock.calls.length).toBe(5);
    expect(mockStoreMetadataProperty.mock.calls[0][0]).toBe('type');
    expect(mockStoreMetadataProperty.mock.calls[0][1]).toBe('workflow');
    expect(mockStoreMetadataProperty.mock.calls[1][0]).toBe('task');
    expect(mockStoreMetadataProperty.mock.calls[1][1]).toBe('test task');
    expect(mockStoreMetadataProperty.mock.calls[2][0]).toBe('action');
    expect(mockStoreMetadataProperty.mock.calls[2][1]).toEqual('test action');
    expect(mockStoreMetadataProperty.mock.calls[3][0]).toBe('body');
    expect(mockStoreMetadataProperty.mock.calls[3][1]).toEqual(body);
    expect(mockStoreMetadataProperty.mock.calls[4][0]).toBe('query');
    expect(mockStoreMetadataProperty.mock.calls[4][1]).toEqual(query);
  });

  test('should init successful complete log', async () => {
    mockGetDuration.mockReturnValue(1000);
    let log: any = logHelpers.initCompleteLogMeta(process.hrtime, 'test message');
    expect(log).toEqual({
      duration: 1000,
      message: 'test message',
      label: 'complete'
    });
  });

  test('should init error complete log - missing error in parameter list', async () => {
    mockGetDuration.mockReturnValue(1000);
    let log: any = logHelpers.initErrorLogMetaComplete(
      process.hrtime,
      'error type',
      'test message'
    );
    expect(log).toEqual({
      duration: 1000,
      error: true,
      label: 'complete',
      errorType: 'error type',
      message: 'test message'
    });
  });

  test('should init error complete log', async () => {
    mockGetDuration.mockReturnValue(1000);
    let error = new Error('test error');
    let log: any = logHelpers.initErrorLogMetaComplete(
      process.hrtime,
      'error type',
      'test message',
      error
    );
    expect(log).toEqual({
      duration: 1000,
      error: true,
      label: 'complete',
      errorType: 'error type',
      message: 'test message',
      stack: error.stack
    });
  });

  test('should init error log - missing error and error message', async () => {
    let log: any = logHelpers.initErrorLogMeta('error type');
    expect(log).toEqual({
      errorType: 'error type',
      error: true,
    });
  });

  test('should init error log - missing error message', async () => {
    let error = new Error('test error');
    let log: any = logHelpers.initErrorLogMeta('error type', error);
    expect(log).toEqual({
      errorType: 'error type',
      error: true,
      message: error.message,
      stack: error.stack
    });
  });

  test('should init error log - missing error', async () => {
    let log: any = logHelpers.initErrorLogMeta('error type', null, 'error message');
    expect(log).toEqual({
      errorType: 'error type',
      error: true,
      message: 'error message'
    });
  });

  test('should init log', async () => {
    let log: any = logHelpers.initLogMeta('test message');
    expect(log).toEqual({
      message: 'test message'
    });
  });
});
