import { Memoize } from "../../src/optimization/Memoize";

describe("Memoize Decorator", () => {
  class TestClassA {
    callCount = 0;

    @Memoize()
    computeExpensiveResult(a: number, b: number): number {
      this.callCount++;
      return a + b;
    }
  }

  let instance: TestClassA;

  beforeEach(() => {
    instance = new TestClassA();
  });

  test("should cache the result for repeated arguments", () => {
    const firstResult = instance.computeExpensiveResult(3, 4);
    const secondResult = instance.computeExpensiveResult(3, 4);

    expect(firstResult).toBe(7);
    expect(secondResult).toBe(7);
    expect(instance.callCount).toBe(1);
  });

  test("should compute the result again for different arguments", () => {
    const resultA = instance.computeExpensiveResult(3, 4);
    const resultB = instance.computeExpensiveResult(5, 6);

    expect(resultA).toBe(7);
    expect(resultB).toBe(11);
    expect(instance.callCount).toBe(2);
  });

  test("should not share cache across instances", () => {
    const instanceA = new TestClassA();
    const instanceB = new TestClassA();

    const resultA = instanceA.computeExpensiveResult(3, 4);
    const resultB = instanceB.computeExpensiveResult(3, 4);

    expect(resultA).toBe(7);
    expect(resultB).toBe(7);
    expect(instanceA.callCount).toBe(1);
    expect(instanceB.callCount).toBe(1);
  });

  it("should memoize method calls", () => {
    const memoizedFunction = jest.fn();

    class TestClassB {
      @Memoize()
      memoizeMethod(): void {
        memoizedFunction();
      }
    }

    const obj = new TestClassB();
    obj.memoizeMethod();
    obj.memoizeMethod();
    obj.memoizeMethod();

    expect(memoizedFunction).toHaveBeenCalledTimes(1);
  });

  it("should memoize method calls with arguments", () => {
    const memoizedFunction = jest.fn();

    class TestClassC {
      @Memoize()
      memoizeMethod(a: number, b: number): number {
        memoizedFunction(a, b);
        return a + b;
      }
    }

    const obj = new TestClassC();
    obj.memoizeMethod(3, 4);
    obj.memoizeMethod(3, 4);
    obj.memoizeMethod(3, 4);

    expect(memoizedFunction).toHaveBeenCalledTimes(1);
  });

  it("should memoize different argument pairs separately", () => {
    const memoizedFunction = jest.fn();

    class TestClassD {
      @Memoize()
      memoizeMethod(a: number, b: number): number {
        memoizedFunction(a, b);
        return a + b;
      }
    }

    const obj = new TestClassD();
    obj.memoizeMethod(3, 4);
    obj.memoizeMethod(5, 6);
    obj.memoizeMethod(7, 8);

    expect(memoizedFunction).toHaveBeenCalledTimes(3);
  });

  it("should reuse cache after interleaving calls", () => {
    const memoizedFunction = jest.fn();

    class TestClassE {
      @Memoize()
      memoizeMethod(a: number, b: number): number {
        memoizedFunction(a, b);
        return a + b;
      }
    }

    const obj = new TestClassE();
    obj.memoizeMethod(3, 4); // compute
    obj.memoizeMethod(5, 6); // compute
    obj.memoizeMethod(3, 4); // cached

    expect(memoizedFunction).toHaveBeenCalledTimes(2);
  });

  it("should cache multiple distinct keys and hit on repeats", () => {
    const memoizedFunction = jest.fn();

    class TestClassF {
      @Memoize()
      memoizeMethod(a: number, b: number): number {
        memoizedFunction(a, b);
        return a + b;
      }
    }

    const obj = new TestClassF();
    obj.memoizeMethod(3, 4); // compute
    obj.memoizeMethod(5, 6); // compute
    obj.memoizeMethod(7, 8); // compute
    obj.memoizeMethod(3, 4); // cached
    obj.memoizeMethod(5, 6); // cached
    obj.memoizeMethod(7, 8); // cached
    obj.memoizeMethod(3, 4); // cached again

    // Optional: debug calls
    // memoizedFunction.mock.calls.forEach((call, idx) => console.log(`[Test] Call ${idx + 1}:`, call));

    expect(memoizedFunction).toHaveBeenCalledTimes(3);
  });
});
