import {LogExecutionTime} from '../../src/debugging';
import { calculateTimeInMilliseconds, getHighResolutionTime } from '../../src/utilities';


jest.mock('../../src/utilities/TimeUtilities');

describe('LogExecutionTime Decorator', () => {
  let mockHandler: jest.Mock;
  let mockStart: number;
  let mockEnd: number;

  beforeAll(() => {
    mockStart = 1000;
    mockEnd = 2000;

    (getHighResolutionTime as jest.Mock).mockImplementation(() => mockStart)
      .mockImplementationOnce(() => mockStart)
      .mockImplementationOnce(() => mockEnd);
    (calculateTimeInMilliseconds as jest.Mock).mockReturnValue(mockEnd - mockStart);
  });

  beforeEach(() => {
    mockHandler = jest.fn();
  });

  it('should log execution time of a method', () => {
    class TestClass {
      @LogExecutionTime(mockHandler)
      testMethod() {
        return 'result';
      }
    }

    const testInstance = new TestClass();
    const result = testInstance.testMethod();

    expect(result).toBe('result');
    expect(mockHandler).toHaveBeenCalledWith(mockEnd - mockStart, 'testMethod');
  });

  it('should handle errors in high-resolution time functions gracefully', () => {
    (getHighResolutionTime as jest.Mock).mockImplementationOnce(() => {
      throw new Error('High-resolution time error');
    });

    class TestClass {
      @LogExecutionTime(mockHandler)
      testMethod() {
        return 'result';
      }
    }

    const testInstance = new TestClass();
    const result = testInstance.testMethod();

    expect(result).toBe('result');
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('should log execution time of multiple methods in the same class', () => {
    class TestClass {
      @LogExecutionTime(mockHandler)
      methodOne() {
        return 'methodOneResult';
      }

      @LogExecutionTime(mockHandler)
      methodTwo() {
        return 'methodTwoResult';
      }
    }

    const testInstance = new TestClass();
    const resultOne = testInstance.methodOne();
    const resultTwo = testInstance.methodTwo();

    expect(resultOne).toBe('methodOneResult');
    expect(resultTwo).toBe('methodTwoResult');
    expect(mockHandler).toHaveBeenCalledWith(mockEnd - mockStart, 'methodOne');
    expect(mockHandler).toHaveBeenCalledWith(mockEnd - mockStart, 'methodTwo');
  });

  it('should work without a custom handler', () => {
    class TestClass {
      @LogExecutionTime()
      testMethod() {
        return 'result';
      }
    }

    const testInstance = new TestClass();
    const result = testInstance.testMethod();

    expect(result).toBe('result');
  });

  it('should preserve the context of `this`', () => {
    class TestClass {
      data = 'some data';

      @LogExecutionTime(mockHandler)
      testMethod() {
        return this.data;
      }
    }

    const testInstance = new TestClass();
    const result = testInstance.testMethod();

    expect(result).toBe('some data');
    expect(mockHandler).toHaveBeenCalledWith(mockEnd - mockStart, 'testMethod');
  });

  it('should handle asynchronous methods', async () => {
    class TestClass {
      @LogExecutionTime(mockHandler)
      async asyncMethod() {
        return 'async result';
      }
    }

    const testInstance = new TestClass();
    const result = await testInstance.asyncMethod();

    expect(result).toBe('async result');
    expect(mockHandler).toHaveBeenCalledWith(mockEnd - mockStart, 'asyncMethod');
  });

  it('should handle methods throwing errors', () => {
    class TestClass {
      @LogExecutionTime(mockHandler)
      methodWithError() {
        throw new Error('Test error');
      }
    }

    const testInstance = new TestClass();

    expect(() => testInstance.methodWithError()).toThrow('Test error');
    expect(mockHandler).toHaveBeenCalledWith(mockEnd - mockStart, 'methodWithError');
  });
});