import AutoRetry from "../../src/optimization/AutoRetry";

class TestClass {
  callCount = 0;

  @AutoRetry(3, 10)
  async unstableMethod(shouldFail: number): Promise<string> {
    this.callCount++;
    if (this.callCount < shouldFail) {
      throw new Error("Method failed");
    }
    return "Success";
  }
}

describe('AutoRetry Decorator', () => {
  let originalWarn: any;

  // Suppress console.warn
  beforeAll(() => {
    originalWarn = console.warn;
    console.warn = jest.fn();
  });

  // Restore console.warn
  afterAll(() => {
    console.warn = originalWarn;
  });

  it('should retry the specified number of times and then succeed', async () => {
    const testInstance = new TestClass();
    const result = await testInstance.unstableMethod(3);
    expect(result).toBe('Success');
    expect(testInstance.callCount).toBe(3);
  });

  it('should fail after the specified number of retries', async () => {
    const testInstance = new TestClass();
    try {
      await testInstance.unstableMethod(5);
    } catch (e: any) {
      // Match the complete error message including retry details
      expect(e.message).toBe("🚨 [Auto Retry] Failed after 3 retries: Error: Method failed");
      expect(testInstance.callCount).toBe(4); // It will be 4 because it attempts 4 times in total
    }
  });

  it('should throw an error for negative retries', () => {
    expect(() => {
      class InvalidTestClass {
        @AutoRetry(-1, 10)
        invalidMethod(): void {}
      }
    }).toThrow("🚨 [Auto Retry] Retries and delay must be non-negative.");
  });

  it('should throw an error for negative delay', () => {
    expect(() => {
      class InvalidTestClass {
        @AutoRetry(3, -10)
        invalidMethod(): void {}
      }
    }).toThrow("🚨 [Auto Retry] Retries and delay must be non-negative.");
  });

  it('should throw an error for non-method declarations', () => {
    expect(() => {
      class InvalidTestClass {
        @AutoRetry(3, 10)
        get invalidProperty(): void {
          return;
        }
      }
    }).toThrow("🚨 [Auto Retry] Can only be applied to methods.");
  });

  it('should throw an error for non-async methods', () => {
    expect(() => {
      class InvalidTestClass {
        @AutoRetry(3, 10)
        invalidMethod(): void {}
      }
    }).toThrow("🚨 [Auto Retry] Can only be applied to async methods.");
  });
});
