import { Method, MethodContext } from '../types';

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
  if (delay < 0) throw new Error('Throttle: delay must be non-negative.');

  type ThrottleState = { lastRun: number; timer: ReturnType<typeof setTimeout> | null; lastArgs: unknown[] | null };

  const instanceStates = new WeakMap<object, Map<string | symbol, ThrottleState>>();

  return function <This, Args extends unknown[]>(value: Method<This, Args, void>, context: MethodContext<This, Args, void>): Method<This, Args, void> {
    const methodKey = context.name;

    return function (this: This, ...args: Args): void {
      const instance = this as unknown as object;
      if (!instanceStates.get(instance)) instanceStates.set(instance, new Map());
      const perInstanceMap = instanceStates.get(instance)!;

      let state = perInstanceMap.get(methodKey);
      if (!state) {
        state = { lastRun: 0, timer: null, lastArgs: null };
        perInstanceMap.set(methodKey, state);
      }

      const currentTime = Date.now();
      const timeSinceLastRun = currentTime - state.lastRun;

      if (timeSinceLastRun >= delay) {
        if (state.timer) {
          clearTimeout(state.timer);
          state.timer = null;
        }
        state.lastRun = currentTime;
        value.apply(this, args);
        return;
      }

      state.lastArgs = args;
      if (state.timer) clearTimeout(state.timer);
      state.timer = setTimeout(() => {
        state!.lastRun = Date.now();
        const argsToExecute = state!.lastArgs ?? [];
        state!.lastArgs = null;
        value.apply(this, argsToExecute as Args);
        state!.timer = null;
      }, delay - timeSinceLastRun);
    };
  };
}
