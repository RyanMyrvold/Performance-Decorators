import { Method, MethodContext } from '../types';

/**
 * Logs any error thrown/rejected by a method. Optionally rethrows.
 *
 * @param rethrow Whether to rethrow after logging (default true).
 * @param errorHandler Optional handler (err, methodName). Defaults to console.error.
 *
 * @code
 * class Service {
 *   @LogMethodError(true, (err, name) => console.error(`[${name}]`, err))
 *   risky(): void {
 *     throw new Error("boom");
 *   }
 * }
 * @endcode
 */
export function LogMethodError(rethrow: boolean = true, errorHandler?: (error: Error, methodName: string) => void) {
  const logAndNormalizeError = (thrownValue: unknown, methodName: string): Error => {
    const normalizedError = thrownValue instanceof Error ? thrownValue : new Error(`Non-Error exception: ${String(thrownValue)}`);
    try {
      if (errorHandler) errorHandler(normalizedError, methodName);
      else console.error(`${methodName}:`, normalizedError);
    } catch {
      // ignore handler failures
    }
    return normalizedError;
  };

  return function <This, Args extends unknown[], Return>(value: Method<This, Args, Return>, context: MethodContext<This, Args, Return>): Method<This, Args, Return> {
    const methodName = String(context.name);

    return function (this: This, ...args: Args): Return {
      try {
        const result = value.apply(this, args);
        if (result instanceof Promise) {
          return (result as Promise<unknown>).catch((thrownError) => {
            const normalizedError = logAndNormalizeError(thrownError, methodName);
            if (rethrow) throw normalizedError;
            return undefined as unknown as Return;
          }) as Return;
        }
        return result;
      } catch (thrownError) {
        const normalizedError = logAndNormalizeError(thrownError, methodName);
        if (rethrow) throw normalizedError;
        return undefined as unknown as Return;
      }
    };
  };
}
