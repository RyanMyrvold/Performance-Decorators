/**
 * Method decorator to debounce a method call, ensuring that the function is not called more than once
 * within the specified delay. This is suitable for rate-limiting execution of handlers on
 * events that trigger very frequently such as window resize, scroll, or key press events in web applications.
 *
 * This version of debounce is designed to handle both synchronous and asynchronous methods uniformly and includes
 * comprehensive error handling to provide clear diagnostics.
 *
 * @param delay The number of milliseconds to delay; if zero or unspecified, a default of 300ms is used. The delay cannot be negative.
 * @returns MethodDecorator
 */
function Debounce(delay: number = 300): MethodDecorator {
    if (delay < 0) {
        throw new Error("🚨 [Debounce] Delay must be non-negative.");
    }

    return function (
        target: Object,
        propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<any>
    ) {
        if (typeof descriptor.value !== "function") {
            throw new Error("🐞 [Debounce] Can only be applied to method declarations.");
        }

        const originalMethod = descriptor.value;
        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        let lastResult: any;

        descriptor.value = function (...args: any[]) {
            // Documents handling different modes based on method's nature (sync/async).
            let promiseExecutor = (
                resolve: (value?: any) => void,
                reject: (reason?: any) => void
            ): void => {
                clearTimeout(timeoutId as NodeJS.Timeout);
                
                timeoutId = setTimeout(() => {
                    try {
                        // Invoke the original method and resolve or reject based on outcome.
                        const result = originalMethod.apply(this, args);
                        if (result instanceof Promise) {
                            result.then(resolve).catch(reject);
                        } else {
                            resolve(result);
                        }
                    } catch (error) {
                        reject(error);
                        console.error(`🚨 [Debounce] Error in method ${String(propertyKey)}: ${error}`);
                    }
                }, delay);
            };

            // Returns a new promise that will resolve or reject following the debounced invocation.
            return new Promise(promiseExecutor);
        };

        return descriptor;
    };
}

export default Debounce;