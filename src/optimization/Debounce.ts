import { Method, MethodContext } from '../types';

/**
 * Debounces a method so that only the latest call within `delay` ms runs.
 * The wrapped method returns a Promise that resolves/rejects with the
 * original method’s result/error after the debounce delay.
 *
 * Notes:
 * - Calls coalesce: only the last invocation in the window executes.
 * - If the original method is synchronous, its result is wrapped in a Promise.
 * - Rejections are propagated.
 *
 * @param delay Non-negative debounce delay in ms (default: 300)
 *
 * @example
 * class SearchBox {
 *   query = "";
 *
 *   @Debounce(250)
 *   async fetch(): Promise<string> {
 *     const res = await fetch(`/api?q=${encodeURIComponent(this.query)}`);
 *     return res.text();
 *   }
 * }
 */
export function Debounce(delay: number = 300) {
  if (delay < 0) throw new Error('Debounce: delay must be non-negative.');

  type DebounceBucket = {
    timer: ReturnType<typeof setTimeout> | null;
    lastArgs: unknown[] | null;
    deferred: { resolve: (value: unknown) => void; reject: (error: unknown) => void } | null;
  };

  const instanceBuckets = new WeakMap<object, Map<string | symbol, DebounceBucket>>();

  return function <This, Args extends unknown[], Return>(value: Method<This, Args, Return>, context: MethodContext<This, Args, Return>): Method<This, Args, Return> {
    const methodKey = context.name;

    return function (this: This, ...args: Args): Return {
      const instance = this as unknown as object;
      if (!instanceBuckets.get(instance)) instanceBuckets.set(instance, new Map());
      const perInstanceMap = instanceBuckets.get(instance)!;

      let bucket = perInstanceMap.get(methodKey);
      if (!bucket) {
        bucket = { timer: null, lastArgs: null, deferred: null };
        perInstanceMap.set(methodKey, bucket);
      }

      if (bucket.timer) {
        clearTimeout(bucket.timer);
        bucket.timer = null;
      }

      bucket.lastArgs = args;

      let resolveDeferred!: (value: unknown) => void;
      let rejectDeferred!: (error: unknown) => void;
      const deferredPromise = new Promise((res, rej) => ((resolveDeferred = res), (rejectDeferred = rej)));
      bucket.deferred = { resolve: resolveDeferred, reject: rejectDeferred };

      bucket.timer = setTimeout(() => {
        bucket!.timer = null;
        const finalArgs = (bucket!.lastArgs ?? []) as Args;
        try {
          const result = value.apply(this, finalArgs);
          const isThenable = result && typeof (result as any).then === 'function';
          if (isThenable) {
            (result as unknown as Promise<unknown>).then(bucket!.deferred!.resolve, bucket!.deferred!.reject);
          } else {
            bucket!.deferred!.resolve(result as unknown);
          }
        } catch (error) {
          console.error(`${String(methodKey)} threw:`, error);
          bucket!.deferred!.reject(error);
        } finally {
          bucket!.lastArgs = null;
          bucket!.deferred = null;
        }
      }, delay);

      return deferredPromise as unknown as Return;
    };
  };
}
