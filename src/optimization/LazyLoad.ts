/**
 * A property decorator that converts a class property into a lazily initialized property.
 * The property's initializer or getter function will not be called until the first time
 * the property is accessed, after which the computed value will replace the original
 * property definition.
 *
 * @returns PropertyDecorator
 */
function LazyLoad(): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    const originalDescriptor = Object.getOwnPropertyDescriptor(
      target,
      propertyKey
    );

    // If there's no descriptor, the property might not be correctly defined or might be a method.
    if (!originalDescriptor) {
      throw new Error(
        `🐞 [Lazy Load] Failed to find a property descriptor for ${String(
          propertyKey
        )}. Ensure LazyLoad is applied to a proper class property.`
      );
    }

    let _value: any;
    let _initialized = false;

    const newDescriptor: PropertyDescriptor = {
      get() {
        if (!_initialized) {
          // Initialize the value only if accessed to simulate lazy behavior
          _value = originalDescriptor.value;
          console.log(
            `🐞 [Lazy Load] Lazily initializing property ${String(propertyKey)}.`
          );
          _initialized = true;
        }
        return _value;
      },
      set(newValue: any) {
        console.log(`🐞 [Lazy Load] Setting value for ${String(propertyKey)}.`);
        _value = newValue;
        _initialized = true;
      },
      enumerable: originalDescriptor.enumerable ?? true,
      configurable: originalDescriptor.configurable ?? true,
    };

    Object.defineProperty(target, propertyKey, newDescriptor);
  };
}

export default LazyLoad;
