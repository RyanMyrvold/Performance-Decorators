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

let AsyncLocalStorage: typeof import('async_hooks').AsyncLocalStorage | null = null;

async function loadAsyncLocalStorage() {
  if (isNodeEnvironment()) {
    const asyncHooks = await import('async_hooks');
    AsyncLocalStorage = asyncHooks.AsyncLocalStorage;
  }
}

loadAsyncLocalStorage(); // Load AsyncLocalStorage if in Node environment

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

      const fetchWrapper = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
        let start: number = 0;
        let end: number;

        try {
          start = isBrowserEnvironment() ? performance.now() : Number(getHighResolutionTime());

          const response = await fetchOriginal(input, init);

          end = isBrowserEnvironment() ? performance.now() : Number(getHighResolutionTime());

          const log: NetworkLogEntry = {
            method: init?.method || 'GET',
            url: typeof input === 'string' ? input : (input as Request).url,
            duration: end - start,
          };

          if (AsyncLocalStorage) {
            const store = AsyncLocalStorage?.prototype.getStore.call(AsyncLocalStorage);
            if (store) {
              store.set('url', log.url);
            }
          }

          logFn(log);
          return response;
        } catch (error) {
          end = isBrowserEnvironment() ? performance.now() : Number(getHighResolutionTime());

          const log: NetworkLogEntry = {
            method: init?.method || 'GET',
            url: typeof input === 'string' ? input : (input as Request).url,
            duration: end - start,
          };

          if (AsyncLocalStorage) {
            const store = AsyncLocalStorage!.prototype.getStore.call(AsyncLocalStorage);
            if (store) {
              store.set('url', log.url);
            }
          }

          logFn(log);
          throw error;
        }
      };

      (fetchWrapper as any).isWrapped = true;

      if (isNodeEnvironment() && AsyncLocalStorage) {
        const asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

        return asyncLocalStorage.run(new Map(), async () => {
          globalThis.fetch = fetchWrapper;
          try {
            return await originalMethod.apply(this, args);
          } finally {
            globalThis.fetch = fetchOriginal;
          }
        });
      } else {
        globalThis.fetch = fetchWrapper;
        try {
          return await originalMethod.apply(this, args);
        } finally {
          globalThis.fetch = fetchOriginal;
        }
      }
    };
  };
}

export default LogNetworkRequests;
