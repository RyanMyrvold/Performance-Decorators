/**
 * Decorator to log a warning if the method execution time exceeds a specified threshold.
 * It uses high-resolution time in Node.js and performance.now() in browsers.
 * @param threshold - The execution time threshold in milliseconds. Defaults to 100ms.
 * @param performanceHandler - An optional custom performance handler function that takes
 *                             the execution time and method name as parameters.
 * @returns MethodDecorator
 */
function WarnPerformanceThreshold(threshold: number = 100, performanceHandler?: (executionTime: number, methodName: string) => void) {

  return function (originalMethod: Function, context: { kind: string, name: string | symbol }) {
    
    if (typeof originalMethod !== "function") {
      throw new Error("🐞 [Performance Threshold] Can only be applied to methods.");
    }

    return function (this: any, ...args: any[]) {
      const isNodeEnvironment =
        typeof process !== "undefined" && process.hrtime && process.hrtime.bigint;
      const isBrowserEnvironment =
        typeof performance !== "undefined" && performance.now;

      let start: number | bigint | undefined;
      let end: number | bigint | undefined;
      let executionTime: number;

      if (isNodeEnvironment) {
        start = process.hrtime.bigint();
      } else if (isBrowserEnvironment) {
        start = performance.now();
      }

      const result = originalMethod.apply(this, args);

      if (isNodeEnvironment && start !== undefined) {
        end = process.hrtime.bigint();
        executionTime = Number(end - BigInt(start)) / 1_000_000; // Convert nanoseconds to milliseconds
      } else if (isBrowserEnvironment && start !== undefined) {
        end = performance.now();
        executionTime = end - Number(start);
      } else {
        console.error("🐞 [Performance] Performance timing not supported in this environment.");
        return result;
      }

      if (executionTime > threshold) {
        const methodName = typeof context.name === 'symbol' ? String(context.name) : context.name;
        const warningMessage = `⚠️ [Performance] ${methodName} exceeded threshold of ${threshold} ms`;
        console.warn(warningMessage);
        performanceHandler?.(executionTime, methodName);
      }

      return result;
    };
  };
}

export default WarnPerformanceThreshold;
