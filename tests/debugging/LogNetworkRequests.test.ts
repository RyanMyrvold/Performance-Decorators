// tests/LogNetworkRequests.test.ts
import { LogNetworkRequests, NetworkLogEntry } from "../../src/debugging/LogNetworkRequests";

describe("LogNetworkRequests Decorator", () => {
  let originalFetch: typeof fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    jest.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("logs network requests using a provided log function (GET default)", async () => {
    const logFn = jest.fn();

    const mockFetch = jest.fn().mockResolvedValue({
      status: 200,
      statusText: "OK"
    } as Response);
    globalThis.fetch = mockFetch;

    class TestService {
      @LogNetworkRequests(logFn)
      async fetchData(url: string): Promise<void> {
        await fetch(url);
      }
    }

    const svc = new TestService();
    await svc.fetchData("https://example.com");

    expect(mockFetch).toHaveBeenCalledWith("https://example.com", undefined);

    expect(logFn).toHaveBeenCalledWith(
      expect.objectContaining<NetworkLogEntry>({
        method: "GET",
        url: "https://example.com",
        status: 200,
        statusText: "OK",
        start: expect.any(Number),
        end: expect.any(Number)
      })
    );
  });

  it("uses the provided logging function and respects method in init", async () => {
    const logFn = jest.fn();

    const mockFetch = jest.fn().mockResolvedValue({
      status: 404,
      statusText: "Not Found"
    } as Response);
    globalThis.fetch = mockFetch;

    class TestService {
      @LogNetworkRequests(logFn)
      async fetchData(url: string): Promise<void> {
        await fetch(url, { method: "POST" });
      }
    }

    const svc = new TestService();
    await svc.fetchData("https://example.com");

    expect(mockFetch).toHaveBeenCalledWith("https://example.com", { method: "POST" });

    expect(logFn).toHaveBeenCalledWith(
      expect.objectContaining<NetworkLogEntry>({
        method: "POST",
        url: "https://example.com",
        status: 404,
        statusText: "Not Found",
        start: expect.any(Number),
        end: expect.any(Number)
      })
    );
  });

  it("proceeds without wrapping if fetch is not available", async () => {
    delete (globalThis as any).fetch;

    class TestService {
      @LogNetworkRequests()
      async fetchData(_url: string): Promise<string> {
        return "fetch not available";
      }
    }

    const svc = new TestService();
    const result = await svc.fetchData("https://example.com");

    expect(result).toBe("fetch not available");
  });

  it("does not wrap when a previous patch is indicated (symbol flag)", async () => {
    const logFn = jest.fn();

    // Create a mock fetch and simulate a globally “already patched” flag
    const mockFetch = jest.fn().mockResolvedValue({
      status: 200,
      statusText: "OK"
    } as Response);
    globalThis.fetch = mockFetch;

    // Simulate the decorator’s global patch state:
    const PATCH_FLAG = Symbol.for("logNetworkRequests.isPatched");
    const REFCOUNT = Symbol.for("logNetworkRequests.refCount");
    (globalThis as any)[PATCH_FLAG] = true;
    (globalThis as any)[REFCOUNT] = 1;

    class TestService {
      @LogNetworkRequests(logFn)
      async fetchData(url: string): Promise<void> {
        await fetch(url);
      }
    }

    const svc = new TestService();
    await svc.fetchData("https://example.com");

    expect(mockFetch).toHaveBeenCalledWith("https://example.com");
    // Because we didn't actually install the wrapper (we faked "already patched"),
    // no logging occurs from the decorator’s wrapper.
    expect(logFn).not.toHaveBeenCalled();

    // Clean up the simulated global flags
    delete (globalThis as any)[PATCH_FLAG];
    delete (globalThis as any)[REFCOUNT];
  });

  it("works in a browser-like timing scenario (performance.now)", async () => {
    const logFn = jest.fn();

    // Mock performance.now to be deterministic
    const nowSpy = jest.spyOn(performance, "now").mockReturnValue(123.456);

    const mockFetch = jest.fn().mockResolvedValue({
      status: 200,
      statusText: "OK"
    } as Response);
    globalThis.fetch = mockFetch;

    class TestService {
      @LogNetworkRequests(logFn)
      async fetchData(url: string): Promise<void> {
        await fetch(url);
      }
    }

    const svc = new TestService();
    await svc.fetchData("https://example.com");

    expect(logFn).toHaveBeenCalledWith(
      expect.objectContaining<NetworkLogEntry>({
        method: "GET",
        url: "https://example.com",
        status: 200,
        statusText: "OK",
        start: expect.any(Number),
        end: expect.any(Number)
      })
    );

    nowSpy.mockRestore();
  });

  it("does not interfere with the method’s return value", async () => {
    const mockResponse = {
      json: jest.fn().mockResolvedValue({ data: "test" }),
      status: 200,
      statusText: "OK",
      headers: new Headers(),
      ok: true,
      redirected: false,
      type: "basic",
      url: "",
      clone: jest.fn(),
      bodyUsed: false,
      arrayBuffer: jest.fn(),
      blob: jest.fn(),
      formData: jest.fn(),
      text: jest.fn()
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

    const svc = new TestService();
    const result = await svc.fetchData("https://example.com");

    expect(result).toEqual({ data: "test" });
    expect(mockFetch).toHaveBeenCalledWith("https://example.com", undefined);
  });
});
