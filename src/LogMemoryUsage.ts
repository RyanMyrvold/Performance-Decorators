/**
 * Decorator to log the memory usage before and after the method execution.
 * @returns MethodDecorator
 */
function LogMemoryUsage(): MethodDecorator {
    return function(target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
        if (typeof descriptor.value !== 'function') {
            throw new Error('🐞 [LogMemoryUsage] Can only be applied to methods.');
        }

        const originalMethod = descriptor.value;
        descriptor.value = function(...args: any[]) {
            let memoryBefore: number | undefined;
            let memoryAfter: number | undefined;

            // Node.js environment
            if (typeof process !== 'undefined' && process.memoryUsage) {
                memoryBefore = process.memoryUsage().heapUsed;
            }
            // Browser environment (non-standard)
            else if (typeof performance !== 'undefined' && performance.memory) {
                memoryBefore = performance.memory.usedJSHeapSize;
            }

            const result = originalMethod.apply(this, args);

            // Node.js environment
            if (typeof process !== 'undefined' && process.memoryUsage) {
                memoryAfter = process.memoryUsage().heapUsed;
            }
            // Browser environment (non-standard)
            else if (typeof performance !== 'undefined' && performance.memory) {
                memoryAfter = performance.memory.usedJSHeapSize;
            }

            if (memoryBefore !== undefined && memoryAfter !== undefined) {
                console.log(`🧠 [Memory Usage] ${target.constructor.name}.${String(propertyKey)}: Before=${memoryBefore}, After=${memoryAfter}`);
            } else {
                console.error('🐞 [Memory Usage] Memory measurement is not supported in this environment.');
            }

            return result;
        };
        return descriptor;
    };
}

export default LogMemoryUsage;
