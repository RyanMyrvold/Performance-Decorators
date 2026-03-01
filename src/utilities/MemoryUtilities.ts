import { isBrowserEnvironment, isNodeEnvironment } from './SystemUtilities';

/**
 * Extends the Performance interface to include the memory property.
 */
export interface PerformanceWithMemory extends Performance {
  memory?: {
    usedJSHeapSize: number;
  };
}

/**
 * Gets the memory usage based on the environment.
 * @returns The current memory usage in bytes, or undefined if not supported.
 */
export function getMemoryUsage(): number | undefined {
  if (isNodeEnvironment()) {
    return process.memoryUsage().heapUsed;
  } else if (isBrowserEnvironment()) {
    const performanceWithMemory = performance as PerformanceWithMemory;
    if (performanceWithMemory.memory) {
      return performanceWithMemory.memory.usedJSHeapSize;
    }
  }
  return undefined;
}
