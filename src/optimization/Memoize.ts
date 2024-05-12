import { serializeArguments } from "../utilities/FunctionUtilities";

/**
 * Method decorator to cache results of expensive function calls based on arguments.
 * Useful for optimizing performance of deterministic functions by storing previous results.
 *
 * @returns MethodDecorator
 */
function Memoize(): MethodDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    // Validate that this decorator is applied to a method
    if (typeof descriptor.value !== "function") {
      throw new Error(
        "🐞 [Memoize] Can only be applied to method declarations."
      );
    }

    const originalMethod = descriptor.value;
    const cache = new Map<string, any>();

    descriptor.value = function (...args: any[]) {
      // Serialize arguments to use as a cache key
      const cacheKey = serializeArguments(args);

      if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
      }

      // Compute the result and cache it
      const result = originalMethod.apply(this, args);
      cache.set(cacheKey, result);
      return result;
    };

    return descriptor;
  };
}

export default Memoize;
