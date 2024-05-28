import { getMemoryUsage } from "../utilities/MemoryUtilities";

/**
 * Class decorator to monitor and warn about potential memory leaks.
 * Works in both Node.js and browser environments.
 *
 * @param checkIntervalMs - Interval in milliseconds to check memory usage.
 * @param thresholdPercent - Percentage increase in memory usage to trigger warning.
 * @param logger - Logging function to use for warnings.
 * @param enableManualGC - Enables manual garbage collection in Node.js (requires --expose-gc flag).
 * @returns ClassDecorator
 */
function WarnMemoryLeak(
  checkIntervalMs: number = 30000,
  thresholdPercent: number = 20,
  logger: (msg: string) => void = console.warn,
  enableManualGC: boolean = false
): ClassDecorator {
  return function (constructor: Function) {
    const className = constructor.name;
    let intervalId: NodeJS.Timeout | number | null = null;

    const augmentedConstructor: any = function (...args: any[]) {
      const instance = new (constructor as new (...args: any[]) => any)(
        ...args
      );

      // Initial memory usage
      let initialMemoryUsage = getMemoryUsage();

      // Function to check for memory leaks
      function checkForMemoryLeaks() {
        const currentMemoryUsage = getMemoryUsage();

        if (
          currentMemoryUsage !== undefined &&
          initialMemoryUsage !== undefined
        ) {
          const increase =
            ((currentMemoryUsage - initialMemoryUsage) / initialMemoryUsage) *
            100;

          // Trigger warning if memory usage exceeds the threshold
          if (increase > thresholdPercent) {
            logger(`⚠️ [Memory Leak] Memory usage increased by ${increase.toFixed(2)}% in ${className}, indicating a potential memory leak.`
            );
          }
        }
      }

      // Manual garbage collection in Node.js environment
      function maybeRunGC() {
        if (enableManualGC && typeof global.gc === "function") {
          global.gc();
        }
      }

      // Set up an interval for memory usage checking
      if (!intervalId) {
        intervalId = setInterval(() => {
          maybeRunGC();
          checkForMemoryLeaks();
        }, checkIntervalMs);
      }

      // Cleanup mechanism
      instance._cleanup = () => {
        if (intervalId) {
          clearInterval(intervalId as NodeJS.Timeout);
          intervalId = null;
        }
      };

      return instance;
    };

    augmentedConstructor.prototype = constructor.prototype;

    return augmentedConstructor;
  };
}

export default WarnMemoryLeak;
