import { getMemoryUsage } from "./Utilities";

/**
 * Decorator to log the memory usage before and after the method execution. It uses process.memoryUsage()
 * in Node.js and performance.memory in browsers (where available).
 * @param memoryHandler - An optional custom memory handler function that takes the memory usage data and method name as parameters.
 * @returns MethodDecorator
 */
function LogMemoryUsage(
  memoryHandler?: (memoryUsed: number, methodName: string) => void
): MethodDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    if (typeof descriptor.value !== "function") {
      throw new Error("🐞 [LogMemoryUsage] Can only be applied to methods.");
    }

    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const memoryBefore = getMemoryUsage();

      if (memoryBefore === undefined) {
        console.error(
          "🐞 [LogMemoryUsage] Memory measurement is not supported in this environment."
        );

        return originalMethod.apply(this, args);
      }

      const result = originalMethod.apply(this, args);

      const memoryAfter = getMemoryUsage();

      if (memoryAfter === undefined) {
        console.error(
          "🐞 [LogMemoryUsage] Memory measurement is not supported in this environment."
        );

        return result;
      }

      const memoryUsed = memoryAfter - memoryBefore;

      console.log(
        `🧠 [Memory Usage] ${target.constructor.name}.${String(
          propertyKey
        )}: Memory used=${memoryUsed} bytes`
      );

      memoryHandler?.(
        memoryUsed,
        `${target.constructor.name}.${String(propertyKey)}`
      );

      return result;
    };

    return descriptor;
  };
}

export default LogMemoryUsage;
