import LogMemoryUsage from '../../src/debugging/LogMemoryUsage';
import { getMemoryUsage } from '../../src/utilities/MemoryUtilities';

jest.mock('../../src/utilities/MemoryUtilities', () => ({
  getMemoryUsage: jest.fn(),
}));

describe('LogMemoryUsage Decorator', () => {
  let memoryHandler: jest.Mock;
  let originalConsoleLog: typeof console.log;
  let originalConsoleError: typeof console.error;

  beforeAll(() => {
    originalConsoleLog = console.log;
    originalConsoleError = console.error;
  });

  beforeEach(() => {
    memoryHandler = jest.fn();
    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  it('should log memory usage correctly in a supported environment', () => {
    (getMemoryUsage as jest.Mock).mockReturnValueOnce(100).mockReturnValueOnce(150);

    const context = { name: 'testMethod' } as unknown as ClassMethodDecoratorContext;
    const originalMethod = jest.fn(() => 'result');

    const decoratedMethod = LogMemoryUsage(memoryHandler)(originalMethod, context);
    const result = decoratedMethod();

    expect(result).toBe('result');
    expect(memoryHandler).toHaveBeenCalledWith(50, 'testMethod');
    expect(console.log).toHaveBeenCalledWith('🧠 [Memory Usage] testMethod: Memory used=50 bytes');
  });

  it('should not call memoryHandler if memory measurement is not supported', () => {
    (getMemoryUsage as jest.Mock).mockReturnValueOnce(undefined);

    const context = { name: 'testMethod' } as unknown as ClassMethodDecoratorContext;
    const originalMethod = jest.fn(() => 'result');

    const decoratedMethod = LogMemoryUsage(memoryHandler)(originalMethod, context);
    const result = decoratedMethod();

    expect(result).toBe('result');
    expect(memoryHandler).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      "🐞 [Memory Usage] Memory measurement is not supported in this environment."
    );
  });

  it('should handle method names that are symbols correctly', () => {
    (getMemoryUsage as jest.Mock).mockReturnValueOnce(200).mockReturnValueOnce(300);

    const context = { name: Symbol('testMethod') } as unknown as ClassMethodDecoratorContext;
    const originalMethod = jest.fn(() => 'result');

    const decoratedMethod = LogMemoryUsage(memoryHandler)(originalMethod, context);
    const result = decoratedMethod();

    expect(result).toBe('result');
    expect(memoryHandler).toHaveBeenCalledWith(100, 'Symbol(testMethod)');
    expect(console.log).toHaveBeenCalledWith('🧠 [Memory Usage] Symbol(testMethod): Memory used=100 bytes');
  });

  it('should handle memory measurement errors gracefully', () => {
    (getMemoryUsage as jest.Mock)
      .mockReturnValueOnce(100)
      .mockImplementationOnce(() => {
        throw new Error('Memory measurement error');
      });

    const context = { name: 'testMethod' } as unknown as ClassMethodDecoratorContext;
    const originalMethod = jest.fn(() => 'result');

    const decoratedMethod = LogMemoryUsage(memoryHandler)(originalMethod, context);
    const result = decoratedMethod();

    expect(result).toBe('result');
    expect(memoryHandler).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      "🐞 [Memory Usage] Error measuring memory after execution:",
      expect.any(Error)
    );
  });
});
