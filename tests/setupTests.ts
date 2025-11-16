// tests/setupTests.ts

// Ensure fetch exists for tests that assume it; individual tests can override/delete.
if (typeof (globalThis as any).fetch !== "function") {
  (globalThis as any).fetch = async () =>
    ({ status: 200, statusText: "OK" } as unknown as Response);
}

// Safe baseline for performance.now()
if (typeof performance !== "undefined" && typeof performance.now !== "function") {
  // @ts-ignore
  performance.now = () => Date.now();
}

// Global afterEach safety net for suite-wide pollution
afterEach(() => {
  // Clean LogNetworkRequests global flags if a test left them behind
  const g: any = globalThis;
  const PATCH_FLAG = Symbol.for("logNetworkRequests.isPatched");
  const REFCOUNT = Symbol.for("logNetworkRequests.refCount");
  const ORIGINAL = Symbol.for("logNetworkRequests.originalFetch");

  if (g[PATCH_FLAG]) {
    try {
      if (g[ORIGINAL]) g.fetch = g[ORIGINAL];
    } catch {
      /* ignore */
    }
    delete g[ORIGINAL];
    delete g[PATCH_FLAG];
    delete g[REFCOUNT];
  }

  // If some test deleted fetch, restore a stub so others don't explode
  if (typeof g.fetch !== "function") {
    g.fetch = async () => ({ status: 200, statusText: "OK" } as unknown as Response);
  }
});
