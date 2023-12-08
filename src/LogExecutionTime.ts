/**
 * Decorator to log the execution time of a method. It uses high-resolution time in Node.js
 * and performance.now() in browsers.
 * @param handler - A custom handler function that takes the execution time as a parameter.
 * @returns MethodDecorator
 */
function LogExecutionTime(handler?: (executionTime: number, methodName: string) => void): MethodDecorator {
    return function(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
        if (typeof descriptor.value !== 'function') {
            throw new Error('🐞 [LogExecutionTime] Can only be applied to methods.');
        }

        const originalMethod = descriptor.value;

        descriptor.value = function(...args: any[]) {
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
                handler?.(executionTime, `${target.constructor.name}.${String(propertyKey)}`);
                return result;
            } else if (typeof performance !== 'undefined' && performance.now) {
                // Browser environment: Use performance.now()
                start = performance.now();
                const result = originalMethod.apply(this, args);
                end = performance.now();

                const executionTime = end - start;
                handler?.(executionTime, `${target.constructor.name}.${String(propertyKey)}`);
                return result;
            } else {
                // Unsupported environment: Log error and execute the method without timing
                console.error('🐞 [Log Execution Time] Performance timing is not supported in this environment.');
                return originalMethod.apply(this, args);
            }
        };

        return descriptor;
    };
}

export default LogExecutionTime;