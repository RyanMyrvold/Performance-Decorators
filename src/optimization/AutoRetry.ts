/**
 * Automatically retries a failed asynchronous operation until it succeeds or reaches
 * the maximum number of retries. Useful for operations that may fail due to temporary
 * issues such as network connectivity.
 *
 * @param retries - Maximum number of retries.
 * @param delay - Delay in milliseconds between retries.
 * @returns - Method decorator that applies the retry logic.
 */
function AutoRetry(retries: number = 3, delay: number = 500): MethodDecorator {
  if (retries < 0 || delay < 0) {
    throw new Error(
      "🚨 [Auto Retry] The number of retries and delay must be non-negative."
    );
  }

  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    const originalMethod = descriptor.value;
    if (typeof originalMethod !== "function") {
      throw new Error("🐞 [Auto Retry] Can only be applied to methods.");
    }

    descriptor.value = async function (...args: any[]) {
      const context = this;

      const retry = async (attempt: number): Promise<any> => {
        try {
          return await originalMethod.apply(context, args);
        } catch (error) {
          if (attempt < retries) {
            console.warn(
              `🚨 [Auto Retry] Attempt ${attempt + 1} for ${String(
                propertyKey
              )} failed: ${error}. Retrying after ${delay}ms...`
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
            return retry(attempt + 1);
          } else {
            throw new Error(
              `🚨 [Auto Retry] Failed after ${retries} retries: ${error}`
            );
          }
        }
      };

      return retry(0);
    };

    return descriptor;
  };
}

export default AutoRetry;
