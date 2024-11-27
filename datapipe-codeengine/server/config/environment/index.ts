/**
 * Licensed Materials - Property of IBM
 *
 * @ Copyright IBM Corp. 2014,2015 All Rights Reserved
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with
 * IBM Corp.
 */

import * as _ from 'lodash';
import * as path from 'path';

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

let globalConfig = {
  env: requiredProcessEnv('NODE_ENV'),
  root: path.normalize(__dirname + '/../../..'),
  webRoot: '/rtp',
  functionalID: 'pkadiya@us.ibm.com'
};

let envConfig;
switch(process.env.NODE_ENV ) {
    case 'production':
        envConfig = require('./production').productionEnvironment;
        break;
    case 'stage':
        envConfig = require('./stage').stageEnvironment;
        break;
    case 'test':
        envConfig = require('./testEnv').testEnvironment;
        break;
    case 'development':
        envConfig = require('./development').developmentEnvironment;
        break;
    default:
        envConfig = require('./development').developmentEnvironment;
}

let config = _.merge(globalConfig, envConfig);

export default config;
