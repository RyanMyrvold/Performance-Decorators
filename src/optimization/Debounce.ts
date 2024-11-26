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
export function Debounce(delay: number = 300) {
    if (delay < 0) {
      throw new Error("🐞 [Debounce] Delay must be non-negative.");
    }

    return function (originalMethod: Function, context: ClassMethodDecoratorContext) {
      if (typeof originalMethod !== "function") {
        throw new Error("🐞 [Debounce] Can only be applied to method declarations.");
      }

      let timeoutId: ReturnType<typeof setTimeout> | null = null;

      return function (this: any, ...args: any[]) {
        const promiseExecutor = (
          resolve: (value?: any) => void,
          reject: (reason?: any) => void
        ): void => {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          timeoutId = setTimeout(() => {
            try {
              const result = originalMethod.apply(this, args);
              if (result instanceof Promise) {
                result.then(resolve).catch(reject);
              } else {
                resolve(result);
              }
            } catch (error) {
              reject(error);
              console.error(`🚨 [Debounce] Error in method ${String(context.name)}: ${error}`);
            }
          }, delay);
        };

        return new Promise(promiseExecutor);
      };
    };
  }
