/**
 * Determines if the current runtime environment is Node.js based on the presence of process and hrtime.
 * @returns True if the current environment is Node.js, otherwise false.
 */
export function isNodeEnvironment(): boolean {
  return (
    typeof process !== "undefined" &&
    typeof process.hrtime === "function" &&
    typeof process.hrtime.bigint === "function"
  );
}

/**
 * Determines if the current runtime environment is a browser based on the presence of the performance API.
 * @returns True if the current environment is a browser, otherwise false.
 */
export function isBrowserEnvironment(): boolean {
  return (
    typeof performance !== "undefined" && typeof performance.now === "function"
  );
}

/**
 * Gets the current high-resolution time based on the environment.
 * @returns The current high-resolution time in milliseconds.
 */
export function getHighResolutionTime(): number | bigint {
  if (isNodeEnvironment()) {
    return process.hrtime.bigint();
  } else if (isBrowserEnvironment()) {
    return performance.now();
  } else {
    throw new Error(
      "High-resolution time is not supported in this environment."
    );
  }
}

/**
 * Converts high-resolution time to milliseconds.
 * @param start The start time.
 * @param end The end time.
 * @returns The time difference in milliseconds.
 */
export function calculateTimeInMilliseconds(
  start: number | bigint,
  end: number | bigint
): number {
  if (isNodeEnvironment()) {
    // Both start and end are bigint in Node.js
    return Number(BigInt(end) - BigInt(start)) / 1_000_000; // Convert start and end to bigint
  } else {
    // Both start and end are numbers in browsers
    return (end as number) - (start as number);
  }
}

/**
 * Gets the memory usage based on the environment.
 * @returns The current memory usage in bytes, or undefined if not supported.
 */
export function getMemoryUsage(): number | undefined {
  if (isNodeEnvironment()) {
    return process.memoryUsage().heapUsed;
  } else if (isBrowserEnvironment()) {
    return performance.memory?.usedJSHeapSize;
  }
  return undefined;
}
