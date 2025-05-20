export function LogExecutionTime(): MethodDecorator {
  return (
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ): TypedPropertyDescriptor<any> | void => {
    if (!descriptor || typeof descriptor.value !== 'function') return;

    const originalMethod = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
      const label = `${String(propertyKey)} execution`;
      console.time(label);
      const result = originalMethod.apply(this, args);
      console.timeEnd(label);
      return result;
    };

    return descriptor;
  };
}
