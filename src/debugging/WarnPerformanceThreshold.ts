// src/optimizations/WarnPerformanceThreshold.ts
import { Method, MethodContext } from "../types";
import { calculateTimeInMilliseconds, getHighResolutionTime } from "../utilities/TimeUtilities";

/**
 * Warns if a method's execution time exceeds `threshold` milliseconds.
 * Uses high-resolution timers where available (Node hrtime bigint / performance.now()).
 *
 * @param thresholdMs      Threshold in ms (default 100)
 * @param performanceHandler Optional callback (elapsedMs, methodName) when threshold exceeded.
 *
 * @code
 * class Work {
 *   @WarnPerformanceThreshold(5, (ms, name) => console.warn(`${name} ${ms.toFixed(2)}ms`))
 *   crunch(): number { let s = 0; for (let i=0;i<1e5;i++) s += i; return s; }
 * }
 * @endcode
 */
export function WarnPerformanceThreshold(
  thresholdMs: number = 100,
  performanceHandler?: (ms: number, methodName: string) => void
) {
  return function <This, Args extends unknown[], Return>(
    value: Method<This, Args, Return>,
    context: MethodContext<This, Args, Return>
  ): Method<This, Args, Return> {
    const name = String(context.name);

    const warn = (ms: number) => {
      if (ms > thresholdMs) {
        console.warn(`⚠️ [Performance] ${name} exceeded ${thresholdMs} ms (${ms.toFixed(2)} ms).`);
        performanceHandler?.(ms, name);
      }
    };

    return function (this: This, ...args: Args): Return {
      const start = getHighResolutionTime();
      try {
        const out = value.apply(this, args);
        if (out instanceof Promise) {
          return (async () => {
            const r = await out;
            const end = getHighResolutionTime();
            warn(calculateTimeInMilliseconds(start, end));
            return r;
          })() as unknown as Return;
        } else {
          const end = getHighResolutionTime();
          warn(calculateTimeInMilliseconds(start, end));
          return out;
        }
      } catch (e) {
        const end = getHighResolutionTime();
        warn(calculateTimeInMilliseconds(start, end));
        throw e;
      }
    };
  };
}
