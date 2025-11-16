import { Method, MethodContext } from "../types";

/**
 * Throttles a method: run at most once per `delay` ms.
 * - Leading call executes immediately.
 * - The most recent call during the window is scheduled to run once at the end (trailing).
 * - Return value is ignored (void) to avoid confusion across delayed calls.
 *
 * @param delay Non-negative throttle window in ms (default: 300)
 *
 * @example
 * class Scroller {
 *   @Throttle(100)
 *   onScroll(e: Event): void {
 *     // handle scroll
 *   }
 * }
 */
export function Throttle(delay: number = 300) {
  if (delay < 0) throw new Error("🚨 [Throttle] Delay must be non-negative.");

  type S = { lastRun: number; timer: ReturnType<typeof setTimeout> | null; lastArgs: unknown[] | null };

  // instance → (methodKey → state)
  const states = new WeakMap<object, Map<string | symbol, S>>();

  return function <This, Args extends unknown[]>(
    value: Method<This, Args, void>,
    context: MethodContext<This, Args, void>
  ): Method<This, Args, void> {
    const key = context.name;

    return function (this: This, ...args: Args): void {
      const self = this as unknown as object;
      if (!states.get(self)) states.set(self, new Map());
      const map = states.get(self)!;

      let s = map.get(key);
      if (!s) {
        s = { lastRun: 0, timer: null, lastArgs: null };
        map.set(key, s);
      }

      const now = Date.now();
      const elapsed = now - s.lastRun;

      if (elapsed >= delay) {
        if (s.timer) {
          clearTimeout(s.timer);
          s.timer = null;
        }
        s.lastRun = now;
        value.apply(this, args); // leading
        return;
      }

      // Coalesce trailing execution with latest args only
      s.lastArgs = args;
      if (s.timer) clearTimeout(s.timer);
      s.timer = setTimeout(() => {
        s!.lastRun = Date.now();
        const toCall = s!.lastArgs ?? [];
        s!.lastArgs = null;
        value.apply(this, toCall as Args); // trailing
        s!.timer = null;
      }, delay - elapsed);
    };
  };
}
