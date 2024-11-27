//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2018 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.

const mockWinston = {
  format: jest.fn(),
  transports: {
    File: jest.fn(),
    Console: jest.fn(),
    Stream: jest.fn(),
  }
};
const mockFormater = jest.fn();
const mockContainer = jest.fn();
const mockLENode = jest.fn();
const mockContainerInstance = {
  has: jest.fn(),
  add: jest.fn(),
  get: jest.fn()
};
const mockLENodeInstance = {
  serialize: jest.fn(),
  ringBuffer: {
    write: jest.fn()
  }
};
jest.mock('winston', () => {
  return mockWinston;
});
jest.mock('r7insight_node', () => {
  return mockLENode;
});
jest.mock('winston/lib/winston/container', () => {
  return mockContainer;
})

import config from '../../config/environment';
import { format } from 'logform';
import { createNamespace } from 'cls-hooked';
const correlationId = 'test_correlationId';
const cls = createNamespace(config.logging.clsLogStore);

import { Logger } from './logger';

describe('Logger class test', () => {
  let loggers;
  let mockConfig;

  beforeEach(() => {
    mockConfig = {
      level: 'debug',
      transports: [],
      clsLogStore: 'testLogMetadataStore',
      logentriesToken: 'test_token',
      dir: './.tmp/logs'
    };
    mockContainer.mockImplementation(() => {
      return mockContainerInstance;
    });
    mockLENode.mockImplementation(() => {
      return mockLENodeInstance;
    });
  });

  test('should init a logger instance', async () => {
    loggers = new Logger(mockConfig);
    expect(mockContainer.mock.calls.length).toBe(1);
    expect(mockContainer.mock.calls[0][0]).toEqual({
      level: mockConfig.level
    });
    expect(loggers.transports).toEqual(mockConfig.transports);
  });

  test('should get a logger of some category - the category not previously exists', async () => {
    let mockInfo = {};
    let formatCallback;
    let mockTransportsFile = {lable: 'test transports file'};
    let mockTransportsConsole = {lable: 'test transports console'};
    let mockTransportsStream = {lable: 'test transports stream'};
    let mockFormat = 'test format';
    mockConfig.transports = ['File', 'Console', 'Logentries'];

    cls.run(() => {
      cls.set('correlationId', correlationId);
      mockWinston.transports.File.mockImplementation(() => mockTransportsFile);
      mockWinston.transports.Console.mockImplementation(() => mockTransportsConsole);
      mockWinston.transports.Stream.mockImplementation(() => mockTransportsStream);
      mockLENodeInstance.serialize.mockImplementation((info) => {
        return JSON.stringify(info);
      });
      mockWinston.format.mockImplementation((cb) => {
        formatCallback = cb;
        return mockFormater;
      });
      mockFormater.mockImplementation((opts) => {
        mockInfo = formatCallback(mockInfo, opts);
        return mockFormat;
      });
      mockContainerInstance.has.mockReturnValue(false);
      mockContainerInstance.add.mockReturnValue({});
      loggers = new Logger(mockConfig);

      let logger = loggers.get('test_app');
    });

    expect(mockInfo).toEqual({
      loggerCategory: 'test_app',
      correlationId: correlationId
    });
    expect(mockFormater.mock.calls.length).toEqual(2);
    expect(mockFormater.mock.calls[0][0]).toEqual({category: 'test_app'});
    expect(mockFormater.mock.calls[1][0]).toEqual({
      leLogger: new mockLENode(),
      token: mockConfig.logentriesToken
    });
    expect(mockContainerInstance.add.mock.calls.length).toBe(1);
    expect(mockContainerInstance.add.mock.calls[0]).toEqual([
      'test_app',
      {
        level: mockConfig.level,
        transports: [mockTransportsFile, mockTransportsConsole, mockTransportsStream],
        format: mockFormat
      }
    ]);
    expect(mockWinston.transports.Console.mock.calls.length).toBe(1);
    expect(mockWinston.transports.File.mock.calls.length).toBe(1);
    expect(mockWinston.transports.Stream.mock.calls.length).toBe(1);
    expect(mockWinston.transports.Console.mock.calls[0][0]).toEqual({format: format.simple()});
    expect(mockWinston.transports.File.mock.calls[0][0]).toEqual({
      dirname: mockConfig.dir,
      filename: 'test_app.log',
      format: format.json()
    });
    let mockLeloggerInstance = new mockLENode();
    expect(mockWinston.transports.Stream.mock.calls[0][0]).toEqual({
      stream: mockLeloggerInstance,
      format: mockFormater({leLogger: mockLeloggerInstance, token: mockConfig.logentriesToken})
    });
  });

  test('should get a logger of some category - the category already exists', async () => {
    let mockLogger = {test: 'test'};
    mockContainerInstance.has.mockReturnValue(true);
    mockContainerInstance.get.mockReturnValue(mockLogger);
    loggers = new Logger(mockConfig);
    let resLogger = loggers.get('test_app')
    expect(resLogger).toEqual(mockLogger);
    expect(mockContainerInstance.get.mock.calls.length).toBe(1);
    expect(mockContainerInstance.get.mock.calls[0][0]).toBe('test_app');
  });

  test('should not store metadata property if store is not active', async () => {
    let clsMockGet = jest.spyOn(cls, 'get');
    let clsMockSet = jest.spyOn(cls, 'set');
    loggers = new Logger(mockConfig);
    loggers.storeMetadataProperty('test', 'test');
    expect(clsMockGet.mock.calls.length).toBe(0);
    expect(clsMockSet.mock.calls.length).toBe(0);
  });

  test('should store metadata property', async () => {
    let clsMockGet = jest.spyOn(cls, 'get');
    let clsMockSet = jest.spyOn(cls, 'set');
    clsMockGet.mockReturnValueOnce({});
    let meta: any;
    cls.run(() => {
      loggers = new Logger(mockConfig);
      loggers.storeMetadataProperty('test', 'test');
      meta = cls.get('loggerMeta');
    });
    expect(meta).toEqual({test: 'test'});
    expect(clsMockGet).toHaveBeenCalled();
    expect(clsMockSet).toHaveBeenCalled();
  });

  test('should store metadata property - namespace is previously empty', async () => {
    let clsMockGet = jest.spyOn(cls, 'get');
    let clsMockSet = jest.spyOn(cls, 'set');
    clsMockGet.mockReturnValueOnce(undefined);
    let meta: any;
    cls.run(() => {
      loggers = new Logger(mockConfig);
      loggers.storeMetadataProperty('test', 'test');
      meta = cls.get('loggerMeta');
    });
    expect(meta).toEqual({test: 'test'});
    expect(clsMockGet).toHaveBeenCalled();
    expect(clsMockSet).toHaveBeenCalled();
  });

  test('should not remove metadata property if store is not active', async () => {
    let clsMockGet = jest.spyOn(cls, 'get');
    let clsMockSet = jest.spyOn(cls, 'set');
    loggers = new Logger(mockConfig);
    loggers.removeMetadataProperty('test', test);
    expect(clsMockGet.mock.calls.length).toBe(0);
    expect(clsMockSet.mock.calls.length).toBe(0);
  });

  test('should remove metadata property', async () => {
    let clsMockGet = jest.spyOn(cls, 'get');
    let clsMockSet = jest.spyOn(cls, 'set');
    clsMockGet.mockReturnValueOnce({test: 'test'});
    let meta: any;
    cls.run(() => {
      loggers = new Logger(mockConfig);
      loggers.removeMetadataProperty('test', 'test');
      meta = cls.get('loggerMeta');
    });
    expect(meta).toEqual({});
    expect(clsMockGet).toHaveBeenCalled();
    expect(clsMockSet).toHaveBeenCalled();
  });

  test('should remove metadata property - namespace is previously empty', async () => {
    let clsMockGet = jest.spyOn(cls, 'get');
    let clsMockSet = jest.spyOn(cls, 'set');
    clsMockGet.mockReturnValueOnce(undefined);
    let meta: any;
    cls.run(() => {
      loggers = new Logger(mockConfig);
      loggers.removeMetadataProperty('test', 'test');
      meta = cls.get('loggerMeta');
    });
    expect(meta).toEqual({});
    expect(clsMockGet).toHaveBeenCalled();
    expect(clsMockSet).toHaveBeenCalled();
  });

  test('should get the duration', async () => {
    loggers = new Logger(mockConfig);
    let duration = loggers.getDuration(process.hrtime());
    expect(typeof duration).toBe('number');
    expect(duration).toBeGreaterThan(0);
  });
});
