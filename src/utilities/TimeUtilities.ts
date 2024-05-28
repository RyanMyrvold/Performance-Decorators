import { isBrowserEnvironment, isNodeEnvironment } from "./SystemUtilities";


/**
 * Gets the current high-resolution time based on the environment.
 * @returns The current high-resolution time in milliseconds or bigint.
 */
export function getHighResolutionTime(): number | bigint {
  if (isNodeEnvironment()) {
    return process.hrtime.bigint();
  } else if (isBrowserEnvironment()) {
    return performance.now();
  } else {
    throw new Error("High-resolution time is not supported in this environment.");
  }
}

/**
 * Converts high-resolution time to milliseconds.
 * @param start The start time.
 * @param end The end time.
 * @returns The time difference in milliseconds.
 */
export function calculateTimeInMilliseconds(start: number | bigint, end: number | bigint): number {
  if (isNodeEnvironment() && typeof start === 'bigint' && typeof end === 'bigint') {
    return Number(end - start) / 1000000;
  } else if (isBrowserEnvironment() && typeof start === 'number' && typeof end === 'number') {
    return end - start;
  } else {
    throw new Error("Unsupported environment or types for time calculation.");
  }
}