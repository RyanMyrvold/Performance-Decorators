/**
 * Options for customizing the LazyLoad decorator's behavior.
 */
export interface LazyLoadOptions<T> {
  /**
   * Called when the property is first accessed (initialized).
   * Receives the property name and the computed value.
   */
  onInitialization?: (propertyName: string, value: T | undefined) => void;

  /**
   * Called when the property's value is changed (after initialization).
   * Receives the property name and the new value.
   */
  onSetValue?: (propertyName: string, newValue: T) => void;
}

/**
 * Decorator to make a class property lazily initialized. The property's getter is 
 * only invoked on the first access, with the result cached for subsequent accesses.
 * 
 * @param options Optional configuration for the LazyLoad behavior.
 */
function LazyLoad() {
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

export default LazyLoad;
