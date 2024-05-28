import { calculateTimeInMilliseconds, getHighResolutionTime } from "../utilities/TimeUtilities";


/**
 * Decorator to log the execution time of a method. It uses high-resolution time in Node.js
 * and performance.now() in browsers.
 * @param handler - A custom handler function that takes the execution time and method name as parameters.
 * @returns MethodDecorator
 */
function LogExecutionTime(
  handler?: (executionTime: number, methodName: string) => void
): MethodDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    if (typeof descriptor.value !== "function") {
      throw new Error("🐞 [Execution Time] Can only be applied to methods.");
    }

    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      let start: number | bigint;
      let end: number | bigint;

      try {
        start = getHighResolutionTime();
      } catch (error) {
        console.error(error);

        return originalMethod.apply(this, args);
      }

      const result = originalMethod.apply(this, args);

      try {
        
        end = getHighResolutionTime();

        const executionTime = calculateTimeInMilliseconds(start, end);

        handler?.(executionTime,`${target.constructor.name}.${String(propertyKey)}`);
      } catch (error) {
        console.error(error);
      }

      return result;
    };

    return descriptor;
  };
}

export default LogExecutionTime;
