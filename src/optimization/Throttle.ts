/**
 * Method decorator to throttle a method call, ensuring that the function is not executed more than once
 * in the specified delay period. This is useful for rate-limiting execution of handlers on events that
 * trigger continuously, such as window scroll or resizing, or key presses.
 *
 * @param delay The number of milliseconds to limit the method calls.
 * @returns MethodDecorator
 */
function Throttle(delay: number = 300): MethodDecorator {
  if (delay < 0) {
    throw new Error("🚨 [Throttle] Delay must be non-negative.");
  }

  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    if (typeof descriptor.value !== "function") {
      throw new Error(
        "🐞 [Throttle] Can only be applied to method declarations."
      );
    }

    const originalMethod = descriptor.value;
    let lastCallTime: number = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    descriptor.value = function (...args: any[]) {
      const now = Date.now();

      const timeSinceLastExecution = now - lastCallTime;
      clearTimeout(timeoutId as NodeJS.Timeout);

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

    return descriptor;
  };
}

export default Throttle;
