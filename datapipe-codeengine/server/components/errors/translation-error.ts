//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2018 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.

import * as logHelpers from '../utils/logHelpers';
const loggers = logHelpers.loggers;
const logger = loggers.get('app');

export class TranslationError {
  message: string;
  stackTrace: any;

  constructor(error: any, message?: string) {
    if(error && error.message) {
      this.message = error.message;
    } else {
      this.message = message;
    }

    if (error) {
      this.stackTrace = error.stack ? error.stack : error.stackTrace;
    } else {
      this.stackTrace='N/A';
    }
  }

  //This function will record the error in the doc
  static record(doc: any, error: any, message?: string): any {
    let log: any = logHelpers.initErrorLogMeta('service', error, message);
    logger.error(log);

    let translationError = new TranslationError(error, message);

    if (!doc) {
      return;
    }

    if (!doc.error || !Array.isArray(doc.error)) {
      doc.error = [];
    }
    doc.error.push(translationError);
  }
}
