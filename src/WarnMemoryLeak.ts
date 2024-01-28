/**
 * Class decorator to monitor and warn about potential memory leaks.
 * Works in both Node.js and browser environments.
 *
 * @param {number} checkIntervalMs - Interval in milliseconds to check memory usage.
 * @param {number} thresholdPercent - Percentage increase in memory usage to trigger warning.
 * @param {(msg: string) => void} logger - Logging function to use for warnings.
 * @param {boolean} enableManualGC - Enables manual garbage collection in Node.js (requires --expose-gc flag).
 * @returns {ClassDecorator}
 */
function MemoryLeakWarning(
    checkIntervalMs: number = 30000,
    thresholdPercent: number = 20,
    logger: (msg: string) => void = console.warn,
    enableManualGC: boolean = false
): ClassDecorator {

    // Environment-specific memory usage measurement
    function getMemoryUsage(): number | undefined {
        
        const isNodeEnvironment = typeof process !== 'undefined' && process.memoryUsage;
        const isBrowserEnvironment = typeof performance !== 'undefined' && performance.memory;

        if (isNodeEnvironment) {
            // Node.js environment
            return process.memoryUsage().heapUsed;
        } else if (isBrowserEnvironment) {
            // Browser environment
            return performance?.memory?.usedJSHeapSize;
        }
        return undefined;
    }

    return function (constructor: Function) {

        let intervalId: NodeJS.Timeout | null = null;
        let initialMemoryUsage = getMemoryUsage();

        // Augmenting the constructor
        const augmentedConstructor: any = function (...args: any[]) {

            // Creating an instance of the original class
            const instance = Reflect.construct(constructor, args, augmentedConstructor);

            // Set up an interval for memory usage checking
            if (!intervalId) {

                intervalId = setInterval(() => {
                    // Manual garbage collection in Node.js environment
                    if (enableManualGC && global.gc && typeof process !== 'undefined') {
                        global.gc();
                    }

                    const currentMemoryUsage = getMemoryUsage();

                    if (currentMemoryUsage !== undefined && initialMemoryUsage !== undefined) {
                        const increase = (currentMemoryUsage - initialMemoryUsage) / initialMemoryUsage * 100;

                        // Trigger warning if memory usage exceeds the threshold
                        if (increase > thresholdPercent) {
                            logger(`⚠️ [Memory Leak Warning] Memory usage increased by ${increase.toFixed(2)}% in ${constructor.name}, indicating a potential memory leak.`);
                        }
                    }
                }, checkIntervalMs);
            }

            // Automatic cleanup mechanism
            instance._cleanup = () => {
                if (intervalId) {
                    clearInterval(intervalId);
                    intervalId = null;
                }
            };

            return instance;
        };

        // Ensure the prototype chain is maintained
        augmentedConstructor.prototype = constructor.prototype;

        return augmentedConstructor;
    };
}

export default MemoryLeakWarning;
