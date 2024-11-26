/**
 * Decorator to log any errors that occur during the method execution. Optionally re-throws the error based on a parameter.
 * @param rethrow - A boolean to determine whether to rethrow the error after logging. Defaults to true.
 * @param errorHandler - An optional custom error handler function that takes the error and method name as parameters.
 * @returns MethodDecorator
 */
export function LogMethodError(rethrow: boolean = true, errorHandler?: (error: Error, methodName: string) => void) {
  /**
   * Logs the given error using the provided error handler or console.
   * @param error - The error to log.
   * @param methodName - The name of the method in which the error occurred.
   * @returns The error after potentially converting it to an Error instance.
   */
  function logError(error: any, methodName: string): Error {
    // Convert non-Error exceptions to Error instances
    const errorToLog = error instanceof Error ? error : new Error(`Non-Error exception: ${error}`);

    // Use custom error handler if provided, otherwise log to console
    if (errorHandler) {
      errorHandler(errorToLog, methodName);
    } else {
      console.error(`🚨 [Error] ${methodName} encountered an error:`, errorToLog);
    }

    return errorToLog;
  }

  return function (originalMethod: any, context: any) {
    if (typeof originalMethod !== "function") {
      throw new Error("🐞 [Error] Can only be applied to methods.");
    }

    return function (this: any, ...args: any[]) {
      try {
        return originalMethod.apply(this, args);
      } catch (error) {
        const methodName = typeof context.name === 'symbol' ? String(context.name) : context.name;
        const errorToRethrow = logError(error, methodName);

        // Rethrow the error if the rethrow flag is true
        if (rethrow) {
          throw errorToRethrow;
        }
      }
    };
  };
}
