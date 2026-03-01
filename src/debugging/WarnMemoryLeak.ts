import { ClassType } from '../types';

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
export function WarnMemoryLeak(checkIntervalMs: number = 30_000, thresholdPercent: number = 20, logger: (msg: string) => void = console.warn) {
  const MB = 1024 * 1024;

  const readMemoryUsage = (): number | undefined => {
    try {
      if (typeof performance !== 'undefined' && (performance as any).memory) {
        return (performance as any).memory.usedJSHeapSize as number;
      }
      if (typeof process !== 'undefined' && typeof process.memoryUsage === 'function') {
        return process.memoryUsage().heapUsed;
      }
    } catch {
      /* ignore */
    }
    return undefined;
  };

  const initialMemoryPerInstance = new WeakMap<object, number>();
  const monitoringTimersPerInstance = new WeakMap<object, number | NodeJS.Timeout>();

  const DISPOSE = 'dispose';

  return function <C extends ClassType<object>>(Base: C): C {
    function Wrapped(this: any, ...args: any[]) {
      const self = Reflect.construct(Base, args, new.target) as object;

      const initialMemory = readMemoryUsage();
      if (initialMemory !== undefined) {
        initialMemoryPerInstance.set(self, initialMemory);

        const monitoringTimer = setInterval(() => {
          const currentMemory = readMemoryUsage();
          const baselineMemory = initialMemoryPerInstance.get(self);
          if (currentMemory === undefined || baselineMemory === undefined) return;

          const growthPercentage = ((currentMemory - baselineMemory) / baselineMemory) * 100;
          if (growthPercentage > thresholdPercent) {
            const className = (self as { constructor?: { name?: string } })?.constructor?.name ?? 'Anonymous';
            logger(`${className}: usage up ${growthPercentage.toFixed(2)}% (${(currentMemory / MB).toFixed(1)} MB).`);
          }
        }, checkIntervalMs);

        monitoringTimersPerInstance.set(self, monitoringTimer);
      }

      if (!(DISPOSE in self)) {
        Object.defineProperty(self, DISPOSE, {
          configurable: true,
          enumerable: false,
          writable: true,
          value: function (this: object): void {
            const monitoringTimer = monitoringTimersPerInstance.get(this);
            if (monitoringTimer) {
              clearInterval(monitoringTimer as any);
              monitoringTimersPerInstance.delete(this);
            }
            initialMemoryPerInstance.delete(this);
          },
        });
      }

      return self;
    }

    Object.setPrototypeOf(Wrapped, Base);
    Wrapped.prototype = Object.create(Base.prototype);
    Wrapped.prototype.constructor = Wrapped;

    try {
      Object.defineProperty(Wrapped, 'name', {
        value: Base.name,
        configurable: true,
      });
    } catch {
      // non-critical
    }

    return Wrapped as unknown as C;
  };
}
