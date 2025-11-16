import { Throttle } from "../../src/optimization/Throttle";

class TestClass {
  callCount = 0;

  @Throttle(200)
  throttledMethod(): void {
    this.callCount++;
  }
}

describe("Throttle Decorator", () => {
  let testInstance: TestClass;

  beforeEach(() => {
    testInstance = new TestClass();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should throttle method calls (leading + trailing)", () => {
    // Leading call executes
    testInstance.throttledMethod();
    expect(testInstance.callCount).toBe(1);

    // Within window: coalesced, scheduled for trailing
    testInstance.throttledMethod();
    expect(testInstance.callCount).toBe(1);

    // End of window triggers trailing execution
    jest.advanceTimersByTime(200);
    expect(testInstance.callCount).toBe(2);

    // New window
    testInstance.throttledMethod();
    expect(testInstance.callCount).toBe(2); // scheduled trailing
    jest.advanceTimersByTime(200);
    expect(testInstance.callCount).toBe(3);
  });

  it("should throw an error for negative delay", () => {
    expect(() => {
      class InvalidTestClass {
        @Throttle(-100)
        invalidMethod(): void {}
      }
    }).toThrow("🚨 [Throttle] Delay must be non-negative.");
  });

  // NOTE: With modern TS decorators, you cannot apply method decorators to fields.
  // The compiler will balk first; at runtime, context.kind === "method" only for real methods.
  // The older “non-method declarations” test is therefore no longer applicable and has been removed.
});
