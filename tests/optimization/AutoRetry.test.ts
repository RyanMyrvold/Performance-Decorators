// tests/AutoRetry.test.ts
import { AutoRetry } from '../../src/optimization';

class TestClass {
  private attempts = 0;

  @AutoRetry(3, 100)
  async unreliableMethod() {
    this.attempts++;
    if (this.attempts < 3) {
      throw new Error('Temporary failure');
    }
    return 'Success';
  }

  @AutoRetry(3, 100)
  async permanentlyFailingMethod() {
    throw new Error('Permanent failure');
  }

  resetAttempts() {
    this.attempts = 0;
  }
}

describe('AutoRetry Decorator', () => {
  let instance: TestClass;

  beforeEach(() => {
    instance = new TestClass();
    instance.resetAttempts();
  });

  it('should retry the method until it succeeds', async () => {
    const result = await instance.unreliableMethod();
    expect(result).toBe('Success');
  });

  it('should fail after the maximum number of retries', async () => {
    await expect(instance.permanentlyFailingMethod()).rejects.toThrow('🚨 [Auto Retry] Failed after 3 retries: Permanent failure');
  });
});
