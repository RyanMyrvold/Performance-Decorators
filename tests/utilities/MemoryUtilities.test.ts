import { getMemoryUsage } from "../../src/utilities";
import * as SystemUtilities from "../../src/utilities/SystemUtilities";

jest.mock("../../src/utilities/SystemUtilities");

describe("memoryUtilities", () => {
  describe("getMemoryUsage", () => {
    let originalProcess: any;
    let originalPerformance: any;

    beforeAll(() => {
      originalProcess = global.process;
      originalPerformance = global.performance;
    });

    afterEach(() => {
      global.process = originalProcess;
      global.performance = originalPerformance;
      jest.resetAllMocks();
    });

    it("should return memory usage in Node.js environment", () => {
      (SystemUtilities.isNodeEnvironment as jest.Mock).mockReturnValue(true);
      (SystemUtilities.isBrowserEnvironment as jest.Mock).mockReturnValue(
        false
      );

      global.process = {
        ...originalProcess,
        memoryUsage: () => ({ heapUsed: 12345678 }),
      };

      const result = getMemoryUsage();
      console.log(
        `Test getMemoryUsage (Node.js): Expected 12345678, Received ${result}`
      );
      expect(result).toBe(12345678);
    });

    it("should return memory usage in browser environment", () => {
      (SystemUtilities.isNodeEnvironment as jest.Mock).mockReturnValue(false);
      (SystemUtilities.isBrowserEnvironment as jest.Mock).mockReturnValue(true);

      global.performance = {
        ...originalPerformance,
        memory: { usedJSHeapSize: 9876543 },
      };

      const result = getMemoryUsage();
      console.log(
        `Test getMemoryUsage (Browser): Expected 9876543, Received ${result}`
      );
      expect(result).toBe(9876543);
    });

    it("should return undefined if memory usage is not supported", () => {
      (SystemUtilities.isNodeEnvironment as jest.Mock).mockReturnValue(false);
      (SystemUtilities.isBrowserEnvironment as jest.Mock).mockReturnValue(
        false
      );

      const result = getMemoryUsage();
      console.log(
        `Test getMemoryUsage (Unsupported environment): Expected undefined, Received ${result}`
      );
      expect(result).toBeUndefined();
    });

    it("should return undefined if performance.memory is not available in browser", () => {
      (SystemUtilities.isNodeEnvironment as jest.Mock).mockReturnValue(false);
      (SystemUtilities.isBrowserEnvironment as jest.Mock).mockReturnValue(true);

      global.performance = {
        ...originalPerformance,
        memory: undefined,
      };

      const result = getMemoryUsage();
      console.log(
        `Test getMemoryUsage (Browser without performance.memory): Expected undefined, Received ${result}`
      );
      expect(result).toBeUndefined();
    });
  });
});
