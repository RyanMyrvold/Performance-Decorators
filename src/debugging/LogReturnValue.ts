import { Method, MethodContext } from '../types';

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
export function LogReturnValue(logFn: (returnedValue: unknown, methodName: string) => void = console.log) {
  return function <This, Args extends unknown[], Return>(value: Method<This, Args, Return>, context: MethodContext<This, Args, Return>): Method<This, Args, Return> {
    const methodName = String(context.name);

    return function (this: This, ...args: Args): Return {
      try {
        const result = value.apply(this, args);
        const isThenable = result && typeof (result as any).then === 'function';
        if (isThenable) {
          return (async () => {
            const resolvedValue = await (result as unknown as Promise<unknown>);
            logFn(resolvedValue, methodName);
            return resolvedValue as Return;
          })() as unknown as Return;
        } else {
          logFn(result, methodName);
          return result;
        }
      } catch (thrownError) {
        throw thrownError;
      }
    };
  };
}
