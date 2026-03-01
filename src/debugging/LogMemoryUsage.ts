import { Method, MethodContext } from '../types';
import { getMemoryUsage } from '../utilities/MemoryUtilities';

/**
 * Logs memory delta (bytes) before/after a method call.
 * Works with sync and async methods; never throws from logging path.
 *
 * @param memoryHandler Optional callback (deltaBytes, methodName).
 *
 * @code
 * class Repo {
 *   @LogMemoryUsage((delta, name) => console.debug(`[${name}] Δ${delta}B`))
 *   compute(): Uint8Array {
 *     return new Uint8Array(1024 * 256);
 *   }
 * }
 * @endcode
 */
export function LogMemoryUsage(memoryHandler?: (deltaBytes: number, methodName: string) => void) {
  return function <This, Args extends unknown[], Return>(value: Method<This, Args, Return>, context: MethodContext<This, Args, Return>): Method<This, Args, Return> {
    const methodName = String(context.name);

    const safeReadMemoryUsage = (): number | undefined => {
      try {
        return getMemoryUsage();
      } catch {
        return undefined;
      }
    };

    const recordMemoryDelta = (initialMemory?: number) => {
      try {
        const finalMemory = safeReadMemoryUsage();
        if (initialMemory === undefined || finalMemory === undefined) return;
        const memoryDelta = finalMemory - initialMemory;
        console.log(`${methodName}: Δ ${memoryDelta} bytes`);
        memoryHandler?.(memoryDelta, methodName);
      } catch {
        // swallow
      }
    };

    return function (this: This, ...args: Args): Return {
      const initialMemory = safeReadMemoryUsage();

      try {
        const result = value.apply(this, args);
        const isThenable = result && typeof (result as any).then === 'function';
        if (isThenable) {
          return (result as unknown as Promise<unknown>)
            .then((resolvedValue) => {
              recordMemoryDelta(initialMemory);
              return resolvedValue as Return;
            })
            .catch((thrownError) => {
              recordMemoryDelta(initialMemory);
              throw thrownError;
            }) as Return;
        }
        recordMemoryDelta(initialMemory);
        return result;
      } catch (thrownError) {
        recordMemoryDelta(initialMemory);
        throw thrownError;
      }
    };
  };
}
