/**
 * Method decorator to cache results of expensive function calls based on arguments.
 * Useful for optimizing performance of deterministic functions by storing previous results.
 *
 * @returns MethodDecorator
 */
export function Memoize() {
  return function (originalMethod: Function, context: ClassMethodDecoratorContext) {
    const cacheSymbol = Symbol(`Memoize Cache: ${String(context.name)}`);

    return function (this: any, ...args: any[]) {
      if (!this[cacheSymbol]) {
        this[cacheSymbol] = new Map();
      }

      const cache = this[cacheSymbol];
      const cacheKey = JSON.stringify(args);

      if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
      }

      const result = originalMethod.apply(this, args);
      cache.set(cacheKey, result);
      return result;
    };
  };
}
