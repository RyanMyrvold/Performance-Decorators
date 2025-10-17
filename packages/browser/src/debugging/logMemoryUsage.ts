/**
 * Logs an approximation of memory usage using `performance.memory` (Chrome-only).
 * Falls back to timing log if unavailable.
 *
 * @returns A method decorator that logs memory or fallback performance.
 */
type AnyFunction = (...args: unknown[]) => unknown;

type Stage3DecoratorContext<T extends AnyFunction> = {
  kind: 'method';
  name?: string | symbol;
} & Record<string, unknown>;

interface UniversalMethodDecorator {
  <T extends AnyFunction>(value: T, context: Stage3DecoratorContext<T>): T | void;
  <T extends AnyFunction>(
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> | void;
}

const isPromise = (value: unknown): value is Promise<unknown> =>
  typeof value === 'object' && value !== null && typeof (value as PromiseLike<unknown>).then === 'function';

function wrapWithMemoryLogging<T extends AnyFunction>(original: T, name: string | symbol | undefined): T {
  const label = String(name ?? 'anonymous');

  const wrapped = function (this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> {
    const perf = performance as Performance & { memory?: { usedJSHeapSize: number } };
    const start = perf.memory?.usedJSHeapSize ?? perf.now();

    const logUsage = () => {
      const end = perf.memory?.usedJSHeapSize ?? perf.now();
      const message = perf.memory
        ? `[${label}] JS Heap used: ${((end - start) / 1024 / 1024).toFixed(2)} MB`
        : `[${label}] Time elapsed: ${(end - start).toFixed(2)} ms`;

      console.log(message);
    };

    try {
      const result = original.apply(this, args) as ReturnType<T>;

      if (isPromise(result)) {
        return result
          .finally(() => {
            logUsage();
          }) as ReturnType<T>;
      }

      logUsage();
      return result;
    } catch (error) {
      logUsage();
      throw error;
    }
  } as unknown as T;

  return wrapped;
}

export function LogMemoryUsage(): UniversalMethodDecorator {
  function decorator<T extends AnyFunction>(value: T, context: Stage3DecoratorContext<T>): T | void;
  function decorator<T extends AnyFunction>(
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> | void;
  function decorator<T extends AnyFunction>(...args: unknown[]): unknown {
    if (args.length === 2 && typeof args[0] === 'function') {
      const [value, context] = args as [T, Stage3DecoratorContext<T>];

      if (context.kind !== 'method') {
        return value;
      }

      return wrapWithMemoryLogging(value, context.name);
    }

    if (args.length === 3) {
      const [, propertyKey, descriptor] = args as [
        object,
        string | symbol,
        TypedPropertyDescriptor<T>
      ];

      if (!descriptor || typeof descriptor.value !== 'function') {
        return descriptor;
      }

      descriptor.value = wrapWithMemoryLogging(descriptor.value, propertyKey);
      return descriptor;
    }

    return undefined;
  }

  return decorator;
}
