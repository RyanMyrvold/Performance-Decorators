/**
 * Logs an approximation of memory usage using `performance.memory` (Chrome-only).
 * Falls back to timing log if unavailable.
 *
 * @returns A method decorator that logs memory or fallback performance.
 */
export function LogMemoryUsage(): MethodDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
      const memory = (performance as any).memory;
      const start = memory?.usedJSHeapSize ?? performance.now();

      const result = originalMethod.apply(this, args);

      const logUsage = () => {
        const end = memory?.usedJSHeapSize ?? performance.now();
        const label = memory
          ? `[${String(propertyKey)}] JS Heap used: ${((end - start) / 1024 / 1024).toFixed(2)} MB`
          : `[${String(propertyKey)}] Time elapsed: ${(end - start).toFixed(2)} ms`;

        console.log(label);
      };

      if (result instanceof Promise) {
        return result.then((res) => {
          logUsage();
          return res;
        });
      }

      logUsage();
      return result;
    };

    return descriptor;
  };
}
