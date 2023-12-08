/**
 * Decorator to log a warning if the method execution time exceeds a specified threshold. It uses high-resolution time in Node.js
 * and performance.now() in browsers.
 * @param threshold - The execution time threshold in milliseconds. Defaults to 100ms.
 * @param performanceHandler - An optional custom performance handler function that takes the execution time and method name as parameters.
 * @returns MethodDecorator
 */
function WarnPerformanceThreshold(threshold: number = 100, performanceHandler?: (executionTime: number, methodName: string) => void): MethodDecorator {
    return function(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
        if (typeof descriptor.value !== 'function') {
            throw new Error('🐞 [Warn Performance Threshold] Can only be applied to methods.');
        }

        const originalMethod = descriptor.value;

        descriptor.value = function(...args: any[])  {
            let start: number | bigint;
            let end: number | bigint;
            let isNodeEnvironment = typeof process !== 'undefined' && process.hrtime && process.hrtime.bigint;

            if (isNodeEnvironment) {
                // Node.js environment: Use high-resolution time
                start = process.hrtime.bigint();
                const result = originalMethod.apply(this, args);
                end = process.hrtime.bigint();

                // Convert nanoseconds to milliseconds
                const executionTime = Number(end - start) / 1_000_000;
                if (executionTime > threshold) {
                    console.warn(`⚠️ [Performance Warning] ${target.constructor.name}.${String(propertyKey)} exceeded threshold of ${threshold} ms`);
                    performanceHandler?.(executionTime, `${target.constructor.name}.${String(propertyKey)}`);
                }
                return result;
            } else if (typeof performance !== 'undefined' && performance.now) {
                // Browser environment: Use performance.now()
                start = performance.now();
                const result = originalMethod.apply(this, args);
                end = performance.now();

                const executionTime = end - start;
                if (executionTime > threshold) {
                    console.warn(`⚠️ [Performance Warning] ${target.constructor.name}.${String(propertyKey)} exceeded threshold of ${threshold} ms`);
                    performanceHandler?.(executionTime, `${target.constructor.name}.${String(propertyKey)}`);
                }
                return result;
            } else {
                // Unsupported environment: Log error and execute the method without timing
                console.error('🐞 [Warn Performance Threshold] Performance timing not supported in this environment.');
                return originalMethod.apply(this, args);
            }
        };
        return descriptor;
    };
}

export default WarnPerformanceThreshold;