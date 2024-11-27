/**
 * Licensed Materials - Property of IBM
 *
 * @ Copyright IBM Corp. 2014,2015 All Rights Reserved
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with
 * IBM Corp.
 */

export let testEnvironment = {
  webHost: 'localhost:3000',
  clientPort: 4200,
  cfApp: {
    'port': 3000,
    'host': '127.0.0.1',
    'uris': ['localhost:3000'],
    'application_uris': ['localhost:3000']
  },
  logging: {
    level: 'debug',
    dir: './.tmp/logs',
    transports: ['File'],
    clsLogStore: 'testLogMetadataStore'
  },
  tokenSecret: 'secret key',
  jwtAlgorithms: ['HS256']
};
