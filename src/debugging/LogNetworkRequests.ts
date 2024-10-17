import { getHighResolutionTime, isBrowserEnvironment, isNodeEnvironment } from '../utilities';

/**
 * Network log entry interface.
 */
export interface NetworkLogEntry {
  method: string;
  url: string;
  duration: number;
}

/**
 * Default logging function that outputs network logs to the console.
 * @param log - The network log entry to be logged.
 */
const defaultLogFunction = (log: NetworkLogEntry): void => {
  console.log(`[Network Request] Method: ${log.method}, URL: ${log.url}, Duration: ${log.duration.toFixed(2)}ms`);
};

/**
 * @description A decorator to log network requests made within the decorated method.
 * It logs the HTTP method, URL, and the duration of each request.
 * This decorator works in both Node.js and browser environments.
 * @param logFn - Optional custom logging function. If not provided, logs will be printed to the console.
 * @returns A decorator function.
 */
function LogNetworkRequests(logFn: (log: NetworkLogEntry) => void = defaultLogFunction) {
  return function (originalMethod: Function, context: any) {
    if (typeof originalMethod !== 'function') {
      throw new Error('🐞 [Log Network Request] Can only be applied to methods.');
    }

    return async function (this: any, ...args: any[]) {
      if (!isBrowserEnvironment() && !isNodeEnvironment()) {
        console.warn('[Network Request] Unsupported environment.');
        return originalMethod.apply(this, args);
      }

      const fetchOriginal: typeof fetch = globalThis.fetch;

      if (typeof fetchOriginal !== 'function') {
        console.warn('[Network Request] Fetch is not available in the current environment.');
        return originalMethod.apply(this, args);
      }

      if ((fetchOriginal as any).isWrapped) {
        return await originalMethod.apply(this, args);
      }

      try {
        const fetchWrapper = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
          let start: number = 0;
          let end: number;

          try {
            start = isBrowserEnvironment() ? performance.now() : Number(getHighResolutionTime());

            const response = await fetchOriginal(input, init);

            end = isBrowserEnvironment() ? performance.now() : Number(getHighResolutionTime());

            // Log the request details
            const log: NetworkLogEntry = {
              method: init?.method || 'GET',
              url: typeof input === 'string' ? input : (input as Request).url,
              duration: end - start,
            };

            logFn(log);
            return response;
          } catch (error) {
            // End timing in case of error
            end = isBrowserEnvironment() ? performance.now() : Number(getHighResolutionTime());

            // Log the request details even on error
            const log: NetworkLogEntry = {
              method: init?.method || 'GET',
              url: typeof input === 'string' ? input : (input as Request).url,
              duration: end - start,
            };

            logFn(log);
            throw error;
          }
        };

        (fetchWrapper as any).isWrapped = true;
        globalThis.fetch = fetchWrapper;

        return await originalMethod.apply(this, args);
      } finally {
        globalThis.fetch = fetchOriginal; // Restore original fetch
      }
    };
  };
}

export default LogNetworkRequests;
