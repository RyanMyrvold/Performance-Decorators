import { WarnPerformanceThreshold } from '../../src/debugging/WarnPerformanceThreshold';

class TestClass {
  @WarnPerformanceThreshold(50)
  fastMethod() {
    // Fast method, should not trigger the warning
    return 'fast';
  }

  @WarnPerformanceThreshold(50)
  slowMethod() {
    // Slow method, should trigger the warning
    const start = Date.now();
    while (Date.now() - start < 100) {
      // Simulate slow method
    }
    return 'slow';
  }

  @WarnPerformanceThreshold(50, (executionTime, methodName) => {
    console.log(`Custom Handler: ${methodName} took ${executionTime} ms`);
  })
  customHandlerMethod() {
    const start = Date.now();
    while (Date.now() - start < 100) {
      // Simulate slow method
    }
    return 'custom';
  }
}

describe('WarnPerformanceThreshold Decorator', () => {
  let consoleWarnSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;
  let testInstance: TestClass;

  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    testInstance = new TestClass();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not log a warning for fastMethod', () => {
    const result = testInstance.fastMethod();
    expect(result).toBe('fast');
    expect(consoleWarnSpy).not.toHaveBeenCalled();
  });

  it('should log a warning for slowMethod', () => {
    const result = testInstance.slowMethod();
    expect(result).toBe('slow');
    expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining("slowMethod exceeded 50 ms"));
  });

  it('should call custom performance handler', () => {
    const result = testInstance.customHandlerMethod();
    expect(result).toBe('custom');
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('customHandlerMethod'));
  });
});
