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
export function LazyLoad<T>(options?: LazyLoadOptions<T>): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol) => {
    let value: T | undefined;
    let initialized = false;

    Object.defineProperty(target, propertyKey, {
      configurable: true,
      enumerable: true,

      get(): T {
        if (!initialized) {
          value = (target as any)[propertyKey];
          initialized = true;
          if (options?.onInitialization) {
            options.onInitialization(String(propertyKey), value);
          }
        }
        return value as T;
      },

      set(newValue: T) {
        value = newValue;
        if (initialized) {
          if (options?.onSetValue) {
            options.onSetValue(String(propertyKey), newValue);
          }
        } else {
          initialized = true;
          if (options?.onInitialization) {
            options.onInitialization(String(propertyKey), newValue);
          }
        }
      }
    });
  };
}

export default LazyLoad;
