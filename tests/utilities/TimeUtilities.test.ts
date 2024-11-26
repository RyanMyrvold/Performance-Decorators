// TimeUtilities.test.ts
import { isNodeEnvironment, isBrowserEnvironment, getHighResolutionTime, calculateTimeInMilliseconds } from '../../src/utilities';

describe('Time Utilities', () => {
  let originalProcess: NodeJS.Process | undefined;
  let originalWindow: Window & typeof globalThis | undefined;

  beforeAll(() => {
    originalProcess = global.process;
    originalWindow = global.window;
  });

  afterEach(() => {
    resetEnvironment();
  });

  const setNodeEnvironment = () => {
    global.process = {
      hrtime: { bigint: () => BigInt(1000) },
      versions: { node: "mock" },
    } as any;
    delete (global as any).window;
  };

  const setBrowserEnvironment = () => {
    global.window = {
      performance: { now: () => 1234.56 },
      navigator: {},
      document: {},
    } as any;
    delete (global as any).process;
  };

  const resetEnvironment = () => {
    if (originalProcess) {
      global.process = originalProcess;
    }
    if (originalWindow) {
      global.window = originalWindow;
    }
  };

  it('should return performance.now in browser environment', () => {
    setBrowserEnvironment();

    console.log("window:", global.window);
    console.log("isBrowserEnvironment:", isBrowserEnvironment());

    expect(isNodeEnvironment()).toBe(false);
    expect(isBrowserEnvironment()).toBe(true);

    const result = getHighResolutionTime();
    console.log(`Test getHighResolutionTime (Browser): Expected number, Received ${result}`);
    expect(typeof result).toBe('number');
  });

  it('should calculate time in milliseconds for browser environment', () => {
    setBrowserEnvironment();

    console.log("isBrowserEnvironment:", isBrowserEnvironment());

    const start = 1234.56; // Mock start time
    const end = start + 1000; // 1 second
    const result = calculateTimeInMilliseconds(start, end);
    console.log(`Test calculateTimeInMilliseconds (Browser): Expected 1000, Received ${result}`);
    expect(result).toBe(1000);
  });

});
