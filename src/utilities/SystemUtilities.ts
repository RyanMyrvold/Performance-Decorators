/**
 * Determines if the current runtime environment is Node.js based on the presence of process and hrtime.
 * @returns True if the current environment is Node.js, otherwise false.
 */
export function isNodeEnvironment(): boolean {
    console.log("Checking Node environment...");
    console.log("process:", typeof process !== "undefined" ? process : "undefined");
  
    if (typeof process === "undefined") {
      return false;
    }
  
    console.log("process.versions:", process.versions);
    console.log("process.hrtime:", process.hrtime);
  
    return (
      typeof process.versions === "object" &&
      typeof process.versions.node !== "undefined" &&
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
      typeof window !== "undefined" &&
      typeof window.document !== "undefined" &&
      typeof window.performance !== "undefined" &&
      typeof window.performance.now === "function"
    );
  }








