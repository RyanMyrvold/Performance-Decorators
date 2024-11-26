import { Throttle } from "../../src/optimization/Throttle";

class TestClass {
  callCount = 0;

  @Throttle(200)
  throttledMethod(): void {
    this.callCount++;
  }
}

describe('Throttle Decorator', () => {
  let testInstance: TestClass;

  beforeEach(() => {
    testInstance = new TestClass();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should throttle method calls', () => {
    testInstance.throttledMethod();
    expect(testInstance.callCount).toBe(1);

    testInstance.throttledMethod();
    expect(testInstance.callCount).toBe(1);

    jest.advanceTimersByTime(200);
    expect(testInstance.callCount).toBe(2);

    testInstance.throttledMethod();
    expect(testInstance.callCount).toBe(2);

    jest.advanceTimersByTime(100);
    expect(testInstance.callCount).toBe(2);

    jest.advanceTimersByTime(100);
    expect(testInstance.callCount).toBe(3);
  });

  it('should throw an error for negative delay', () => {
    expect(() => {
      class InvalidTestClass {
        @Throttle(-100)
        invalidMethod(): void {}
      }
    }).toThrow("🚨 [Throttle] Delay must be non-negative.");
  });

  it('should throw an error for non-method declarations', () => {
    expect(() => {
      class InvalidTestClass {
        // @ts-ignore
        @Throttle(200)
        invalidProperty: string = "invalid";
      }
    }).toThrow("🐞 [Throttle] Can only be applied to method declarations.");
  });
});
