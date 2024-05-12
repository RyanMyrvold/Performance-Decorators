/**
 * Method decorator to debounce a method call, ensuring that the function is not called more than once
 * within the specified delay. This is particularly useful for rate-limiting execution of handlers on
 * events that will trigger frequently, such as window resize, scroll, or key press events in web applications.
 *
 * This version of debounce is enhanced to handle both synchronous and asynchronous methods uniformly and includes
 * comprehensive error handling to provide clear diagnostic messages.
 *
 * @param delay The number of milliseconds to delay; if zero or unspecified, no debouncing will occur.
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
        // Validate that this decorator is used on a method
        if (typeof descriptor.value !== "function") {
            throw new Error("🐞 [Debounce] Can only be applied to method declarations.");
        }

        const originalMethod = descriptor.value;
        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        let lastResult: any;

        descriptor.value = function (...args: any[]) {
            // Clear the timeout set by the previous call
            clearTimeout(timeoutId as NodeJS.Timeout);

            // Promise wrapper to handle both async and sync methods uniformly
            const promiseExecutor = (
                resolve: (value?: any) => void,
                reject: (reason?: any) => void
            ) => {
                timeoutId = setTimeout(() => {
                    try {
                        // Apply the original method in the correct context
                        lastResult = originalMethod.apply(this, args);
                        resolve(lastResult);
                    } catch (error) {
                        reject(error);
                        console.error(`🚨 [Debounce] Error in method ${String(propertyKey)}: ${error}`);
                    }
                }, delay);
            };

            // Check if the original method is async
            if (originalMethod.constructor.name === "AsyncFunction") {
                return new Promise(promiseExecutor);
            } else {
                // Execute the method synchronously after the delay
                promiseExecutor(
                    (result) => {
                        lastResult = result;
                    },
                    (error) => {
                        throw error;
                    }
                );
                return lastResult;
            }
        };

        return descriptor;
    };
}

export default Debounce;
