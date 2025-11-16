// test/optimizations/WarnMemoryLeak.spec.ts
import { WarnMemoryLeak } from "../../src/debugging/WarnMemoryLeak";

describe("WarnMemoryLeak (class decorator)", () => {
  let setIntervalSpy: jest.SpyInstance;
  let clearIntervalSpy: jest.SpyInstance;
  let memoryUsageSpy: jest.SpyInstance;
  let logger: jest.Mock;

  // Drive heapUsed readings via this variable
  let heapUsed = 100 * 1024 * 1024; // 100 MB

  beforeEach(() => {
    jest.useFakeTimers(); // use fake timers per test for isolation
    logger = jest.fn();

    // Spy timers
    setIntervalSpy = jest.spyOn(global, "setInterval");
    clearIntervalSpy = jest.spyOn(global, "clearInterval");

    // Stub Node memory API path that the decorator reads
    memoryUsageSpy = jest
      .spyOn(process, "memoryUsage")
      .mockImplementation(() => ({ heapUsed } as unknown as NodeJS.MemoryUsage));
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();

    setIntervalSpy.mockRestore();
    clearIntervalSpy.mockRestore();
    memoryUsageSpy.mockRestore();

    // Reset heap baseline
    heapUsed = 100 * 1024 * 1024;
  });

  it("initializes and sets up a periodic check when memory API is available", () => {
    @WarnMemoryLeak(1000, 10, logger)
    class TestClass {}

    const instance = new TestClass();
    // setInterval should be scheduled once
    expect(setIntervalSpy).toHaveBeenCalledTimes(1);

    // Run one tick to ensure the callback is live (no warning yet, since no growth)
    jest.advanceTimersByTime(1000);
    expect(logger).not.toHaveBeenCalled();

    // Clean up
    (instance as any).dispose();
    expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
  });

  it("logs a warning when memory grows beyond the threshold", () => {
    @WarnMemoryLeak(100, 10, logger)
    class TestClass {}

    const instance = new TestClass();

    // Increase from 100 MB to 120 MB ⇒ +20% (> 10% threshold)
    heapUsed = 120 * 1024 * 1024;
    jest.advanceTimersByTime(100);

    // ⚠️ [MemoryLeak] TestClass: usage up 20.00% (120.0 MB).
    expect(logger).toHaveBeenCalledWith(
      expect.stringMatching(/^\u26a0\uFE0F \[MemoryLeak\] TestClass: usage up 2\d\.\d{2}% \(\d+\.\d MB\)\.$/)
    );

    (instance as any).dispose();
  });

  it("does not log when growth stays under the threshold", () => {
    @WarnMemoryLeak(100, 10, logger)
    class TestClass {}

    const instance = new TestClass();

    // Increase from 100 MB to 105 MB ⇒ +5% (<= threshold)
    heapUsed = 105 * 1024 * 1024;
    jest.advanceTimersByTime(100);

    expect(logger).not.toHaveBeenCalled();

    (instance as any).dispose();
  });

  it("dispose() clears the interval", () => {
    @WarnMemoryLeak(1000, 10, logger)
    class TestClass {}

    const instance = new TestClass();
    (instance as any).dispose();

    expect(clearIntervalSpy).toHaveBeenCalledTimes(1);
  });
});
