/**
 * Serialize arguments to create a unique cache key for memoization.
 * @param args Arguments array from a function call.
 * @returns A string key representing the arguments.
 */
export function serializeArguments(args: any[]): string {
  try {
    return JSON.stringify(args, (_, value) =>
      typeof value === "function" ? `Function:${value.name}` : value
    );
  } catch (error) {
    throw new Error("Failed to serialize arguments for memoization.");
  }
}
