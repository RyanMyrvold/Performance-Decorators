// test/debugging/LogExecutionTime.spec.ts
import { LogExecutionTime } from '../../src/debugging/LogExecutionTime';
import { calculateTimeInMilliseconds, getHighResolutionTime } from '../../src/utilities/TimeUtilities';

jest.mock('../../src/utilities/TimeUtilities', () => ({
  getHighResolutionTime: jest.fn(),
  calculateTimeInMilliseconds: jest.fn(),
}));

describe('LogExecutionTime Decorator', () => {
  let handler: jest.Mock;

  const mockStart = 1000;
  const mockEnd = 2000;

  beforeEach(() => {
    handler = jest.fn();
    (getHighResolutionTime as jest.Mock).mockReset();
    (calculateTimeInMilliseconds as jest.Mock).mockReset();

    // Default: first call = start, second = end
    (getHighResolutionTime as jest.Mock).mockReturnValueOnce(mockStart).mockReturnValueOnce(mockEnd);

    (calculateTimeInMilliseconds as jest.Mock).mockImplementation((s: number | bigint, e: number | bigint) => Number(e) - Number(s));
  });

  it('invokes handler with elapsed time for sync method', () => {
    class TestClass {
      @LogExecutionTime(handler)
      testMethod() {
        return 'result';
      }
    }

    const t = new TestClass();
    const result = t.testMethod();

    expect(result).toBe('result');
    expect(handler).toHaveBeenCalledWith(mockEnd - mockStart, 'testMethod');
  });

  it('handles high-res timer errors gracefully', () => {
    (getHighResolutionTime as jest.Mock).mockImplementationOnce(() => {
      throw new Error('timer error');
    });

    class TestClass {
      @LogExecutionTime(handler)
      testMethod() {
        return 'result';
      }
    }

    const t = new TestClass();
    const result = t.testMethod();

    expect(result).toBe('result');
    // Since start failed, we expect no handler call
    expect(handler).not.toHaveBeenCalledWith(1);
  });

  it('invokes handler for multiple decorated methods', () => {
    class TestClass {
      @LogExecutionTime(handler)
      one() {
        return 'one';
      }
      @LogExecutionTime(handler)
      two() {
        return 'two';
      }
    }

    // Reset per-method timer sequence
    (getHighResolutionTime as jest.Mock)
      .mockReset()
      .mockReturnValueOnce(mockStart)
      .mockReturnValueOnce(mockEnd) // one
      .mockReturnValueOnce(mockStart)
      .mockReturnValueOnce(mockEnd); // two

    const t = new TestClass();
    expect(t.one()).toBe('one');
    expect(t.two()).toBe('two');

    expect(handler).toHaveBeenCalledWith(mockEnd - mockStart, 'one');
    expect(handler).toHaveBeenCalledWith(mockEnd - mockStart, 'two');
  });

  it('works without a custom handler', () => {
    class TestClass {
      @LogExecutionTime()
      testMethod() {
        return 'result';
      }
    }

    const t = new TestClass();
    const result = t.testMethod();

    expect(result).toBe('result');
    // No handler to assert
  });

  it('preserves `this` context', () => {
    class TestClass {
      data = 'some data';

      @LogExecutionTime(handler)
      testMethod() {
        return this.data;
      }
    }

    const t = new TestClass();
    const result = t.testMethod();

    expect(result).toBe('some data');
    expect(handler).toHaveBeenCalledWith(expect.any(Number), 'testMethod');
  });

  it('supports asynchronous methods', async () => {
    class TestClass {
      @LogExecutionTime(handler)
      async asyncMethod() {
        return 'async result';
      }
    }

    // Reset timer calls for this test
    (getHighResolutionTime as jest.Mock).mockReset().mockReturnValueOnce(mockStart).mockReturnValueOnce(mockEnd);

    const t = new TestClass();
    const result = await t.asyncMethod();

    expect(result).toBe('async result');
    expect(handler).toHaveBeenCalledWith(mockEnd - mockStart, 'asyncMethod');
  });

  it('still measures when methods throw', () => {
    // Set up timer mocks FIRST so the decorator/wrapper sees them
    (getHighResolutionTime as jest.Mock)
      .mockReset()
      .mockReturnValueOnce(mockStart) // start
      .mockReturnValueOnce(mockEnd); // end

    (calculateTimeInMilliseconds as jest.Mock).mockReset().mockImplementation((s: number | bigint, e: number | bigint) => Number(e) - Number(s));

    class TestClass {
      @LogExecutionTime(handler)
      boom() {
        throw new Error('Test error');
      }
    }

    const t = new TestClass();

    expect(() => t.boom()).toThrow('Test error');
    expect(handler).toHaveBeenCalledWith(mockEnd - mockStart, 'boom');
  });
});
