/**
 * Decorator to log the execution time of a method.
 * @returns MethodDecorator
 */
function LogExecutionTime(): MethodDecorator {
    return function(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
        if (typeof descriptor.value !== 'function') {
            throw new Error('🐞 [LogExecutionTime] Can only be applied to methods.');
        }

        const originalMethod = descriptor.value;
        descriptor.value = function(...args: any[]) {
            let start: number | bigint;
            let end: number | bigint;

            // Use high-resolution time in Node.js, performance.now() in browsers
            if (typeof process !== 'undefined' && process.hrtime && process.hrtime.bigint) {
                start = process.hrtime.bigint();
                const result = originalMethod.apply(this, args);
                end = process.hrtime.bigint();

                // Convert nanoseconds to milliseconds
                const executionTime = Number(end - start) / 1_000_000;
                console.log(`⏱️ [Execution Time] ${target.constructor.name}.${String(propertyKey)}: ${executionTime.toFixed(3)} ms`);
                return result;
            } else if (typeof performance !== 'undefined' && performance.now) {
                start = performance.now();
                const result = originalMethod.apply(this, args);
                end = performance.now();

                const executionTime = end - start;
                console.log(`⏱️ [Execution Time] ${target.constructor.name}.${String(propertyKey)}: ${executionTime.toFixed(3)} ms`);
                return result;
            } else {
                // Fallback if no timing function is available
                console.error('🐞 [Log Execution Time] Performance timing is not spported in this environment.');

                return originalMethod.apply(this, args);
            }
        };
        return descriptor;
    };
}

export default LogExecutionTime;