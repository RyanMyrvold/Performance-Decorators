import { isBrowserEnvironment, isNodeEnvironment } from "./SystemUtilities";


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
