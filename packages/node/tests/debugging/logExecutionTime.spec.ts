import { LogExecutionTime } from '../../src/debugging/logExecutionTime';

describe('LogExecutionTime (Node)', () => {
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
