import { Method, MethodContext } from '../types';

/**
 * Memoizes method results per-instance using a configurable cache key.
 * Works for sync and async methods; Promises are cached as-is.
 *
 * @param cacheKeyFactory Custom key builder from args (default JSON.stringify).
 *
 * @example
 * class Fib {
 *   @Memoize()
 *   fib(n: number): number {
 *     return n <= 1 ? n : this.fib(n - 1) + this.fib(n - 2);
 *   }
 * }
 */
export function Memoize<Args extends unknown[]>(cacheKeyFactory?: (...args: Args) => string) {
  const instanceCaches = new WeakMap<object, Map<string | symbol, Map<string, unknown>>>();

  const generateCacheKey = (...args: Args): string => {
    if (cacheKeyFactory) return cacheKeyFactory(...args);
    try {
      return JSON.stringify(args);
    } catch {
      return args.map((arg) => `${typeof arg}:${String(arg)}`).join('|');
    }
  };

  return function <This extends object, Return>(value: Method<This, Args, Return>, context: MethodContext<This, Args, Return>): Method<This, Args, Return> {
    const methodKey = context.name;

    return function (this: This, ...args: Args): Return {
      const instance = this as unknown as object;

      if (!instanceCaches.get(instance)) instanceCaches.set(instance, new Map());
      const perInstanceMethodMap = instanceCaches.get(instance)!;

      if (!perInstanceMethodMap.get(methodKey)) perInstanceMethodMap.set(methodKey, new Map());
      const methodCache = perInstanceMethodMap.get(methodKey)!;

      const cacheKey = generateCacheKey(...args);
      if (methodCache.has(cacheKey)) return methodCache.get(cacheKey) as Return;

      const result = value.apply(this, args);
      methodCache.set(cacheKey, result as unknown);
      return result;
    };
  };
}
