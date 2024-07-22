import { isBrowserEnvironment, isNodeEnvironment } from "../../src/utilities";
import { calculateTimeInMilliseconds, getHighResolutionTime } from "../utilities/TimeUtilities";

/**
 * Decorator to log the execution time of a method. It uses high-resolution time in Node.js
 * and performance.now() in browsers.
 * @param handler - A custom handler function that takes the execution time and method name as parameters.
 * @returns MethodDecorator
 */
function LogExecutionTime(handler?: (executionTime: number, methodName: string) => void) {

  return function (originalMethod: any, context: any) {

    if (typeof originalMethod !== "function") {
      throw new Error("🐞 [Execution Time] Can only be applied to methods.");
    }

    return function (this: any, ...args: any[]) {
      let start: number | bigint;
      let end: number | bigint = 0; // Initialize 'end' variable with a default value
      
      try {
        if (isBrowserEnvironment()) {
          start = performance.now();
        } else if (isNodeEnvironment()) {
          start = getHighResolutionTime();
        } else {
          throw new Error("Unsupported environment for high-resolution timing");
        }
      } catch (error) {
        console.error("Error getting high-resolution time:", error);
        return originalMethod.apply(this, args);
      }

      try {
        const result = originalMethod.apply(this, args);

        let end: number | bigint = 0; // Initialize 'end' variable with a default value
        try {
          if (isBrowserEnvironment()) {
            end = performance.now();
          } else if (isNodeEnvironment()) {
            end = getHighResolutionTime();
          }
          const executionTime = calculateTimeInMilliseconds(start, end);
          const methodName = context.name;
          handler?.(executionTime, methodName);
        } catch (error) {
          console.error("Error calculating execution time:", error);
        }

        return result;
      } catch (error) {
        try {
          if (isBrowserEnvironment()) {
            end = performance.now();
          } else if (isNodeEnvironment()) {
            end = getHighResolutionTime();
          }
          const executionTime = calculateTimeInMilliseconds(start, end);
          const methodName = context.name;
          handler?.(executionTime, methodName);
        } catch (innerError) {
          console.error("Error calculating execution time:", innerError);
        }
        throw error; // rethrow the original error
      }
    };
  };
}

export default LogExecutionTime;
