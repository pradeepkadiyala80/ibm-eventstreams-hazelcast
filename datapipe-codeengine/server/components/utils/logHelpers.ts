//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2018 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.

import { Logger } from './logger';
import config from '../../config/environment';
import * as _ from 'lodash';
export const loggers: any = new Logger(config.logging);

export function initEventWorkFlowLog(task: string, body?: any): void {
  loggers.storeMetadataProperty('type', 'event');
  loggers.storeMetadataProperty('task', task);
  if (body) {
    loggers.storeMetadataProperty('body', body);
  }
}

export function initAPIWorkFlowLog(task: string, action: string, body?: any, query?: any): void {
  loggers.storeMetadataProperty('type', 'workflow');
  loggers.storeMetadataProperty('task', task);
  loggers.storeMetadataProperty('action', action);
  if (body) {
    loggers.storeMetadataProperty('body', body);
  }
  if (query) {
    loggers.storeMetadataProperty('query', query);
  }
}

export function initCompleteLogMeta(start: any, message: any, data?: any): any {
  let logMeta: any = {
    duration: loggers.getDuration(start),
    message: message,
    label: 'complete',
    details: data
  };

  return logMeta;
}

export function initErrorLogMetaComplete(start: any, errorType: string, message: string, errorObj?: any): any {
  let logMeta: any = {
    duration: loggers.getDuration(start),
    error: true,
    label: 'complete',
    errorType: errorType,
    message: message
  };

  if (errorObj) {
    logMeta.stack = errorObj.stack;
  }

  return logMeta;
}

export function initErrorLogMeta(errorType: string, errorObj?: any, message?: any): any {
  let logMeta: any = {
    errorType: errorType,
    error: true,
  };

  if (message) {
    logMeta.message = message;
  } else if (errorObj && errorObj.message) {
    logMeta.message = errorObj.message;
  }

  if (errorObj && errorObj.stack) {
    logMeta.stack = errorObj.stack;
  }

  return logMeta;
}

export function initLogMeta(message: any): any {
  let logMeta: any = {
    message: message,
  };

  return logMeta;
}
