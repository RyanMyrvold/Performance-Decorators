// src/debugging/LogMethodError.ts
import { Method, MethodContext } from "../types";

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
export function LogMethodError(
  rethrow: boolean = true,
  errorHandler?: (error: Error, methodName: string) => void
) {
  const emit = (raw: unknown, name: string): Error => {
    const err = raw instanceof Error ? raw : new Error(`Non-Error exception: ${String(raw)}`);
    try {
      if (errorHandler) errorHandler(err, name);
      else // eslint-disable-next-line no-console
        console.error(`🚨 [Error] ${name}:`, err);
    } catch {/* ignore handler failures */}
    return err;
  };

  return function <
    This,
    Args extends unknown[],
    Return
  >(
    value: Method<This, Args, Return>,
    context: MethodContext<This, Args, Return>
  ): Method<This, Args, Return> {
    const methodName = String(context.name);

    return function (this: This, ...args: Args): Return {
      try {
        const out = value.apply(this, args);
        if (out instanceof Promise) {
          return (out as Promise<unknown>)
            .catch((e) => {
              const err = emit(e, methodName);
              if (rethrow) throw err;
              // swallow by resolving to undefined
              return undefined as unknown as Return;
            }) as Return;
        }
        return out;
      } catch (e) {
        const err = emit(e, methodName);
        if (rethrow) throw err;
        return undefined as unknown as Return;
      }
    };
  };
}
