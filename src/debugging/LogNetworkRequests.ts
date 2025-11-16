// src/debugging/LogNetworkRequests.ts
import { Method, MethodContext } from "../types";
import { isBrowserEnvironment, isNodeEnvironment, getHighResolutionTime } from "../utilities";

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

// Safe, global patch bookkeeping
const PATCH_FLAG = Symbol.for("logNetworkRequests.isPatched");
const REFCOUNT   = Symbol.for("logNetworkRequests.refCount");
const ORIGINAL   = Symbol.for("logNetworkRequests.originalFetch");

/**
 * Monotonic-ish millisecond clock across environments.
 */
const now = (): number => {
  try {
    if (isBrowserEnvironment() && typeof performance?.now === "function") return performance.now();
    if (isNodeEnvironment()) return Number(getHighResolutionTime()); // bigint→number (for deltas/logging)
  } catch { /* ignore */ }
  return Date.now();
};

function readRequest(input: RequestInfo | URL, init?: RequestInit): { method: string; url: string } {
  let method = init?.method?.toUpperCase() ?? "GET";
  let url = "";
  if (typeof input === "string") url = input;
  else if (input instanceof URL) url = input.toString();
  else if (typeof Request !== "undefined" && input instanceof Request) {
    url = input.url;
    if (!init?.method && input.method) method = input.method.toUpperCase();
  } else {
    try { url = String((input as any)?.url ?? input); } catch { url = "[unreadable]"; }
  }
  return { method, url };
}

function patchFetch(logger: NetworkLogger): () => void {
  const g = globalThis as any;
  if (typeof g.fetch !== "function") return () => {};

  if (typeof g[REFCOUNT] !== "number") g[REFCOUNT] = 0;

  if (g[PATCH_FLAG]) {
    g[REFCOUNT] += 1;
    return () => { g[REFCOUNT] = Math.max(0, g[REFCOUNT] - 1); };
  }

  const orig: typeof fetch = g.fetch.bind(g);
  g[ORIGINAL] = orig;

  const wrapper: typeof fetch & { [PATCH_FLAG]?: boolean } = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const { method, url } = readRequest(input, init);
    const start = now();
    const res = await orig(input as any, init as any);
    const end = now();
    try { logger({ method, url, start, end, status: res.status, statusText: res.statusText }); } catch { /* ignore */ }
    return res;
  }) as any;

  wrapper[PATCH_FLAG] = true;
  g[PATCH_FLAG] = true;
  g[REFCOUNT] = 1;
  g.fetch = wrapper;

  return () => {
    g[REFCOUNT] = Math.max(0, g[REFCOUNT] - 1);
    if (g[REFCOUNT] === 0) {
      g.fetch = g[ORIGINAL];
      delete g[ORIGINAL];
      delete g[PATCH_FLAG];
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
  return function <
    This,
    Args extends unknown[],
    Return
  >(
    value: Method<This, Args, Return>,
    _context: MethodContext<This, Args, Return>
  ): Method<This, Args, Return> {
    const logger: NetworkLogger = (e) => { try { logFn(e); } catch { /* ignore */ } };

    return function (this: This, ...args: Args): Return {
      if (typeof (globalThis as any).fetch !== "function") {
        return value.apply(this, args);
      }

      const unpatch = patchFetch(logger);
      try {
        const out = value.apply(this, args);
        if (out instanceof Promise) {
          return (out as Promise<unknown>)
            .then((r) => { unpatch(); return r as Return; })
            .catch((err) => { unpatch(); throw err; }) as Return;
        }
        unpatch();
        return out;
      } catch (err) {
        unpatch();
        throw err;
      }
    };
  };
}
