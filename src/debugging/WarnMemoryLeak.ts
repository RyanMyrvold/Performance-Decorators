import { getMemoryUsage, isNodeEnvironment } from "../utilities";

/**
 * Class decorator to monitor and warn about potential memory leaks.
 * Works in both Node.js and browser environments.
 *
 * @param checkIntervalMs - Interval in milliseconds to check memory usage.
 * @param thresholdPercent - Percentage increase in memory usage to trigger warning.
 * @param logger - Logging function to use for warnings.
 * @param enableManualGC - Enables manual garbage collection in Node.js (requires --expose-gc flag).
 */
function WarnMemoryLeak(
  checkIntervalMs: number = 30000,
  thresholdPercent: number = 20,
  logger: (msg: string) => void = console.warn,
  enableManualGC: boolean = false
) {
  return (target: any) => {
    return class extends target {
      public intervalId: NodeJS.Timeout | number | null = null;
      public initialMemoryUsage: number | undefined;
      public className: string;

      constructor(...args: any[]) {
        super(...args);
        this.className = target.name;
        this.initialMemoryUsage = getMemoryUsage();
        this.setupMemoryLeakCheck();
      }

      public setupMemoryLeakCheck() {
        const checkForMemoryLeaks = () => {
          const currentMemoryUsage = getMemoryUsage();
          if (currentMemoryUsage !== undefined && this.initialMemoryUsage !== undefined) {
            const increase = ((currentMemoryUsage - this.initialMemoryUsage) / this.initialMemoryUsage) * 100;
            if (increase > thresholdPercent) {
              logger(`⚠️ [Memory Leak] Memory usage increased by ${increase.toFixed(2)}% in ${this.className}, indicating a potential memory leak.`);
            }
          }
        };

        const maybeRunGC = () => {
          if (enableManualGC && isNodeEnvironment() && typeof global.gc === "function") {
            global.gc();
          }
        };

        if (!this.intervalId) {
          this.intervalId = setInterval(() => {
            maybeRunGC();
            checkForMemoryLeaks();
          }, checkIntervalMs);
        }
      }

      public cleanup() {
        if (this.intervalId) {
          clearInterval(this.intervalId as NodeJS.Timeout);
          this.intervalId = null;
        }
      }
    };
  };
}

export default WarnMemoryLeak;
