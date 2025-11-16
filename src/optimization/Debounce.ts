import { Method, MethodContext } from "../types";

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
  if (delay < 0) throw new Error("🐞 [Debounce] Delay must be non-negative.");

  type Bucket = {
    timer: ReturnType<typeof setTimeout> | null;
    lastArgs: unknown[] | null;
    deferred:
      | { resolve: (v: unknown) => void; reject: (e: unknown) => void }
      | null;
  };

  // instance → (methodKey → bucket)
  const buckets = new WeakMap<object, Map<string | symbol, Bucket>>();

  return function <This, Args extends unknown[], Return>(
    value: Method<This, Args, Return>,
    context: MethodContext<This, Args, Return>
  ): Method<This, Args, Return> {
    const key = context.name;

    return function (this: This, ...args: Args): Return {
      const self = this as unknown as object;
      if (!buckets.get(self)) buckets.set(self, new Map());
      const map = buckets.get(self)!;

      let b = map.get(key);
      if (!b) {
        b = { timer: null, lastArgs: null, deferred: null };
        map.set(key, b);
      }

      if (b.timer) {
        clearTimeout(b.timer);
        b.timer = null;
      }

      b.lastArgs = args;

      let resolve!: (v: unknown) => void;
      let reject!: (e: unknown) => void;
      const p = new Promise((res, rej) => ((resolve = res), (reject = rej)));
      b.deferred = { resolve, reject };

      b.timer = setTimeout(() => {
        b!.timer = null;
        const finalArgs = (b!.lastArgs ?? []) as Args;
        try {
          const out = value.apply(this, finalArgs);
          if (out instanceof Promise) {
            (out as Promise<unknown>).then(b!.deferred!.resolve, b!.deferred!.reject);
          } else {
            b!.deferred!.resolve(out as unknown);
          }
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(`🚨 [Debounce] ${String(key)} threw:`, e);
          b!.deferred!.reject(e);
        } finally {
          b!.lastArgs = null;
          b!.deferred = null;
        }
      }, delay);

      return p as unknown as Return;
    };
  };
}
