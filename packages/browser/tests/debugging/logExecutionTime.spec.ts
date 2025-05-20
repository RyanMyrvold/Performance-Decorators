// @ts-ignore
import { LogExecutionTime } from '@browser/debugging/logExecutionTime';

describe('LogExecutionTime (Browser)', () => {
  it('should return a method decorator', () => {
    const result = LogExecutionTime();
    expect(typeof result).toBe('function');
  });

  it('should not alter the descriptor', () => {
    class TestClass {
      @LogExecutionTime()
      method(): string {
        return 'test';
      }
    }
    const instance = new TestClass();
    expect(instance.method()).toBe('test');
  });
});
