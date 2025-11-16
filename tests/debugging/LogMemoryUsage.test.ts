// test/debugging/LogMemoryUsage.spec.ts
import { LogMemoryUsage } from "../../src/debugging/LogMemoryUsage";
import { getMemoryUsage } from "../../src/utilities/MemoryUtilities";

jest.mock("../../src/utilities/MemoryUtilities", () => ({
  getMemoryUsage: jest.fn(),
}));

describe("LogMemoryUsage Decorator", () => {
  let memoryHandler: jest.Mock;
  let originalConsoleLog: typeof console.log;

  beforeAll(() => {
    originalConsoleLog = console.log;
  });

  beforeEach(() => {
    memoryHandler = jest.fn();
    console.log = jest.fn();
    (getMemoryUsage as jest.Mock).mockReset();
  });

  afterEach(() => {
    console.log = originalConsoleLog;
  });

  it("logs memory delta when supported", () => {
    (getMemoryUsage as jest.Mock).mockReturnValueOnce(100).mockReturnValueOnce(150);

    class TestClass {
      @LogMemoryUsage(memoryHandler)
      testMethod() {
        return "result";
      }
    }

    const instance = new TestClass();
    const result = instance.testMethod();

    expect(result).toBe("result");
    expect(memoryHandler).toHaveBeenCalledWith(50, "testMethod");
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("🧠 [Memory] testMethod: Δ=50 bytes")
    );
  });

  it("does not call handler when measurement unsupported", () => {
    (getMemoryUsage as jest.Mock).mockReturnValueOnce(undefined);

    class TestClass {
      @LogMemoryUsage(memoryHandler)
      testMethod() {
        return "result";
      }
    }

    const instance = new TestClass();
    const result = instance.testMethod();

    expect(result).toBe("result");
    expect(memoryHandler).not.toHaveBeenCalled();
    // No error is logged in the new implementation
    expect(console.log).not.toHaveBeenCalled();
  });

  it("handles symbol names", () => {
    (getMemoryUsage as jest.Mock).mockReturnValueOnce(200).mockReturnValueOnce(300);

    const sym = Symbol("testMethod");

    class TestClass {
      @LogMemoryUsage(memoryHandler)
      [sym]() {
        return "result";
      }
    }

    const instance = new TestClass();
    const result = (instance as any)[sym]();

    expect(result).toBe("result");
    expect(memoryHandler).toHaveBeenCalledWith(100, "Symbol(testMethod)");
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining("🧠 [Memory] Symbol(testMethod): Δ=100 bytes")
    );
  });

  it("swallows post-call measurement errors", () => {
    (getMemoryUsage as jest.Mock)
      .mockReturnValueOnce(100) // before
      .mockImplementationOnce(() => {
        throw new Error("boom");
      }); // after

    class TestClass {
      @LogMemoryUsage(memoryHandler)
      testMethod() {
        return "result";
      }
    }

    const instance = new TestClass();
    const result = instance.testMethod();

    expect(result).toBe("result");
    expect(memoryHandler).not.toHaveBeenCalled();
    // No console error in new implementation
    expect(console.log).not.toHaveBeenCalled();
  });
});
