/**
 * Decorator to log a warning if the method execution time exceeds 100ms.
 * @returns MethodDecorator
 */
function WarnPerformanceThreshold(): MethodDecorator {
    return function(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
        if (typeof descriptor.value !== 'function') {
            throw new Error('🐞 [Warn Performance Threshold] Can only be applied to methods.');
        }

        const originalMethod = descriptor.value;
        descriptor.value = function(...args: any[])  {
            let start: number | bigint;
            let end: number | bigint;

            // Use high-resolution time in Node.js, performance.now() in browsers
            if (typeof process !== 'undefined' && process.hrtime && process.hrtime.bigint) {
                start = process.hrtime.bigint();
                const result = originalMethod.apply(this, args);
                end = process.hrtime.bigint();

                // Convert nanoseconds to milliseconds
                const executionTime = Number(end - start) / 1_000_000;
                if (executionTime > 100) {
                    console.warn(`⚠️ [Performance Warning] ${target.constructor.name}.${String(propertyKey)} exceeded threshold of 100 ms`);
                }
                return result;
            } else if (typeof performance !== 'undefined' && performance.now) {
                start = performance.now();
                const result = originalMethod.apply(this, args);
                end = performance.now();

                if (end - start > 100) {
                    console.warn(`⚠️ [Performance Warning] ${target.constructor.name}.${String(propertyKey)} exceeded threshold of 100 ms`);
                }
                return result;
            } else {
                // Fallback if no timing function is available
                console.error('🐞[Warn Performance Threshold] Performance timing not supported in this environment.');
                return originalMethod.apply(this, args);

            }
        };
        return descriptor;
    };
}

export default WarnPerformanceThreshold;



export class Tester {

    @WarnPerformanceThreshold()
    public testMethod(): void {
        console.log('Test method called');
    }
}