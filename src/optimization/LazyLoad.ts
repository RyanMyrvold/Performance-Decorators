/**
 * Interface for options that can be passed to the LazyLoad decorator.
 */
export interface LazyLoadOptions {
  /**
   * A function to be called when the property is first accessed and initialized.
   */
  onInitialization?: (propertyName: string) => void;
  /**
   * A function to be called when the property is set with a new value.
   */
  onSetValue?: (propertyName: string, newValue: any) => void;
}

/**
 * A property decorator that converts a class property into a lazily initialized property.
 * The property's initializer or getter function will not be called until the first time
 * the property is accessed, after which the computed value will replace the original
 * property definition.
 *
 * @param options Optional configuration options for the LazyLoad decorator.
 * @returns PropertyDecorator
 */
export function LazyLoad(options?: LazyLoadOptions): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    let value: any = (target as any)[propertyKey];
    let initialized = false;

    console.log(`🐞 [Lazy Load] Decorator initialized for property ${String(propertyKey)}`);
    console.log(`🐞 [Lazy Load] Captured initial value for property ${String(propertyKey)}: ${value}`);

    Object.defineProperty(target, propertyKey, {
      configurable: true,
      enumerable: true,
      get() {
        console.log(`🐞 [Lazy Load] Getter called for property ${String(propertyKey)}`);
        if (!initialized) {
          console.log(`🐞 [Lazy Load] Property ${String(propertyKey)} not initialized yet`);
          console.log(`🐞 [Lazy Load] Initializing property ${String(propertyKey)}`);
          initialized = true;
          if (options?.onInitialization) {
            console.log(`🐞 [Lazy Load] About to call onInitialization for property ${String(propertyKey)}`);
            options.onInitialization(String(propertyKey));
            console.log(`🐞 [Lazy Load] Called onInitialization for property ${String(propertyKey)}`);
          }
          console.log(`🐞 [Lazy Load] Property ${String(propertyKey)} initialized with value: ${value}`);
        }
        console.log(`🐞 [Lazy Load] Getter returning value: ${value}`);
        return value;
      },
      set(newValue) {
        console.log(`🐞 [Lazy Load] Setter called for property ${String(propertyKey)} with value ${newValue}`);
        value = newValue;
        if (initialized && options?.onSetValue) {
          console.log(`🐞 [Lazy Load] About to call onSetValue for property ${String(propertyKey)}`);
          options.onSetValue(String(propertyKey), newValue);
          console.log(`🐞 [Lazy Load] Called onSetValue for property ${String(propertyKey)}`);
        }
        if (!initialized) {
          console.log(`🐞 [Lazy Load] Property ${String(propertyKey)} set without initialization`);
          initialized = true;
        }
        console.log(`🐞 [Lazy Load] Setter updated value to: ${value}`);
      }
    });
  };
}

export default LazyLoad;
