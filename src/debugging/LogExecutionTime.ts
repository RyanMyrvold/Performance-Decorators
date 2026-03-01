import { Method, MethodContext } from '../types';
import { calculateTimeInMilliseconds, getHighResolutionTime } from '../utilities/TimeUtilities';

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
export function LogExecutionTime(handler?: (elapsedMilliseconds: number, methodName: string) => void) {
  return function <This, Args extends unknown[], Return>(value: Method<This, Args, Return>, context: MethodContext<This, Args, Return>): Method<This, Args, Return> {
    const methodName = String(context.name);

    return function (this: This, ...args: Args): Return {
      let startTime: number | bigint;
      try {
        startTime = getHighResolutionTime();
      } catch {
        return value.apply(this, args);
      }

      try {
        const result = value.apply(this, args);
        const isThenable = result && typeof (result as any).then === 'function';
        if (isThenable) {
          return (async () => {
            try {
              const resolvedValue = await (result as unknown as Promise<unknown>);
              const endTime = getHighResolutionTime();
              handler?.(calculateTimeInMilliseconds(startTime, endTime), methodName);
              return resolvedValue as Return;
            } catch (thrownError) {
              const endTime = getHighResolutionTime();
              handler?.(calculateTimeInMilliseconds(startTime, endTime), methodName);
              throw thrownError;
            }
          })() as unknown as Return;
        } else {
          const endTime = getHighResolutionTime();
          handler?.(calculateTimeInMilliseconds(startTime, endTime), methodName);
          return result;
        }
      } catch (thrownError) {
        const endTime = getHighResolutionTime();
        handler?.(calculateTimeInMilliseconds(startTime, endTime), methodName);
        throw thrownError;
      }
    };
  };
}
