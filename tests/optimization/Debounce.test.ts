// tests/optimization/Debounce.test.ts
import { Debounce } from "../../src/optimization/Debounce";

describe("Debounce Decorator", () => {
  beforeEach(() => {
    // Modern timers are fine; avoid setImmediate/nextTick in helpers.
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  const flushAllTimers = async () => {
    const anyJest = jest as unknown as {
      runAllTimersAsync?: () => Promise<void>;
      advanceTimersByTimeAsync?: (ms: number) => Promise<void>;
    };
    if (anyJest.runAllTimersAsync) {
      await anyJest.runAllTimersAsync();
    } else {
      jest.runAllTimers();
    }
  };

  it("should debounce method calls", async () => {
    const debouncedFunction = jest.fn();

    class TestClass {
      @Debounce(300)
      debounceMethod() {
        debouncedFunction();
      }
    }

    const instance = new TestClass();
    instance.debounceMethod();
    instance.debounceMethod(); // coalesced into one execution

    // Advance timers enough and flush all pending timers/microtasks that Jest tracks
    jest.advanceTimersByTime(301);
    await flushAllTimers();

    expect(debouncedFunction).toHaveBeenCalledTimes(1);
  });

  it("should debounce method calls with custom delay", async () => {
    const debouncedFunction = jest.fn();

    class TestClass {
      @Debounce(500)
      debounceMethod() {
        debouncedFunction();
      }
    }

    const instance = new TestClass();
    instance.debounceMethod();
    instance.debounceMethod();

    jest.advanceTimersByTime(501);
    await flushAllTimers();

    expect(debouncedFunction).toHaveBeenCalledTimes(1);
  });

  it("should debounce method calls with default delay (300ms)", async () => {
    const debouncedFunction = jest.fn();

    class TestClass {
      @Debounce()
      debounceMethod() {
        debouncedFunction();
      }
    }

    const instance = new TestClass();
    instance.debounceMethod();
    instance.debounceMethod();

    jest.advanceTimersByTime(301);
    await flushAllTimers();

    expect(debouncedFunction).toHaveBeenCalledTimes(1);
  });

  it("should debounce method calls with zero delay (coalesce same tick)", async () => {
    const debouncedFunction = jest.fn();

    class TestClass {
      @Debounce(0)
      debounceMethod() {
        debouncedFunction();
      }
    }

    const instance = new TestClass();
    instance.debounceMethod();
    instance.debounceMethod();

    // For 0ms, timers still queue; run all pending timers
    await flushAllTimers();
    expect(debouncedFunction).toHaveBeenCalledTimes(1);
  });

  it("should throw an error for negative delay", () => {
    expect(() => {
      class InvalidTestClass {
        @Debounce(-100)
        invalidMethod() {}
      }
    }).toThrow("🐞 [Debounce] Delay must be non-negative.");
  });
});
