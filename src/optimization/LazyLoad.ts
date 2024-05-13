/**
 * A property decorator that converts a class property into a lazily initialized property.
 * The property's initializer or getter function will not be called until the first time
 * the property is accessed, after which the computed value will replace the original
 * property definition.
 *
 * @returns PropertyDecorator
 */
// src/decorators/LazyLoad.ts
// src/decorators/LazyLoad.ts

// src/decorators/LazyLoad.ts
// src/decorators/LazyLoad.ts
function LazyLoad(): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    const initialValueSymbol = Symbol(`LazyLoad Initial Value: ${String(propertyKey)}`);
    let initialized = false;

    const originalDescriptor = Object.getOwnPropertyDescriptor(target, propertyKey) || {};
    const { enumerable = true, configurable = true } = originalDescriptor;

    if (originalDescriptor.value) {
      (target as any)[initialValueSymbol] = originalDescriptor.value;
    }

    const descriptor: PropertyDescriptor = {
      enumerable,
      configurable,

      get() {
        if (!initialized) {
          const value = (this as any)[initialValueSymbol];
          Object.defineProperty(this, propertyKey, {
            value,
            writable: true,
            enumerable,
            configurable
          });
          initialized = true;
          console.log(`🐞 [Lazy Load] Initializing property ${String(propertyKey)}.`);
        }
        return this[propertyKey as keyof PropertyDescriptor]; // Explicitly type propertyKey as keyof PropertyDescriptor.
      },

      set(newValue) {
        Object.defineProperty(this, propertyKey, {
            value: newValue,
            writable: true,
            enumerable,
            configurable
        });
        initialized = true;
      }
    };

    Object.defineProperty(target, propertyKey, descriptor);
  };
}

export default LazyLoad;
