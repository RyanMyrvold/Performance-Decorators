import { Method, MethodContext } from '../types';
import { calculateTimeInMilliseconds, getHighResolutionTime } from '../utilities/TimeUtilities';

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
export function WarnPerformanceThreshold(thresholdMs: number = 100, performanceHandler?: (ms: number, methodName: string) => void) {
  return function <This, Args extends unknown[], Return>(value: Method<This, Args, Return>, context: MethodContext<This, Args, Return>): Method<This, Args, Return> {
    const methodName = String(context.name);

    const warnIfThresholdExceeded = (elapsedMs: number) => {
      if (elapsedMs > thresholdMs) {
        console.warn(`${methodName} exceeded ${thresholdMs} ms (${elapsedMs.toFixed(2)} ms).`);
        performanceHandler?.(elapsedMs, methodName);
      }
    };

    return function (this: This, ...args: Args): Return {
      const startTime = getHighResolutionTime();
      try {
        const result = value.apply(this, args);
        const isThenable = result && typeof (result as any).then === 'function';
        if (isThenable) {
          return (async () => {
            const resolvedValue = await (result as unknown as Promise<unknown>);
            const endTime = getHighResolutionTime();
            warnIfThresholdExceeded(calculateTimeInMilliseconds(startTime, endTime));
            return resolvedValue as Return;
          })() as unknown as Return;
        } else {
          const endTime = getHighResolutionTime();
          warnIfThresholdExceeded(calculateTimeInMilliseconds(startTime, endTime));
          return result;
        }
      } catch (thrownError) {
        const endTime = getHighResolutionTime();
        warnIfThresholdExceeded(calculateTimeInMilliseconds(startTime, endTime));
        throw thrownError;
      }
    };
  };
}
