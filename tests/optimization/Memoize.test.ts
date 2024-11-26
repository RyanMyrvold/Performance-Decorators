import { Memoize } from "../../src/optimization/Memoize";

describe('Memoize Decorator', () => {
  class TestClass {
    callCount = 0;

    @Memoize()
    computeExpensiveResult(a: number, b: number): number {
      this.callCount++;
      return a + b;
    }
  }

  let instance: TestClass;

  beforeEach(() => {
    instance = new TestClass();
  });

  test('should cache the result for repeated arguments', () => {
    const firstResult = instance.computeExpensiveResult(3, 4);
    const secondResult = instance.computeExpensiveResult(3, 4);

    expect(firstResult).toBe(7);
    expect(secondResult).toBe(7);
    expect(instance.callCount).toBe(1);
  });

  test('should compute the result again for different arguments', () => {
    const resultA = instance.computeExpensiveResult(3, 4);
    const resultB = instance.computeExpensiveResult(5, 6);

    expect(resultA).toBe(7);
    expect(resultB).toBe(11);
    expect(instance.callCount).toBe(2);
  });

  test('should not share cache across instances', () => {
    const instanceA = new TestClass();
    const instanceB = new TestClass();

    const resultA = instanceA.computeExpensiveResult(3, 4);
    const resultB = instanceB.computeExpensiveResult(3, 4);

    expect(resultA).toBe(7);
    expect(resultB).toBe(7);
    expect(instanceA.callCount).toBe(1);
    expect(instanceB.callCount).toBe(1);
  });

  it('should memoize method calls', () => {
    const memoizedFunction = jest.fn();

    class TestClass {
      @Memoize()
      memoizeMethod() {
        memoizedFunction();
      }
    }

    const instance = new TestClass();
    instance.memoizeMethod();
    instance.memoizeMethod();
    instance.memoizeMethod();

    expect(memoizedFunction).toHaveBeenCalledTimes(1);
  });

  it('should memoize method calls with arguments', () => {
    const memoizedFunction = jest.fn();

    class TestClass {
      @Memoize()
      memoizeMethod(a: number, b: number) {
        memoizedFunction(a, b);
        return a + b;
      }
    }

    const instance = new TestClass();
    instance.memoizeMethod(3, 4);
    instance.memoizeMethod(3, 4);
    instance.memoizeMethod(3, 4);

    expect(memoizedFunction).toHaveBeenCalledTimes(1);
  });

  it('should memoize method calls with different arguments', () => {
    const memoizedFunction = jest.fn();

    class TestClass {
      @Memoize()
      memoizeMethod(a: number, b: number) {
        memoizedFunction(a, b);
        return a + b;
      }
    }

    const instance = new TestClass();
    instance.memoizeMethod(3, 4);
    instance.memoizeMethod(5, 6);
    instance.memoizeMethod(7, 8);

    expect(memoizedFunction).toHaveBeenCalledTimes(3);
  });

  it('should memoize method calls with different arguments in different orders', () => {
    const memoizedFunction = jest.fn();

    class TestClass {
      @Memoize()
      memoizeMethod(a: number, b: number) {
        memoizedFunction(a, b);
        return a + b;
      }
    }

    const instance = new TestClass();
    instance.memoizeMethod(3, 4);
    instance.memoizeMethod(5, 6);
    instance.memoizeMethod(3, 4);

    expect(memoizedFunction).toHaveBeenCalledTimes(2);
  });

  it('should memoize method calls with different arguments in different orders with multiple calls', () => {
    const memoizedFunction = jest.fn();

    class TestClass {
      @Memoize()
      memoizeMethod(a: number, b: number) {
        memoizedFunction(a, b);
        return a + b;
      }
    }

    const instance = new TestClass();
    instance.memoizeMethod(3, 4);
    instance.memoizeMethod(5, 6);
    instance.memoizeMethod(7, 8);
    instance.memoizeMethod(3, 4);

    expect(memoizedFunction).toHaveBeenCalledTimes(3);
  });

  it('should memoize method calls with different arguments in different orders with multiple calls and multiple items', () => {
    const memoizedFunction = jest.fn();

    class TestClass {
      @Memoize()
      memoizeMethod(a: number, b: number) {
        memoizedFunction(a, b);
        return a + b;
      }
    }

    const instance = new TestClass();
    instance.memoizeMethod(3, 4); // Call 1: [3, 4]
    instance.memoizeMethod(5, 6); // Call 2: [5, 6]
    instance.memoizeMethod(7, 8); // Call 3: [7, 8]
    instance.memoizeMethod(3, 4); // Cached
    instance.memoizeMethod(5, 6); // Cached
    instance.memoizeMethod(7, 8); // Cached
    instance.memoizeMethod(3, 4); // Cached again
    memoizedFunction.mock.calls.forEach((call, index) => {
      console.log(`[Test] Call ${index + 1}:`, call);
    });

    expect(memoizedFunction).toHaveBeenCalledTimes(3);
  });
});
