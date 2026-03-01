import { Method, MethodContext } from '../types';

/**
 * Retries an async method when it rejects/throws, up to `retries` times,
 * waiting `delay` ms between attempts (fixed backoff).
 *
 * @param retries Non-negative number of additional attempts (default: 3)
 * @param delay   Non-negative delay in ms between attempts (default: 500)
 *
 * @example
 * class ApiService {
 *   @AutoRetry(5, 1000)
 *   async fetchData(): Promise<string> {
 *     const res = await fetch("/data");
 *     if (!res.ok) throw new Error(`HTTP ${res.status}`);
 *     return res.text();
 *   }
 * }
 */
export function AutoRetry(retries: number = 3, delay: number = 500) {
  if (retries < 0 || delay < 0) {
    throw new Error('AutoRetry: retries and delay must be non-negative.');
  }

  const delayMs = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

  return function <This, Args extends unknown[], Return>(value: Method<This, Args, Return | Promise<Return>>, _context: MethodContext<This, Args, Return | Promise<Return>>): Method<This, Args, Promise<Return>> {
    return async function (this: This, ...args: Args): Promise<Return> {
      let attemptNumber = 0;
      while (true) {
        try {
          return await Promise.resolve(value.apply(this, args));
        } catch (thrownError) {
          if (attemptNumber >= retries) {
            const errorMessage = thrownError instanceof Error ? thrownError.message : String(thrownError);
            throw new Error(`AutoRetry failed after ${retries} attempts: ${errorMessage}`);
          }
          attemptNumber++;
          if (delay > 0) await delayMs(delay);
        }
      }
    };
  };
}
