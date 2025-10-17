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

export function Debounce(): UniversalMethodDecorator {
  function decorator<T extends AnyFunction>(value: T, _context: Stage3DecoratorContext<T>): T | void;
  function decorator<T extends AnyFunction>(
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> | void;
  function decorator<T extends AnyFunction>(...args: unknown[]): unknown {
    if (args.length === 2 && typeof args[0] === 'function') {
      const [value] = args as [T, Stage3DecoratorContext<T>];
      return value;
    }

    if (args.length === 3) {
      const [, , descriptor] = args as [
        object,
        string | symbol,
        TypedPropertyDescriptor<T>
      ];

      return descriptor;
    }

    return undefined;
  }

  return decorator;
}
