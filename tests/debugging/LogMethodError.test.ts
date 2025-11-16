// test/debugging/LogMethodError.spec.ts
import { LogMethodError } from "../../src/debugging/LogMethodError";

describe("LogMethodError Decorator", () => {
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

  it("logs and rethrows errors by default", () => {
    class TestClass {
      @LogMethodError()
      methodWithError() {
        throw new Error("Test error");
      }
    }
    const testInstance = new TestClass();

    expect(() => testInstance.methodWithError()).toThrow("Test error");
    expect(console.error).toHaveBeenCalledWith(
      "🚨 [Error] methodWithError:",
      expect.any(Error)
    );
  });

  it("logs and does not rethrow when rethrow=false", () => {
    class TestClass {
      @LogMethodError(false)
      methodWithError() {
        throw new Error("Test error");
      }
    }
    const testInstance = new TestClass();

    expect(() => testInstance.methodWithError()).not.toThrow();
    expect(console.error).toHaveBeenCalledWith(
      "🚨 [Error] methodWithError:",
      expect.any(Error)
    );
  });

  it("uses custom error handler when provided", () => {
    class TestClass {
      @LogMethodError(true, errorHandler)
      methodWithError() {
        throw new Error("Test error");
      }
    }
    const testInstance = new TestClass();

    expect(() => testInstance.methodWithError()).toThrow("Test error");
    expect(errorHandler).toHaveBeenCalledWith(expect.any(Error), "methodWithError");
  });

  it("handles symbol method names", () => {
    const methodName = Symbol("methodWithError");
    class TestClass {
      @LogMethodError(true, errorHandler)
      [methodName]() {
        throw new Error("Test error");
      }
    }
    const testInstance = new TestClass();

    expect(() => (testInstance as any)[methodName]()).toThrow("Test error");
    expect(errorHandler).toHaveBeenCalledWith(expect.any(Error), "Symbol(methodWithError)");
  });

  it("converts non-Error throws to Error instances", () => {
    class TestClass {
      @LogMethodError()
      methodWithNonError() {
        // eslint-disable-next-line no-throw-literal
        throw "Test non-error";
      }
    }
    const testInstance = new TestClass();

    expect(() => testInstance.methodWithNonError()).toThrow("Non-Error exception: Test non-error");
    expect(console.error).toHaveBeenCalledWith(
      "🚨 [Error] methodWithNonError:",
      expect.any(Error)
    );
  });
});
