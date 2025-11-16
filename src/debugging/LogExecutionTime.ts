// src/debugging/LogExecutionTime.ts
import { Method, MethodContext } from "../types";
import { isBrowserEnvironment, isNodeEnvironment } from "../utilities";
import { calculateTimeInMilliseconds, getHighResolutionTime } from "../utilities/TimeUtilities";

/**
 * Logs execution time for a method using high-resolution clocks.
 *
 * - Browser: performance.now()
 * - Node: getHighResolutionTime() (bigint)
 * - Fallback: Date.now()
 *
 * Works for sync and async methods. Invokes the optional handler with (ms, methodName).
 *
 * @param handler Optional callback invoked as (elapsedMs, methodName).
 *
 * @example
 * class ExampleService {
 *   @LogExecutionTime((ms, name) => console.debug(`[${name}] ${ms.toFixed(2)}ms`))
 *   compute(n: number): number {
 *     let s = 0; for (let i = 0; i < n; i += 1) s += i; return s;
 *   }
 * }
 */
export function LogExecutionTime(
  handler?: (ms: number, methodName: string) => void
) {
  return function <This, Args extends unknown[], Return>(
    value: Method<This, Args, Return>,
    context: MethodContext<This, Args, Return>
  ): Method<This, Args, Return> {
    const name = String(context.name);

    return function (this: This, ...args: Args): Return {
      let start: number | bigint;
      try {
        start = getHighResolutionTime();
      } catch {
        // Fall back: still run original
        return value.apply(this, args);
      }

      try {
        const out = value.apply(this, args);
        if (out instanceof Promise) {
          return (async () => {
            try {
              const r = await out;
              const end = getHighResolutionTime();
              handler?.(calculateTimeInMilliseconds(start, end), name);
              return r;
            } catch (e) {
              const end = getHighResolutionTime();
              handler?.(calculateTimeInMilliseconds(start, end), name);
              throw e;
            }
          })() as unknown as Return;
        } else {
          const end = getHighResolutionTime();
          handler?.(calculateTimeInMilliseconds(start, end), name);
          return out;
        }
      } catch (e) {
        const end = getHighResolutionTime();
        handler?.(calculateTimeInMilliseconds(start, end), name);
        throw e;
      }
    };
  };
}
