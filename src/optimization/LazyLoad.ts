/**
 * Decorator to make a class property lazily initialized. The property's getter is
 * only invoked on the first access, with the result cached for subsequent accesses.
 *
 * @param options Optional configuration for the LazyLoad behavior.
 */
export function LazyLoad() {
  return function (originalMethod: Function, context: ClassMethodDecoratorContext) {
      const methodName = context.name;
      const symbol = Symbol(`__${String(methodName)}__lazy`);

      return function (this: any, ...args: any[]) {
          if (!this[symbol]) {
              this[symbol] = originalMethod.apply(this, args);
          }
          return this[symbol];
      }
  }
}
