//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2018 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
import * as request from 'request';
import * as logHelpers from '../components/utils/logHelpers';
const loggers = logHelpers.loggers;
const logger = loggers.get('app');

export class RequestInterface {
  constructor() {
    throw new TypeError('Can not construct RequestInterface class.');
  }

  static sendRequest(options: any): Promise <any> {
    let log: any = logHelpers.initLogMeta(JSON.stringify(options));
    logger.info(log);
    return new Promise((resolve, reject) => {
      request(options, function (error, response, body) {
        if (response && response.statusCode === 200) {
          resolve({
            options: options,
            data: body
          });
        } else {
          let err = error ? error : new Error(body.message);
          let log: any = logHelpers.initErrorLogMeta('external', err, 'Error while making a request');
          log.options = options;
          log.body = body;
          logger.error(log);
          reject(err);
        }
      });
    });
  }
}
