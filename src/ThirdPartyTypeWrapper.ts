/**
 * Provides a type-safe wrapper for third-party libraries.
 */
export class ThirdPartyTypeWrapper {

  /**
   * Wraps a library with a type-safe proxy.
   * @param lib - The third-party library.
   * @returns Type-safe proxy around the library.
   * @throws Error if access to a property is not allowed for type safety.
   */
  public static wrapWithProxy(lib: any): any {
    return new Proxy(lib, {
      get(target, prop, receiver) {
        if (prop in target) {
          return Reflect.get(target, prop, receiver);
        } else {
          throw new Error(`Access to property ${String(prop)} is not allowed for type safety.`);
        }
      },
      set(target, prop, value) {
        if (prop in target) {
          return Reflect.set(target, prop, value);
        } else {
          throw new Error(`Setting new property ${String(prop)} is not allowed for type safety.`);
        }
      },
      deleteProperty(target, property) {
        throw new Error(`Cannot delete property ${property.toString()} from the wrapped library.`);
      },
    });
  }
}