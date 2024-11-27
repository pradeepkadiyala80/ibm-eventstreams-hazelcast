/**
 * Licensed Materials - Property of IBM
 *
 * @ Copyright IBM Corp. 2014,2015 All Rights Reserved
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with
 * IBM Corp.
 */
 // if (process.env.CFCI_NEW_RELIC_ENABLED) {
 //   require('newrelic');
 // }
 import { ExpressApp } from './express';

 let expressApp = new ExpressApp();
 //expressApp.run();

 if(process.env.LOCAL) {
   expressApp.run();
 } else {
   expressApp.run();
 }
