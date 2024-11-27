/**
 * Licensed Materials - Property of IBM
 *
 * @ Copyright IBM Corp. 2014,2015 All Rights Reserved
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure restricted by GSA ADP Schedule Contract with
 * IBM Corp.
 */

export class EventHandler {
  constructor() {
    if (this.constructor === EventHandler) {
      // Error Type 1. Abstract class can not be constructed.
      throw new TypeError('Can not construct abstract class.');
    }

    if (this.record === EventHandler.prototype.record) {
      // Error Type 4. Child has not implemented this abstract method.
      throw new TypeError('Please implement abstract method record.');
    }

    if (this.respondError === EventHandler.prototype.respondError) {
      // Error Type 4. Child has not implemented this abstract method.
      throw new TypeError('Please implement abstract method respondError.');
    }
  }

  record() {
    // Error Type 6. The child has implemented this method but also called `super.record()`.
    throw new TypeError('Do not call abstract method record from child.');
  }

  respondError(error) {
    // Error Type 6. The child has implemented this method but also called `super.record()`.
    throw new TypeError('Do not call abstract method respondError from child.');
  }
}
