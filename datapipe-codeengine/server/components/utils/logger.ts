//Licensed Materials - Property of IBM
//
//@ Copyright IBM Corp. 2018 All Rights Reserved
//
//US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP
//Schedule Contract with IBM Corp.
declare function require(name: string): any;

import mkdirp = require('mkdirp');
const LELogger = require('r7insight_node');
import * as winston from 'winston';
import * as Transport from 'winston-transport';
import { format } from 'logform';
const Container = require('winston/lib/winston/container');

const cls = require('cls-hooked');

export class Logger {
  private container: any;
  private transports: any[];

  constructor(private config: any) {
    this.container = new Container({
      level: config.level
    });

    this.transports = config.transports;
  }

  get(category: string): winston.Logger {
    if (this.container.has(category)) {
      return this.container.get(category);
    }

    let clsFormatter = winston.format((info: any, opts: any) => {
      let store = cls.getNamespace(this.config.clsLogStore);
      let defaultMeta: any = store ? store.get('loggerMeta') : {};
      defaultMeta = defaultMeta || {};

      let combined = Object.assign({}, defaultMeta, info);

      combined.loggerCategory = opts.category;
      combined.correlationId = store ? store.get('correlationId') : undefined;
      return combined;
    });

    let logConfig: any = {
      level: this.config.level,
      transports: [],
      format: clsFormatter({category: category})
    };

    this.transports.forEach((transport: string) => {
      if (transport === 'Console') {
        logConfig.transports.push(new winston.transports.Console({format: format.simple()}));
      }

      if (transport === 'File') {
        mkdirp.sync(this.config.dir);
        logConfig.transports.push(
          new winston.transports.File({
            dirname: this.config.dir,
            filename: `${category}.log`,
            format: format.json()
          })
        );
      }

      if (transport === 'Logentries') {
        let leFormatter = winston.format((info: any, opts: any) => {
          let modifiedLog = opts.leLogger.serialize(info);
          opts.leLogger.ringBuffer
            .write(`${opts.token} ${modifiedLog.toString().replace(/\n/g, '\u2028')}\n`);
          return info;
        });

        let leLogger = new LELogger({token: this.config.logentriesToken, secure: true, region: 'eu'});
        logConfig.transports.push(new winston.transports.Stream({
          stream: leLogger,
          format: leFormatter({leLogger: leLogger, token: this.config.logentriesToken})
        }));
      }
    });

    let logger = this.container.add(category, logConfig);

    return logger;
  }

  // Add default logging metadata to continuation local storage.  This key/value pair will appear in
  // all logs for this 'continuation thread' unless overridden by log metadata provided to the
  // logging statement.
  storeMetadataProperty(name: string, value: any) {
    let store = cls.getNamespace(this.config.clsLogStore);
    if (store && store.active) {
      let meta: any = store.get('loggerMeta');
      if (meta === undefined) {
        meta = {};
      }

      meta[name] = value;

      store.set('loggerMeta', meta);
    }
  }

  // Remove default logging metadata from continuation local storage.
  removeMetadataProperty(name: string) {
    let store = cls.getNamespace(this.config.clsLogStore);
    if (store && store.active) {
      let meta: any = store.get('loggerMeta');
      if (meta === undefined) {
        meta = {};
      }

      meta[name] = undefined;

      store.set('loggerMeta', meta);
    }
  }

  getDuration(start: [number, number]): number {
    let duration = process.hrtime(start);
    return (duration[0] * 1e9) + duration[1];
  }
}
