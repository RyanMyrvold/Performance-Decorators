/**
 * Decorator to log the execution time of a method. It uses high-resolution time in Node.js
 * and performance.now() in browsers.
 * @param handler - A custom handler function that takes the execution time as a parameter.
 * @returns MethodDecorator
 */
function LogExecutionTime(handler?: (executionTime: number, methodName: string) => void): MethodDecorator {


    const isNodeEnvironment = typeof process !== 'undefined' && process.hrtime && process.hrtime.bigint;
    const isBrowserEnvironment = typeof performance !== 'undefined' && performance.now;

    return function (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
        if (typeof descriptor.value !== 'function') {
            throw new Error('🐞 [LogExecutionTime] Can only be applied to methods.');
        }

        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            let start: number | bigint;
            let end: number | bigint;

            if (isNodeEnvironment) {
                start = process.hrtime.bigint();
            } else if (isBrowserEnvironment) {
                start = performance.now();
            } else {
                console.error('🐞 [LogExecutionTime] Performance timing is not supported in this environment.');
                return originalMethod.apply(this, args);
            }

            const result = originalMethod.apply(this, args);

            if (isNodeEnvironment) {
                end = process.hrtime.bigint();
                // Ensure both are bigint before subtraction
                const executionTime = Number(end - (start as bigint)) / 1_000_000;
                handler?.(executionTime, `${target.constructor.name}.${String(propertyKey)}`);
            } else {
                end = performance.now();
                // Ensure both are number before subtraction
                const executionTime = (end as number) - (start as number);
                handler?.(executionTime, `${target.constructor.name}.${String(propertyKey)}`);
            }

            return result;
        };

        return descriptor;
    };
}

export default LogExecutionTime;
