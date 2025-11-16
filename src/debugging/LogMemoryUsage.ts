// src/debugging/LogMemoryUsage.ts
import { Method, MethodContext } from "../types";
import { getMemoryUsage } from "../utilities/MemoryUtilities";

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
export function LogMemoryUsage(
  memoryHandler?: (deltaBytes: number, methodName: string) => void
) {
  return function <
    This,
    Args extends unknown[],
    Return
  >(
    value: Method<This, Args, Return>,
    context: MethodContext<This, Args, Return>
  ): Method<This, Args, Return> {
    const methodName = String(context.name);

    const safeGet = (): number | undefined => {
      try { return getMemoryUsage(); } catch { return undefined; }
    };

    const finalize = (before?: number) => {
      try {
        const after = safeGet();
        if (before === undefined || after === undefined) return;
        const delta = after - before;
        // Optional: keep a default console line for quick use
        // eslint-disable-next-line no-console
        console.log(`🧠 [Memory] ${methodName}: Δ=${delta} bytes`);
        memoryHandler?.(delta, methodName);
      } catch {/* ignore */}
    };

    return function (this: This, ...args: Args): Return {
      const before = safeGet();

      try {
        const out = value.apply(this, args);
        if (out instanceof Promise) {
          return (out as Promise<unknown>)
            .then((r) => { finalize(before); return r as Return; })
            .catch((e) => { finalize(before); throw e; }) as Return;
        }
        finalize(before);
        return out;
      } catch (err) {
        finalize(before);
        throw err;
      }
    };
  };
}
