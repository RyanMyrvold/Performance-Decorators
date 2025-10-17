// @ts-ignore
import { LogMemoryUsage } from '../../src/debugging/logMemoryUsage';

class TestService {
  @LogMemoryUsage()
  heavySync(): number[] {
    return Array(10000).fill(0).map((_, i) => i * 2);
  }

  @LogMemoryUsage()
  async heavyAsync(): Promise<number[]> {
    return new Promise((resolve) =>
      setTimeout(() => resolve(Array(10000).fill(0).map((_, i) => i * 2)), 10)
    );
  }
}

describe('logMemoryUsage (Node)', () => {
  let service: TestService;

  beforeEach(() => {
    service = new TestService();
  });

  it('should log memory usage for sync method', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    service.heavySync();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('should log memory usage for async method', async () => {
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
    await service.heavyAsync();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
