/**
 * Decorator to log a warning if the method execution time exceeds a specified threshold.
 * It uses high-resolution time in Node.js and performance.now() in browsers.
 * @param threshold - The execution time threshold in milliseconds. Defaults to 100ms.
 * @param performanceHandler - An optional custom performance handler function that takes
 *                             the execution time and method name as parameters.
 * @returns MethodDecorator
 */
function WarnPerformanceThreshold(
  threshold: number = 100,
  performanceHandler?: (executionTime: number, methodName: string) => void
): MethodDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    if (typeof descriptor.value !== "function") {
      throw new Error(
        "🐞 [WarnPerformanceThreshold] Can only be applied to methods."
      );
    }

    const originalMethod = descriptor.value;
    const isNodeEnvironment =
      typeof process !== "undefined" && process.hrtime && process.hrtime.bigint;
    const isBrowserEnvironment =
      typeof performance !== "undefined" && performance.now;

    descriptor.value = function (...args: any[]) {
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
        console.error(
          "🐞 [WarnPerformanceThreshold] Performance timing not supported in this environment."
        );
        return result;
      }

      if (executionTime > threshold) {
        const warningMessage = `⚠️ [Performance Warning] ${
          target.constructor.name
        }.${String(propertyKey)} exceeded threshold of ${threshold} ms`;
        console.warn(warningMessage);
        performanceHandler?.(
          executionTime,
          `${target.constructor.name}.${String(propertyKey)}`
        );
      }

      return result;
    };

    return descriptor;
  };
}

export default WarnPerformanceThreshold;
