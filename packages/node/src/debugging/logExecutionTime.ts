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

function wrapWithTiming<T extends AnyFunction>(original: T, name: string | symbol | undefined): T {
  const label = `${String(name ?? 'anonymous')} execution`;

  const wrapped = function (this: ThisParameterType<T>, ...args: Parameters<T>): ReturnType<T> {
    console.time(label);

    try {
      const result = original.apply(this, args) as ReturnType<T>;

      if (isPromise(result)) {
        return result.finally(() => {
          console.timeEnd(label);
        }) as ReturnType<T>;
      }

      console.timeEnd(label);
      return result;
    } catch (error) {
      console.timeEnd(label);
      throw error;
    }
  } as unknown as T;

  return wrapped;
}

export function LogExecutionTime(): UniversalMethodDecorator {
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

      return wrapWithTiming(value, context.name);
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

      descriptor.value = wrapWithTiming(descriptor.value, propertyKey);
      return descriptor;
    }

    return undefined;
  }

  return decorator;
}
