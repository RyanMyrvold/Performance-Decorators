import { Debounce } from "../../src/optimization";

describe("Debounce Decorator", () => {
  jest.useFakeTimers();

  it("should debounce method calls", () => {
    const debouncedFunction = jest.fn();

    class TestClass {
      @Debounce(300)
      debounceMethod() {
        debouncedFunction();
      }
    }

    const instance = new TestClass();
    instance.debounceMethod();
    instance.debounceMethod();
    jest.runAllTimers();

    expect(debouncedFunction).toHaveBeenCalledTimes(1);
  });

  it("should debounce method calls with custom delay", () => {
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
    jest.runAllTimers();

    expect(debouncedFunction).toHaveBeenCalledTimes(1);
  });

  it("should debounce method calls with default delay", () => {
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
    jest.runAllTimers();

    expect(debouncedFunction).toHaveBeenCalledTimes(1);
  });

  it("should debounce method calls with zero delay", () => {
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
    jest.runAllTimers();

    expect(debouncedFunction).toHaveBeenCalledTimes(1);
  });

  it("should throw an error for negative delay", () => {
    expect(() => {
      class InvalidTestClass {
        @Debounce(-100)
        invalidMethod(): void {}
      }
    }).toThrow("🐞 [Debounce] Delay must be non-negative.");
  });

  it("should throw an error for non-method declarations", () => {
    expect(() => {
      class InvalidTestClass {
        @Debounce()
        get invalidProperty(): void {
          return;
        }
      }
    }).toThrow("🐞 [Debounce] Can only be applied to method declarations.");
  });
});
