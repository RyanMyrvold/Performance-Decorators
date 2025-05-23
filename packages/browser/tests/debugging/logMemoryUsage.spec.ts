// @ts-ignore
import { LogMemoryUsage } from '@browser/debugging/logMemoryUsage';

class BrowserTestService {
  @LogMemoryUsage()
  cpuBound(): number[] {
    return Array(5000).fill(0).map((_, i) => i + Math.random());
  }

  @LogMemoryUsage()
  async cpuBoundAsync(): Promise<number[]> {
    return new Promise((resolve) =>
      setTimeout(() => resolve(Array(5000).fill(0).map((_, i) => i + Math.random())), 10)
    );
  }
}

describe('logMemoryUsage (Browser)', () => {
  let service: BrowserTestService;

  beforeEach(() => {
    service = new BrowserTestService();
  });

  it('should log approximate memory or time for sync method', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    service.cpuBound();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should log approximate memory or time for async method', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await service.cpuBoundAsync();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
