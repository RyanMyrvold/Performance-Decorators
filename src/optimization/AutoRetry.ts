/**
 * A decorator that automatically retries a function if it throws an error.
 * This decorator can be applied to methods in classes, allowing for the automatic
 * retrying of those methods in case of failure, with a specified number of retries
 * and delay between attempts.
 *
 * @param {number} retries - The maximum number of retry attempts. Default is 3.
 * @param {number} delay - The delay in milliseconds between each retry attempt. Default is 500ms.
 * @throws {Error} Throws an error if the `retries` or `delay` parameters are negative.
 * @throws {Error} Throws an error if applied to a non-method property.
 *
 * @example
 * class ApiService {
 *   @AutoRetry(5, 1000)
 *   async fetchData() {
 *     // Code that might throw an error
 *   }
 * }
 *
 * // This will automatically retry up to 5 times with a 1-second delay between attempts.
 */
export function AutoRetry(retries: number = 3, delay: number = 500) {
  // Ensure retries and delay are non-negative
  if (retries < 0 || delay < 0) {
    throw new Error("🚨 [Auto Retry] Retries and delay must be non-negative.");
  }

  /**
   * The method decorator that wraps the original method with retry logic.
   *
   * @param {(...args: any[]) => Promise<any>} originalMethod - The original method to be decorated.
   * @param {ClassMethodDecoratorContext} context - The context of the method in the class.
   * @returns {Function} A new function that wraps the original method with retry logic.
   * @throws {Error} Throws an error if applied to a non-function property.
   */
  return function (originalMethod: (...args: any[]) => Promise<any>, context: ClassMethodDecoratorContext) {
    // Ensure the decorator is applied to a method
    if (typeof originalMethod !== "function") {
      throw new Error("🐞 [Auto Retry] Can only be applied to methods.");
    }

    // Return an asynchronous function that handles retry logic
    return async function (this: any, ...args: any[]) {
      /**
       * A recursive function that handles the retry logic.
       *
       * @param {number} attempt - The current attempt count.
       * @returns {Promise<any>} The result of the original method or throws an error after exceeding retries.
       * @throws {Error} Throws an error after exceeding the maximum number of retries.
       */
      const retry = async (attempt: number): Promise<any> => {
        try {
          // Attempt to execute the original method
          return await originalMethod.apply(this, args);
        } catch (error: unknown) {
          // If an error occurs and retries are left, wait and retry
          if (attempt < retries) {
            await new Promise((resolve) => setTimeout(resolve, delay));
            return retry(attempt + 1);
          } else {
            // If retries are exhausted, throw an error with details
            const errorMessage = (error instanceof Error) ? error.message : String(error);
            throw new Error(`🚨 [Auto Retry] Failed after ${retries} retries: ${errorMessage}`);
          }
        }
      };

      // Start the retry logic with the first attempt
      return retry(0);
    };
  };
}
