/**
 * Logs the memory usage before and after the execution of a method.
 * Works only in Node.js environment using `process.memoryUsage()`.
 *
 * @returns A method decorator that logs memory usage in MB.
 */
export function LogMemoryUsage(): MethodDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
      const start = process.memoryUsage().heapUsed / 1024 / 1024;

      const result = originalMethod.apply(this, args);

      if (result instanceof Promise) {
        return result.then((res) => {
          const end = process.memoryUsage().heapUsed / 1024 / 1024;
          console.log(`[${String(propertyKey)}] Memory used: ${(end - start).toFixed(2)} MB`);
          return res;
        });
      }

      const end = process.memoryUsage().heapUsed / 1024 / 1024;
      console.log(`[${String(propertyKey)}] Memory used: ${(end - start).toFixed(2)} MB`);

      return result;
    };

    return descriptor;
  };
}
