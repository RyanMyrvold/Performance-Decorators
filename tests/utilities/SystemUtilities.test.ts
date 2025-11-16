import { isBrowserEnvironment, isNodeEnvironment } from '../../src/utilities';

describe('System Utilities', () => {
  describe('isNodeEnvironment', () => {
    let originalProcess: any;

    beforeAll(() => {
      originalProcess = global.process;
    });

    afterEach(() => {
      global.process = originalProcess;
    });

    afterAll(() => {
      // @ts-ignore
      global.process = originalProcess;
    });

    it('should return true in Node.js environment', () => {
      global.process = {
        hrtime: { bigint: () => BigInt(1000) },
        versions: { node: 'mock' },
        ...originalProcess,
      } as any;
      const result = isNodeEnvironment();
      console.log(`Test isNodeEnvironment (Node.js): Expected true, Received ${result}`);
      expect(result).toBe(true);
    });

    it('should return false if process is undefined', () => {
      (global as any).process = undefined;
      const result = isNodeEnvironment();
      console.log(`Test isNodeEnvironment (No process): Expected false, Received ${result}`);
      expect(result).toBe(false);
    });

    it('should return false if hrtime is not a function', () => {
      global.process = { hrtime: null, versions: { node: 'mock' } } as any;
      const result = isNodeEnvironment();
      console.log(`Test isNodeEnvironment (No hrtime): Expected false, Received ${result}`);
      expect(result).toBe(false);
    });

    it('should return false if hrtime.bigint is not a function', () => {
      global.process = {
        hrtime: { bigint: null },
        versions: { node: 'mock' },
      } as any;
      const result = isNodeEnvironment();
      console.log(`Test isNodeEnvironment (No hrtime.bigint): Expected false, Received ${result}`);
      expect(result).toBe(false);
    });
  });

  describe('isBrowserEnvironment', () => {
    let originalWindow: any;

    beforeAll(() => {
      originalWindow = global.window;
    });

    afterEach(() => {
      global.window = originalWindow;
    });

    it('should return true in browser environment', () => {
      global.window = { document: {}, performance: { now: () => 1234.56 }, navigator: {} } as any;
      const result = isBrowserEnvironment();
      console.log(`Test isBrowserEnvironment (Browser): Expected true, Received ${result}`);
      expect(result).toBe(true);
    });
  });

  it('should return false if window is undefined', () => {
    (global as any).window = undefined;
    const result = isBrowserEnvironment();
    console.log(`Test isBrowserEnvironment (No window): Expected false, Received ${result}`);
    expect(result).toBe(false);
  });

  it('should return false if document is undefined', () => {
    global.window = { document: undefined, performance: { now: () => 1234.56 }, navigator: {} } as any;
    const result = isBrowserEnvironment();
    console.log(`Test isBrowserEnvironment (No document): Expected false, Received ${result}`);
    expect(result).toBe(false);
  });
});
