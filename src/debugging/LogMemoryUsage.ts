import { getMemoryUsage } from "../utilities/MemoryUtilities";

/**
 * Decorator to log the memory usage before and after the method execution. It uses process.memoryUsage()
 * in Node.js and performance.memory in browsers (where available).
 * @param memoryHandler - An optional custom memory handler function that takes the memory usage data and method name as parameters.
 * @returns MethodDecorator
 */
function LogMemoryUsage(memoryHandler?: (memoryUsed: number, methodName: string) => void) {
  return function (originalMethod: any, context: any) {
    if (typeof originalMethod !== "function") {
      throw new Error("🐞 [LogMemoryUsage] Can only be applied to methods.");
    }

    return function (this: any, ...args: any[]) {
      let memoryBefore;
      try {
        memoryBefore = getMemoryUsage();
      } catch (error) {
        console.error("🐞 [Memory Usage] Error measuring memory before execution:", error);
        return originalMethod.apply(this, args);
      }

      const result = originalMethod.apply(this, args);

      let memoryAfter;
      try {
        memoryAfter = getMemoryUsage();
      } catch (error) {
        console.error("🐞 [Memory Usage] Error measuring memory after execution:", error);
        return result;
      }

      if (memoryBefore === undefined || memoryAfter === undefined) {
        console.error("🐞 [Memory Usage] Memory measurement is not supported in this environment.");
        return result;
      }

      const memoryUsed = memoryAfter - memoryBefore;
      const methodName = typeof context.name === 'symbol' ? String(context.name) : context.name;

      console.log(`🧠 [Memory Usage] ${methodName}: Memory used=${memoryUsed} bytes`);

      memoryHandler?.(memoryUsed, methodName);

      return result;
    };
  };
}

export default LogMemoryUsage;
