import { EventHandler } from './EventHandlerAbstract';

describe('EventHandler test', () => {
  test('should throw error when trying to construct an abstract class', async (done) => {
    try {
      let eHandler = new EventHandler();
    } catch (err) {
      expect(err).toBeInstanceOf(TypeError);
      expect(err.message).toEqual('Can not construct abstract class.');
      done();
    }
  });

  test('should throw error if record function not implementd', async (done) => {
    try {
      class testClass extends EventHandler {
        constructor() {
          super();
        }
      }

      let testObj = new testClass();
    } catch (err) {
      expect(err).toBeInstanceOf(TypeError);
      expect(err.message).toEqual('Please implement abstract method record.');
      done();
    }
  });

  test('should throw error if parent function record is invoked', async (done) => {
    try {
      class testClass extends EventHandler {
        constructor() {
          super();
        }

        record() {
          super.record();
        }

        respondError(error) {
          super.respondError(error);
        }
      }

      let testObj = new testClass();
      testObj.record();
    } catch (err) {
      expect(err).toBeInstanceOf(TypeError);
      expect(err.message).toEqual('Do not call abstract method record from child.');
      done();
    }
  });

  test('should throw error if function respondError not implementd', async (done) => {
    try {
      class testClass extends EventHandler {
        constructor() {
          super();
        }

        record() {
          super.record();
        }
      }

      let testObj = new testClass();
    } catch (err) {
      expect(err).toBeInstanceOf(TypeError);
      expect(err.message).toEqual('Please implement abstract method respondError.');
      done();
    }
  });

  test('should throw error if function respondError is called', async (done) => {
    try {
      class testClass extends EventHandler {
        constructor() {
          super();
        }

        record() {
          super.record();
        }

        respondError(error) {
          super.respondError(error);
        }
      }

      let testObj = new testClass();
      testObj.respondError(new Error(''));
    } catch (err) {
      expect(err).toBeInstanceOf(TypeError);
      expect(err.message).toEqual('Do not call abstract method respondError from child.');
      done();
    }
  });
});
