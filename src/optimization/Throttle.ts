/**
 * Method decorator to throttle a method call, ensuring that the function is not executed more than once
 * in the specified delay period. This is useful for rate-limiting execution of handlers on events that
 * trigger continuously, such as window scroll or resizing, or key presses.
 *
 * @param delay The number of milliseconds to limit the method calls.
 * @returns MethodDecorator
 */
export function Throttle(delay: number = 300) {
  if (delay < 0) {
    throw new Error("🚨 [Throttle] Delay must be non-negative.");
  }

  return function (originalMethod: any, context: ClassMethodDecoratorContext) {
    // Ensure the decorator is applied to a method
    if (typeof originalMethod !== 'function') {
      throw new Error("🐞 [Throttle] Can only be applied to method declarations.");
    }

    let lastCallTime: number = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return function (this: any, ...args: any[]): void {
      const now = Date.now();
      const timeSinceLastExecution = now - lastCallTime;

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      if (timeSinceLastExecution >= delay) {
        lastCallTime = now;
        originalMethod.apply(this, args);
      } else {
        timeoutId = setTimeout(() => {
          lastCallTime = Date.now();
          originalMethod.apply(this, args);
        }, delay - timeSinceLastExecution);
      }
    };
  };
}
