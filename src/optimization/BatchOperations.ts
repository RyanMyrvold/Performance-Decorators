/**
 * Method decorator to batch multiple synchronous calls into a single asynchronous operation.
 * This can be particularly useful for operations like rendering or updating the UI, where
 * you want to avoid doing work that may be redundant due to frequent or repeated calls.
 *
 * @returns MethodDecorator
 */
function BatchOperations(): MethodDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    if (typeof descriptor.value !== "function") {
      throw new Error(
        "🐞 [Batch Operations] Can only be applied to method declarations."
      );
    }

    const originalMethod = descriptor.value;
    let scheduled = false;
    let calls: any[][] = [];

    descriptor.value = function (...args: any[]) {
      calls.push(args);

      if (!scheduled) {
        scheduled = true;
        Promise.resolve().then(() => {
          originalMethod.apply(this, [calls.flat()]);
          scheduled = false;
          calls = [];
        }).catch((error) => {
          console.error(
            `🚨 [Batch Operations] Failed to execute batched operations for ${String(
              propertyKey
            )}: ${error}`
          );
        });
      }
    };

    return descriptor;
  };
}

export default BatchOperations;
