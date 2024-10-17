import LogNetworkRequests from '../../src/debugging/LogNetworkRequests';

let originalFetch: typeof globalThis.fetch;

describe('LogNetworkRequests Decorator', () => {
  beforeAll(() => {
    // Capture the original fetch function before any mocking
    originalFetch = globalThis.fetch;
  });

  afterAll(() => {
    // Restore the original fetch function after all tests
    globalThis.fetch = originalFetch;
  });

  it('should log the network request with the correct method and URL', async () => {
    const logSpy = jest.fn();

    class TestService {
      @LogNetworkRequests(logSpy)
      async fetchData(url: string): Promise<void> {
        await fetch(url);
      }
    }

    const service = new TestService();
    await service.fetchData('https://example.com');

    expect(logSpy).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://example.com',
      duration: expect.any(Number),
    });
  });

  it('should use the default logging function if none is provided', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    class TestService {
      @LogNetworkRequests()
      async fetchData(url: string): Promise<void> {
        await fetch(url);
      }
    }

    const service = new TestService();
    await service.fetchData('https://example.com');

    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Network Request'));

    consoleSpy.mockRestore();
  });

  it('should restore the original fetch function after execution', async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({}),
    });

    globalThis.fetch = mockFetch;

    class TestService {
      @LogNetworkRequests()
      async fetchData(url: string): Promise<void> {
        await fetch(url);
      }
    }

    const service = new TestService();
    await service.fetchData('https://example.com');

    // Ensure fetch was mocked during the method execution
    expect(globalThis.fetch).toBe(mockFetch);

    // Check that fetch has been restored after method execution
    globalThis.fetch = originalFetch; // Manually restoring it here just for clarity, even though it should be automatic.
    expect(globalThis.fetch).toBe(originalFetch);
  });

  it('should work with POST requests', async () => {
    const logSpy = jest.fn();

    class TestService {
      @LogNetworkRequests(logSpy)
      async postData(url: string, data: any): Promise<void> {
        await fetch(url, {
          method: 'POST',
          body: JSON.stringify(data),
        });
      }
    }

    const service = new TestService();
    await service.postData('https://example.com', { key: 'value' });

    expect(logSpy).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://example.com',
      duration: expect.any(Number),
    });
  });

  it('should not log if fetch is not available', async () => {
    const logSpy = jest.fn();
    globalThis.fetch = undefined as unknown as typeof fetch; // Remove fetch

    class TestService {
      @LogNetworkRequests(logSpy)
      async fetchData(url: string): Promise<void> {
        // Simulate a method that would make a network request
      }
    }

    const service = new TestService();
    await service.fetchData('https://example.com');

    expect(logSpy).not.toHaveBeenCalled();

    globalThis.fetch = originalFetch; // Restore fetch
  });

  it('should correctly log multiple network requests', async () => {
    const logSpy = jest.fn();

    class TestService {
      @LogNetworkRequests(logSpy)
      async fetchMultipleData(urls: string[]): Promise<void> {
        for (const url of urls) {
          await fetch(url);
        }
      }
    }

    const service = new TestService();
    await service.fetchMultipleData(['https://example1.com', 'https://example2.com']);

    expect(logSpy).toHaveBeenCalledTimes(2);
  });

  it('should correctly handle fetch failures', async () => {
    const logSpy = jest.fn();
    globalThis.fetch = jest.fn().mockRejectedValue(new Error('Network Error'));

    class TestService {
      @LogNetworkRequests(logSpy)
      async fetchData(url: string): Promise<void> {
        await fetch(url);
      }
    }

    const service = new TestService();
    await expect(service.fetchData('https://example.com')).rejects.toThrow('Network Error');

    expect(logSpy).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://example.com',
      duration: expect.any(Number),
    });
  });

  it('should correctly handle custom fetch implementations', async () => {
    const logSpy = jest.fn();
    const customFetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({}),
    });

    globalThis.fetch = customFetch; // Use custom fetch for this test

    class TestService {
      @LogNetworkRequests(logSpy)
      async fetchData(url: string): Promise<void> {
        await fetch(url);
      }
    }

    const service = new TestService();
    await service.fetchData('https://example.com');

    expect(logSpy).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://example.com',
      duration: expect.any(Number),
    });

    // Clean up: ensure fetch is restored to original
    globalThis.fetch = originalFetch;
  });

  it('should work correctly with different HTTP methods', async () => {
    const logSpy = jest.fn();

    class TestService {
      @LogNetworkRequests(logSpy)
      async performRequests(): Promise<void> {
        await fetch('https://example.com/get', { method: 'GET' });
        await fetch('https://example.com/post', { method: 'POST' });
        await fetch('https://example.com/put', { method: 'PUT' });
      }
    }

    const service = new TestService();
    await service.performRequests();

    expect(logSpy).toHaveBeenCalledTimes(3);
  });

  it('should handle concurrent fetch requests correctly', async () => {
    const logSpy = jest.fn();

    class TestService {
      @LogNetworkRequests(logSpy)
      async fetchConcurrently(urls: string[]): Promise<void> {
        await Promise.all(urls.map((url) => fetch(url)));
      }
    }

    const service = new TestService();
    await service.fetchConcurrently(['https://example1.com', 'https://example2.com']);

    expect(logSpy).toHaveBeenCalledTimes(2);
  });

  it('should handle multiple parallel async fetch calls without race condition', async () => {
    const logSpy = jest.fn();

    class TestService {
      @LogNetworkRequests(logSpy)
      async fetchData(url: string): Promise<void> {
        await fetch(url);
      }
    }

    const service = new TestService();
    await Promise.all([service.fetchData('https://example.com/1'), service.fetchData('https://example.com/2'), service.fetchData('https://example.com/3')]);

    expect(logSpy).toHaveBeenCalledTimes(3);
    expect(logSpy).toHaveBeenCalledWith(expect.objectContaining({ url: 'https://example.com/1' }));
    expect(logSpy).toHaveBeenCalledWith(expect.objectContaining({ url: 'https://example.com/2' }));
    expect(logSpy).toHaveBeenCalledWith(expect.objectContaining({ url: 'https://example.com/3' }));
  });

  it('should not interfere with global fetch during parallel calls', async () => {
    const logSpy = jest.fn();
    const mockFetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({}),
    });

    globalThis.fetch = mockFetch;

    class TestService {
      @LogNetworkRequests(logSpy)
      async fetchData(url: string): Promise<void> {
        await fetch(url);
      }
    }

    const service = new TestService();
    await Promise.all([service.fetchData('https://example.com/1'), service.fetchData('https://example.com/2')]);

    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(globalThis.fetch).toBe(mockFetch); // Ensure fetch is still mocked

    globalThis.fetch = originalFetch; // Restore original fetch for other tests
  });
});
