// src/debugging/LogReturnValue.ts
import { Method, MethodContext } from "../types";

/**
 * Logs the method's returned value (sync or async).
 *
 * @param logFn Optional logger (value, methodName). Defaults to console.log.
 *
 * @code
 * class Calc {
 *   @LogReturnValue((v, n) => console.debug(`[${n}] ->`, v))
 *   sum(a: number, b: number) { return a + b; }
 * }
 * @endcode
 */
export function LogReturnValue(
  logFn: (value: unknown, methodName: string) => void = console.log
) {
  return function <This, Args extends unknown[], Return>(
    value: Method<This, Args, Return>,
    context: MethodContext<This, Args, Return>
  ): Method<This, Args, Return> {
    const name = String(context.name);

    return function (this: This, ...args: Args): Return {
      try {
        const out = value.apply(this, args);
        if (out instanceof Promise) {
          return (async () => {
            const r = await out;
            logFn(r, name);
            return r;
          })() as unknown as Return;
        } else {
          logFn(out, name);
          return out;
        }
      } catch (e) {
        // pass through; this decorator only logs returns
        throw e;
      }
    };
  };
}
