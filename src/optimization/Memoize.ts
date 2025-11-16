import { Method, MethodContext } from "../types";

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
export function Memoize<Args extends unknown[]>(
  cacheKeyFactory?: (...args: Args) => string
) {
  // instance → (methodKey → Map<key, value/Promise>)
  const caches = new WeakMap<object, Map<string | symbol, Map<string, unknown>>>();

  const keyOf = (...args: Args): string => {
    if (cacheKeyFactory) return cacheKeyFactory(...args);
    try { return JSON.stringify(args); } catch {
      return args.map((a) => `${typeof a}:${String(a)}`).join("|");
    }
  };

  return function <This extends object, Return>(
    value: Method<This, Args, Return>,
    context: MethodContext<This, Args, Return>
  ): Method<This, Args, Return> {
    const methodKey = context.name;

    return function (this: This, ...args: Args): Return {
      const self = this as unknown as object;

      if (!caches.get(self)) caches.set(self, new Map());
      const perMethod = caches.get(self)!;

      if (!perMethod.get(methodKey)) perMethod.set(methodKey, new Map());
      const cache = perMethod.get(methodKey)!;

      const key = keyOf(...args);
      if (cache.has(key)) return cache.get(key) as Return;

      const out = value.apply(this, args);
      cache.set(key, out as unknown);
      return out;
    };
  };
}
