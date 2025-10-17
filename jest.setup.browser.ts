import { performance as nodePerformance } from 'node:perf_hooks';

declare global {
  // eslint-disable-next-line no-var
  var performance: Performance;
}

if (typeof globalThis.performance === 'undefined') {
  Object.defineProperty(globalThis, 'performance', {
    configurable: true,
    value: nodePerformance as unknown as Performance
  });
}
