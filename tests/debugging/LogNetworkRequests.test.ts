// tests/LogNetworkRequests.test.ts

import { LogNetworkRequests, NetworkLogEntry } from '../../src/debugging/LogNetworkRequests';
import { isBrowserEnvironment } from '../../src/utilities';

describe('LogNetworkRequests Decorator', () => {
  let originalFetch: typeof fetch;

  beforeEach(() => {
    // Save the original fetch
    originalFetch = globalThis.fetch;
  });

  afterEach(() => {
    // Restore the original fetch
    globalThis.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it('should log network requests using the default log function', async () => {
    // Mock console.log
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    // Mock fetch
    const mockFetch = jest.fn().mockResolvedValue({
      status: 200,
      statusText: 'OK',
    } as Response);
    globalThis.fetch = mockFetch;

    class TestService {
      @LogNetworkRequests()
      async fetchData(url: string): Promise<void> {
        await fetch(url);
      }
    }

    const service = new TestService();
    await service.fetchData('https://example.com');

    expect(mockFetch).toHaveBeenCalledWith('https://example.com', undefined);

    expect(consoleSpy).toHaveBeenCalledWith(expect.objectContaining<NetworkLogEntry>({
      method: 'GET',
      url: 'https://example.com',
      status: 200,
      statusText: 'OK',
      start: expect.any(Number),
      end: expect.any(Number),
    }));

    consoleSpy.mockRestore();
  });

  it('should use the provided logging function', async () => {
    const logFn = jest.fn();

    // Mock fetch
    const mockFetch = jest.fn().mockResolvedValue({
      status: 404,
      statusText: 'Not Found',
    } as Response);
    globalThis.fetch = mockFetch;

    class TestService {
      @LogNetworkRequests(logFn)
      async fetchData(url: string): Promise<void> {
        await fetch(url, { method: 'POST' });
      }
    }

    const service = new TestService();
    await service.fetchData('https://example.com');

    expect(mockFetch).toHaveBeenCalledWith('https://example.com', { method: 'POST' });

    expect(logFn).toHaveBeenCalledWith(expect.objectContaining<NetworkLogEntry>({
      method: 'POST',
      url: 'https://example.com',
      status: 404,
      statusText: 'Not Found',
      start: expect.any(Number),
      end: expect.any(Number),
    }));
  });

  it('should proceed without wrapping if fetch is not available', async () => {
    // Remove fetch from globalThis
    // @ts-expect-error
    delete globalThis.fetch;

    class TestService {
      @LogNetworkRequests()
      async fetchData(url: string): Promise<string> {
        return 'fetch not available';
      }
    }

    const service = new TestService();
    const result = await service.fetchData('https://example.com');

    expect(result).toBe('fetch not available');
  });

  it('should not wrap fetch if it is already wrapped', async () => {
    // Mock fetch and mark it as wrapped
    const mockFetch = jest.fn().mockResolvedValue({
      status: 200,
      statusText: 'OK',
    } as Response);
    (mockFetch as any).isWrapped = true;
    globalThis.fetch = mockFetch;

    const logFn = jest.fn();

    class TestService {
      @LogNetworkRequests(logFn)
      async fetchData(url: string): Promise<void> {
        await fetch(url);
      }
    }

    const service = new TestService();
    await service.fetchData('https://example.com');

    expect(mockFetch).toHaveBeenCalledWith('https://example.com');
    expect(logFn).not.toHaveBeenCalled();
  });

  it('should work correctly in a browser environment', async () => {
    // Mock performance.now()
    const now = Date.now();
    jest.spyOn(performance, 'now').mockReturnValue(now);

    // Mock fetch
    const mockFetch = jest.fn().mockResolvedValue({
      status: 200,
      statusText: 'OK',
    } as Response);
    globalThis.fetch = mockFetch;

    const logFn = jest.fn();

    class TestService {
      @LogNetworkRequests(logFn)
      async fetchData(url: string): Promise<void> {
        await fetch(url);
      }
    }

    // Mock isBrowserEnvironment to return true
    jest.mock('../../src/utilities', () => ({
      ...jest.requireActual('../../src/utilities'),
      isBrowserEnvironment: jest.fn().mockReturnValue(true),
    }));

    const service = new TestService();
    await service.fetchData('https://example.com');

    expect(logFn).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://example.com',
      start: expect.any(Number),
      end: expect.any(Number),
      status: 200,
      statusText: 'OK',
    });
  });

  it('should not interfere with the method\'s return value', async () => {
    // Create a mock Response object that satisfies the interface
    const mockResponse = {
      json: jest.fn().mockResolvedValue({ data: 'test' }),
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      ok: true,
      redirected: false,
      type: 'basic',
      url: '',
      clone: jest.fn(),
      bodyUsed: false,
      arrayBuffer: jest.fn(),
      blob: jest.fn(),
      formData: jest.fn(),
      text: jest.fn(),
    } as unknown as Response;

    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    globalThis.fetch = mockFetch;

    class TestService {
      @LogNetworkRequests()
      async fetchData(url: string): Promise<any> {
        const response = await fetch(url);
        return response.json();
      }
    }

    const service = new TestService();
    const result = await service.fetchData('https://example.com');

    expect(result).toEqual({ data: 'test' });

    // Adjusted expectation to include undefined as the second argument
    expect(mockFetch).toHaveBeenCalledWith('https://example.com', undefined);
  });
});
