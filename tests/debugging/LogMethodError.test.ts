import LogMethodError from '../../src/debugging/LogMethodError';

describe('LogMethodError Decorator', () => {
  let errorHandler: jest.Mock;
  let originalConsoleError: typeof console.error;

  beforeAll(() => {
    originalConsoleError = console.error;
  });

  beforeEach(() => {
    errorHandler = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('should log and rethrow errors by default', () => {
    class TestClass {
      @LogMethodError()
      methodWithError() {
        throw new Error('Test error');
      }
    }

    const testInstance = new TestClass();
    expect(() => testInstance.methodWithError()).toThrow('Test error');
    expect(console.error).toHaveBeenCalledWith(
      '🚨 [Error] methodWithError encountered an error:',
      expect.any(Error)
    );
  });

  it('should log errors and not rethrow when rethrow is false', () => {
    class TestClass {
      @LogMethodError(false)
      methodWithError() {
        throw new Error('Test error');
      }
    }

    const testInstance = new TestClass();
    expect(() => testInstance.methodWithError()).not.toThrow();
    expect(console.error).toHaveBeenCalledWith(
      '🚨 [Error] methodWithError encountered an error:',
      expect.any(Error)
    );
  });

  it('should call custom error handler if provided', () => {
    class TestClass {
      @LogMethodError(true, errorHandler)
      methodWithError() {
        throw new Error('Test error');
      }
    }

    const testInstance = new TestClass();
    expect(() => testInstance.methodWithError()).toThrow('Test error');
    expect(errorHandler).toHaveBeenCalledWith(expect.any(Error), 'methodWithError');
  });

  it('should handle method names that are symbols correctly', () => {
    const methodName = Symbol('methodWithError');
    class TestClass {
      @LogMethodError(true, errorHandler)
      [methodName]() {
        throw new Error('Test error');
      }
    }

    const testInstance = new TestClass();
    expect(() => testInstance[methodName]()).toThrow('Test error');
    expect(errorHandler).toHaveBeenCalledWith(expect.any(Error), 'Symbol(methodWithError)');
  });

  it('should convert non-Error exceptions to Error instances', () => {
    class TestClass {
      @LogMethodError()
      methodWithNonError() {
        throw 'Test non-error';
      }
    }

    const testInstance = new TestClass();
    expect(() => testInstance.methodWithNonError()).toThrow('Non-Error exception: Test non-error');
    expect(console.error).toHaveBeenCalledWith(
      '🚨 [Error] methodWithNonError encountered an error:',
      expect.any(Error)
    );
  });
});
