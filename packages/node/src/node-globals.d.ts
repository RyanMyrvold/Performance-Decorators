declare const process: {
  memoryUsage(): {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
    arrayBuffers: number;
  };
  [key: string]: unknown;
};

declare const console: {
  log: (...args: unknown[]) => void;
  time: (...args: unknown[]) => void;
  timeEnd: (...args: unknown[]) => void;
  [key: string]: unknown;
};
