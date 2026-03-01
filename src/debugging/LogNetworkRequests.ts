import { Method, MethodContext } from '../types';
import { isBrowserEnvironment, isNodeEnvironment, getHighResolutionTime } from '../utilities';

/**
 * Network log entry shape.
 */
export interface NetworkLogEntry {
  method: string;
  url: string;
  start: number;
  end: number;
  status: number;
  statusText: string;
}

export type NetworkLogger = (entry: NetworkLogEntry) => void;

const NOOP: NetworkLogger = () => {};

const PATCH_FLAG = Symbol.for('logNetworkRequests.isPatched');
const REFCOUNT = Symbol.for('logNetworkRequests.refCount');
const ORIGINAL = Symbol.for('logNetworkRequests.originalFetch');

/**
 * Monotonic-ish millisecond clock across environments.
 */
const now = (): number => {
  try {
    if (isBrowserEnvironment() && typeof performance?.now === 'function') return performance.now();
    if (isNodeEnvironment()) return Number(getHighResolutionTime()); // bigint→number (for deltas/logging)
  } catch {
    /* ignore */
  }
  return Date.now();
};

function extractRequestDetails(input: RequestInfo | URL, init?: RequestInit): { method: string; url: string } {
  let method = init?.method?.toUpperCase() ?? 'GET';
  let url = '';
  if (typeof input === 'string') url = input;
  else if (input instanceof URL) url = input.toString();
  else if (typeof Request !== 'undefined' && input instanceof Request) {
    url = input.url;
    if (!init?.method && input.method) method = input.method.toUpperCase();
  } else {
    try {
      url = String((input as any)?.url ?? input);
    } catch {
      url = '[unreadable]';
    }
  }
  return { method, url };
}

function createFetchPatch(logger: NetworkLogger): () => void {
  const globalContext = globalThis as any;
  if (typeof globalContext.fetch !== 'function') return () => {};

  if (typeof globalContext[REFCOUNT] !== 'number') globalContext[REFCOUNT] = 0;

  if (globalContext[PATCH_FLAG]) {
    globalContext[REFCOUNT] += 1;
    return () => {
      globalContext[REFCOUNT] = Math.max(0, globalContext[REFCOUNT] - 1);
    };
  }

  const originalFetch: typeof fetch = globalContext.fetch.bind(globalContext);
  globalContext[ORIGINAL] = originalFetch;

  const patchedFetch: typeof fetch & { [PATCH_FLAG]?: boolean } = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const { method, url } = extractRequestDetails(input, init);
    const startTime = now();
    const response = await originalFetch(input as any, init as any);
    const endTime = now();
    try {
      logger({ method, url, start: startTime, end: endTime, status: response.status, statusText: response.statusText });
    } catch {
      /* ignore */
    }
    return response;
  }) as any;

  patchedFetch[PATCH_FLAG] = true;
  globalContext[PATCH_FLAG] = true;
  globalContext[REFCOUNT] = 1;
  globalContext.fetch = patchedFetch;

  return () => {
    globalContext[REFCOUNT] = Math.max(0, globalContext[REFCOUNT] - 1);
    if (globalContext[REFCOUNT] === 0) {
      globalContext.fetch = globalContext[ORIGINAL];
      delete globalContext[ORIGINAL];
      delete globalContext[PATCH_FLAG];
    }
  };
}

/**
 * Logs all `fetch` network requests made during the decorated method’s execution.
 * Patch is applied only for the call scope (reference-counted across concurrent calls).
 *
 * @param logFn Optional logger (default: no-op).
 *
 * @example
 * class ApiService {
 *   @LogNetworkRequests((e) => console.debug(`[${e.method}] ${e.url} ${(e.end - e.start).toFixed(2)}ms ${e.status}`))
 *   async getUser(id: string) {
 *     const res = await fetch(`/api/users/${id}`);
 *     return res.json();
 *   }
 * }
 */
export function LogNetworkRequests(logFn: NetworkLogger = NOOP) {
  return function <This, Args extends unknown[], Return>(value: Method<This, Args, Return>, _context: MethodContext<This, Args, Return>): Method<This, Args, Return> {
    const logger: NetworkLogger = (logEntry) => {
      try {
        logFn(logEntry);
      } catch {
        /* ignore */
      }
    };

    return function (this: This, ...args: Args): Return {
      if (typeof (globalThis as any).fetch !== 'function') {
        return value.apply(this, args);
      }

      const unpatchFetch = createFetchPatch(logger);
      try {
        const result = value.apply(this, args);
        if (result instanceof Promise) {
          return (result as Promise<unknown>)
            .then((resolvedValue) => {
              unpatchFetch();
              return resolvedValue as Return;
            })
            .catch((thrownError) => {
              unpatchFetch();
              throw thrownError;
            }) as Return;
        }
        unpatchFetch();
        return result;
      } catch (thrownError) {
        unpatchFetch();
        throw thrownError;
      }
    };
  };
}
