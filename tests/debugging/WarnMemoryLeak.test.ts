import { WarnMemoryLeak } from '../../src/debugging/WarnMemoryLeak';
import { getMemoryUsage, isNodeEnvironment } from '../../src/utilities';

jest.mock('../../src/utilities');

describe('WarnMemoryLeak Decorator', () => {
  let logger: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    logger = jest.fn();
    (getMemoryUsage as jest.Mock).mockClear();
    (isNodeEnvironment as jest.Mock).mockClear();
    global.gc = jest.fn();
    jest.spyOn(global, 'clearInterval');
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  interface WarnMemoryLeakTestInstance {
    intervalId: NodeJS.Timeout | number | null;
    cleanup: () => void;
  }

  it('should initialize and set up memory leak check', () => {
    (getMemoryUsage as jest.Mock).mockReturnValueOnce(100);

    @WarnMemoryLeak(1000, 10, logger)
    class TestClass {}

    const instance = new TestClass() as unknown as WarnMemoryLeakTestInstance;
    expect(getMemoryUsage).toHaveBeenCalledTimes(1);
    expect(instance.intervalId).not.toBeNull();
  });

  it('should log a warning if memory usage exceeds threshold', () => {
    (getMemoryUsage as jest.Mock)
      .mockReturnValueOnce(100) // Initial memory usage
      .mockReturnValueOnce(120); // Increased memory usage by 20%

    @WarnMemoryLeak(100, 10, logger)
    class TestClass {}

    const instance = new TestClass() as unknown as WarnMemoryLeakTestInstance;

    jest.advanceTimersByTime(100);

    expect(logger).toHaveBeenCalledWith(
      expect.stringContaining('⚠️ [Memory Leak] Memory usage increased by 20.00% in TestClass')
    );
  });

  it('should not log a warning if memory usage does not exceed threshold', () => {
    (getMemoryUsage as jest.Mock)
      .mockReturnValueOnce(100) // Initial memory usage
      .mockReturnValueOnce(105); // Increased memory usage by 5%

    @WarnMemoryLeak(100, 10, logger)
    class TestClass {}

    const instance = new TestClass() as unknown as WarnMemoryLeakTestInstance;

    jest.advanceTimersByTime(100);

    expect(logger).not.toHaveBeenCalled();
  });

  it('should perform manual garbage collection in Node environment', () => {
    (isNodeEnvironment as jest.Mock).mockReturnValue(true);
    (getMemoryUsage as jest.Mock).mockReturnValueOnce(100);
    global.gc = jest.fn();

    @WarnMemoryLeak(100, 10, logger, true)
    class TestClass {}

    const instance = new TestClass() as unknown as WarnMemoryLeakTestInstance;

    jest.advanceTimersByTime(100);

    expect(global.gc).toHaveBeenCalled();
  });

  it('should clean up interval on cleanup method call', () => {
    (getMemoryUsage as jest.Mock).mockReturnValueOnce(100);

    @WarnMemoryLeak(1000, 10, logger)
    class TestClass {}

    const instance = new TestClass() as unknown as WarnMemoryLeakTestInstance;
    const intervalId = instance.intervalId;

    instance.cleanup();

    expect(clearInterval).toHaveBeenCalledWith(intervalId);
    expect(instance.intervalId).toBeNull();
  });
});
