/**
 * Licensed Materials - Property of IBM
 *
 * @ Copyright IBM Corp. 2014,2015 All Rights Reserved
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with
 * IBM Corp.
 */

export let productionEnvironment = {
  webHost: 'localhost:3000',
  cfApp: {
    'port': 3000,
    'host': '127.0.0.1',
    'uris': ['localhost:3000'],
    'application_uris': ['localhost:3000']
  },
  logging: {
    level: 'debug',
    transports: ['Console'],
    clsLogStore: 'logMetadataStore'
  },
  tokenSecret: process.env.CFCI_JWT_TOKEN_SECRET,
  jwtAlgorithms: ['HS256'],
  cloudant: {
    url: process.env.CFCI_DB_URL,
    apiKey: process.env.CFCI_DB_APIKEY,
    db: process.env.DB_NAME
  }
};
