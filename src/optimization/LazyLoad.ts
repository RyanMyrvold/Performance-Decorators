import { GetterContext, Method, MethodContext } from '../types';

/**
 * Lazily computes a value on first access and caches it for subsequent accesses.
 *
 * Supports:
 * - Decorating a **getter**: cache the computed value the first time it’s read.
 * - Decorating a **zero-argument method**: treat it like a property initializer and cache the first result.
 *
 * Notes:
 * - Async results are cached as-is (Promise is stored and returned).
 * - For argument-dependent caching, prefer a memoization decorator keyed by args.
 *
 * @example
 * class ConfigService {
 *   @LazyLoad()
 *   get expensiveConfig(): Record<string, unknown> {
 *     // heavy work
 *     return { ok: true };
 *   }
 *
 *   @LazyLoad()
 *   buildOnce(): Promise<string> {
 *     return new Promise((r) => setTimeout(() => r("ready"), 10));
 *   }
 * }
 */
export function LazyLoad() {
  return function <This, Value>(value: (this: This) => Value, context: GetterContext<This, Value> | MethodContext<This, [], Value>): (this: This) => Value {
    const methodName = String(context.name);
    const cachedValueSlot = Symbol(`[[lazy:${methodName}]]`);

    if (context.kind === 'getter') {
      const getterFn = value as (this: This) => Value;
      return function (this: This): Value {
        const instance = this as unknown as Record<string | symbol, unknown>;
        if (!(cachedValueSlot in instance)) {
          instance[cachedValueSlot] = getterFn.call(this);
        }
        return instance[cachedValueSlot] as Value;
      };
    }

    if (context.kind === 'method') {
      const methodFn = value as Method<This, [], Value>;
      return function (this: This): Value {
        const instance = this as unknown as Record<string | symbol, unknown>;
        if (!(cachedValueSlot in instance)) {
          instance[cachedValueSlot] = methodFn.call(this);
        }
        return instance[cachedValueSlot] as Value;
      };
    }

    throw new Error(`LazyLoad can only decorate a getter or a zero-argument method: ${methodName}`);
  };
}
