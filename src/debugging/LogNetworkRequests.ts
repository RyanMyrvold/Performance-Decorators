// src/debugging/LogNetworkRequests.ts

import { getHighResolutionTime, isBrowserEnvironment, isNodeEnvironment } from '../utilities';
import { AsyncLocalStorage } from 'async_hooks';

/**
 * Network log entry interface.
 */
export interface NetworkLogEntry {
  method: string;
  url: string;
  start: number;
  end: number;
  status: number;
  statusText: string;
}

/**
 * Default no-operation logging function.
 * If no logFn is provided, no logging will be made.
 */
const defaultLogFunction = (log: NetworkLogEntry) => {
  console.log(log);
};

/**
 * @description A decorator to log network requests made within the decorated method.
 * It logs the HTTP method, URL, and the duration of each request.
 * This decorator works in both Node.js and browser environments.
 * @param logFn - Optional custom logging function. If not provided, no logs will be made.
 * @returns A method decorator function.
 */
export function LogNetworkRequests<T extends (...args: any[]) => Promise<any>>(
  logFn: (log: NetworkLogEntry) => void = defaultLogFunction
) {
  // Initialize AsyncLocalStorage synchronously if in Node.js environment
  let asyncLocalStorage: AsyncLocalStorage<Map<string, any>> | null = null;
  if (isNodeEnvironment()) {
    try {
      asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();
    } catch (error) {
      // If AsyncLocalStorage cannot be initialized, proceed without it
      asyncLocalStorage = null;
    }
  }

  return function (
    originalMethod: T,
    context: ClassMethodDecoratorContext
  ): T {
    const methodName = context.name as string;

    const wrappedMethod = async function (this: any, ...args: Parameters<T>): Promise<ReturnType<T>> {
      // Check if fetch is available
      if (typeof globalThis.fetch !== 'function') {
        // Proceed without wrapping fetch
        return originalMethod.apply(this, args);
      }

      // Check if fetch is already wrapped
      if ((globalThis.fetch as any).isWrapped) {
        return originalMethod.apply(this, args);
      }

      const fetchOriginal = globalThis.fetch;

      // Define fetchWrapper
      const fetchWrapper = async (
        input: RequestInfo | URL,
        init?: RequestInit
      ): Promise<Response> => {
        const method = init?.method || 'GET';
        const url = typeof input === 'string' ? input : (input as Request).url;
        const start = isBrowserEnvironment() ? performance.now() : Number(getHighResolutionTime());

        // Call the original fetch method
        const response = await fetchOriginal(input, init);

        // Log the network request
        logFn({
          method,
          url,
          start,
          end: isBrowserEnvironment() ? performance.now() : Number(getHighResolutionTime()),
          status: response.status,
          statusText: response.statusText,
        });

        return response;
      };

      // Mark fetch as wrapped
      (fetchWrapper as any).isWrapped = true;

      // Replace global fetch with the wrapper
      globalThis.fetch = fetchWrapper;

      // Call the original method
      return originalMethod.apply(this, args);
    };

    return wrappedMethod as T;
  };
}
