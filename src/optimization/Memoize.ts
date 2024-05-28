
/**
 * Method decorator to cache results of expensive function calls based on arguments.
 * Useful for optimizing performance of deterministic functions by storing previous results.
 *
 * @returns MethodDecorator
 */
function Memoize(): MethodDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    if (typeof descriptor.value !== 'function') {
      throw new Error("🐞 [Memoize] Can only be applied to method declarations.");
    }

    const originalMethod = descriptor.value;
    const cacheSymbol = Symbol(`Memoize Cache: ${String(propertyKey)}`);

    descriptor.value = function (...args: any[]) {
      if (!(this as any)[cacheSymbol]) {
        (this as any)[cacheSymbol] = new Map();
      }

      const cache = (this as any)[cacheSymbol];
      const cacheKey = JSON.stringify(args);

      if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
      }

      const result = originalMethod.apply(this, args);
      cache.set(cacheKey, result);
      return result;
    };

    return descriptor;
  };
}

export default Memoize;

