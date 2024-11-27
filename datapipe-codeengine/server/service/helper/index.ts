import * as logHelpers from '../../components/utils/logHelpers';

const loggers = logHelpers.loggers;
const logger = loggers.get('service');

export function logError(error: Error) {
  let log: any = logHelpers.initErrorLogMeta('service', error, error.message);
  logger.error(log);
}

export function triggerError(error, message?: string) {
  error = message ? new Error(message) : error;
  logError(error);
  return Promise.reject(error);
}
