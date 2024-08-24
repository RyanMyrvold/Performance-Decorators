import { getMemoryUsage, isBrowserEnvironment, isNodeEnvironment } from "../utilities";


/**
 * Type alias for the logging function that handles network log entries.
 */
type LogFunction = (log: NetworkLog) => void;

/**
 * Default logging function that outputs network logs to the console.
 * @param log - The network log entry to be logged.
 */
const defaultLogFunction: LogFunction = (log: NetworkLog) => {
  console.log(`[Network Request] Method: ${log.method}, URL: ${log.url}, Duration: ${log.duration.toFixed(2)}ms`);
};

/**
 * @description A decorator to log network requests made within the decorated method.
 * It logs the HTTP method, URL, and the duration of each request.
 * This decorator works in both Node.js and browser environments.
 * @param logFn - Optional custom logging function. If not provided, logs will be printed to the console.
 * @returns A decorator function.
 */
function LogNetworkRequests(logFn: LogFunction = defaultLogFunction) {
    return function (originalMethod: any, context: any) {
      if (typeof originalMethod !== "function") {
        throw new Error("🐞 [Log Network Request] Can only be applied to methods.");
      }
  
      return async function (this: any, ...args: any[]) {
        if (!isBrowserEnvironment() && !isNodeEnvironment()) {
          console.warn('[Network Request] Unsupported environment.');
          return originalMethod.apply(this, args);
        }
  
        const fetchOriginal: typeof fetch = globalThis.fetch;
  
        try {
          globalThis.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
            const start = performance.now();
            try {
              const response = await fetchOriginal(input, init);
              const end = performance.now();
  
              const log: NetworkLog = {
                method: init?.method || 'GET',
                url: typeof input === 'string' ? input : (input as Request).url,
                duration: end - start,
              };
  
              logFn(log);
              return response;
            } catch (error) {
              const end = performance.now();
              const log: NetworkLog = {
                method: init?.method || 'GET',
                url: typeof input === 'string' ? input : (input as Request).url,
                duration: end - start,
              };
  
              logFn(log);
              throw error;
            }
          };
  
          return await originalMethod.apply(this, args);
        } catch (error) {
          throw error;
        } finally {
          globalThis.fetch = fetchOriginal; // Restore original fetch
        }
      };
    };
  }

export default LogNetworkRequests;
