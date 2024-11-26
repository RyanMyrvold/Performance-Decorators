/**
 * Determines if the current runtime environment is Node.js.
 * @returns True if the current environment is Node.js, otherwise false.
 */
export function isNodeEnvironment(): boolean {
  // Check if 'process' exists and is an object
  if (typeof process !== 'undefined' && process !== null && typeof process === 'object') {
    // Check for Node.js specific properties
    return (
      process.release?.name === 'node' &&
      typeof process.versions?.node === 'string'
    );
  }
  return false;
}

/**
 * Determines if the current runtime environment is a browser.
 * @returns True if the current environment is a browser, otherwise false.
 */
export function isBrowserEnvironment(): boolean {
  // Check if 'window' exists and is an object
  return (
    typeof window !== 'undefined' &&
    window !== null &&
    typeof window === 'object' &&
    typeof window.document === 'object' &&
    typeof window.navigator === 'object'
  );
}
