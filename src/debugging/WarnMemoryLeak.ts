// src/optimizations/WarnMemoryLeak.ts
import { ClassType } from "../types";

/**
 * Periodically checks memory usage; logs a warning if growth since construction
 * exceeds `thresholdPercent`. Purely observational (no GC triggers).
 *
 * Node:    process.memoryUsage().heapUsed
 * Browser: performance.memory?.usedJSHeapSize (when available)
 *
 * @param checkIntervalMs   Interval for checks (default 30s)
 * @param thresholdPercent  Percent growth to warn (default 20%)
 * @param logger            Logger (default console.warn)
 *
 * @example
 * @WarnMemoryLeak(10_000, 25)
 * class Cache { /* ... *\/ }
 */
export function WarnMemoryLeak(
  checkIntervalMs: number = 30_000,
  thresholdPercent: number = 20,
  logger: (msg: string) => void = console.warn
) {
  const MB = 1024 * 1024;

  const readMem = (): number | undefined => {
    try {
      if (typeof performance !== "undefined" && (performance as any).memory) {
        return (performance as any).memory.usedJSHeapSize as number;
      }
      if (typeof process !== "undefined" && typeof process.memoryUsage === "function") {
        return process.memoryUsage().heapUsed;
      }
    } catch {
      /* ignore */
    }
    return undefined;
  };

  // Per-instance state kept out of the prototype graph.
  const initialMem = new WeakMap<object, number>();
  const timers = new WeakMap<object, number | NodeJS.Timeout>();

  // Non-enumerable instance method name used for cleanup.
  const DISPOSE = "dispose";

  return function <C extends ClassType<object>>(Base: C): C {
    // A constructable wrapper that preserves `new.target` and static inheritance.
    function Wrapped(this: any, ...args: any[]) {
      // Build instance of Base, respecting `new.target` for derived classes.
      const self = Reflect.construct(Base, args, new.target ?? Wrapped) as object;

      const start = readMem();
      if (start !== undefined) {
        initialMem.set(self, start);

        const t = setInterval(() => {
          const cur = readMem();
          const init = initialMem.get(self);
          if (cur === undefined || init === undefined) return;

          const deltaPct = ((cur - init) / init) * 100;
          if (deltaPct > thresholdPercent) {
            const name =
              (self as { constructor?: { name?: string } })?.constructor?.name ?? "Anonymous";
            logger(
              `⚠️ [MemoryLeak] ${name}: usage up ${deltaPct.toFixed(2)}% (${(cur / MB).toFixed(1)} MB).`
            );
          }
        }, checkIntervalMs);

        timers.set(self, t);
      }

      // Add a non-enumerable dispose() for cleanup.
      if (!(DISPOSE in self)) {
        Object.defineProperty(self, DISPOSE, {
          configurable: true,
          enumerable: false,
          writable: true,
          value: function (this: object): void {
            const t = timers.get(this);
            if (t) {
              clearInterval(t as any);
              timers.delete(this);
            }
            initialMem.delete(this);
          }
        });
      }

      return self;
    }

    // Make Wrapped look/act like Base as a constructor.
    Object.setPrototypeOf(Wrapped, Base); // static inheritance
    Wrapped.prototype = Base.prototype;   // instance inheritance

    try {
      // Keep class name readable in stacks/tools (best-effort).
      Object.defineProperty(Wrapped, "name", {
        value: Base.name,
        configurable: true
      });
    } catch {
      /* non-critical */
    }

    return Wrapped as unknown as C;
  };
}
