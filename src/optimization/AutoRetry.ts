// decorators/AutoRetry.ts




function AutoRetry(retries: number = 3, delay: number = 500) {
  if (retries < 0 || delay < 0) {
    throw new Error("🚨 [Auto Retry] Retries and delay must be non-negative.");
  }

  return function (originalMethod: Method, context: ClassMethodDecoratorContext) {
    if (typeof originalMethod !== "function") {
      throw new Error("🐞 [Auto Retry] Can only be applied to methods.");
    }

    return async function (this: any, ...args: any[]) {
      const retry = async (attempt: number): Promise<any> => {
        try {
          return await originalMethod.apply(this, args);
        } catch (error: unknown) {
          if (attempt < retries) {
            await new Promise((resolve) => setTimeout(resolve, delay));
            return retry(attempt + 1);
          } else {
            const errorMessage = (error instanceof Error) ? error.message : String(error);
            throw new Error(`🚨 [Auto Retry] Failed after ${retries} retries: ${errorMessage}`);
          }
        }
      };

      return retry(0);
    };
  };
}

export default AutoRetry;
