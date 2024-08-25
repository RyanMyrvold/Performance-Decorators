/**
 * Decorator to log the return value of a method each time it is called.
 * Supports both synchronous and asynchronous methods.
 * @param logFn - An optional custom logging function that takes the return value and method name as parameters. Defaults to console.log.
 * @returns MethodDecorator
 */
function LogReturnValue(logFn: (value: any, methodName: string) => void = console.log) {
    /**
     * Logs the return value using the provided logging function or the default console.log.
     * @param returnValue - The value returned by the method.
     * @param methodName - The name of the method that returned the value.
     */
    function logReturnValue(returnValue: any, methodName: string): void {
      if (logFn) {
        logFn(returnValue, methodName);
      } else {
        console.log(`📝 [Log Return Value] ${methodName} returned:`, returnValue);
      }
    }
  
    return function (originalMethod: any, context: any) {
      if (typeof originalMethod !== "function") {
        throw new Error("🐞 [Log Return Value] Can only be applied to methods.");
      }
  
      return function (this: any, ...args: any[]) {
        try {
          const result = originalMethod.apply(this, args);
  
          if (result instanceof Promise) {
            return result.then((resolvedValue: any) => {
              logReturnValue(resolvedValue, context.name);
              return resolvedValue;
            }).catch((error: any) => {
              throw error; // Pass the error along the promise chain
            });
          } else {
            logReturnValue(result, context.name);
            return result;
          }
        } catch (error) {
          throw error; // Re-throw the error for synchronous methods
        }
      };
    };
  }
  
  export default LogReturnValue;
  