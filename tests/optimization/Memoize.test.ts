import Memoize from "../../src/optimization/Memoize";


describe('Memoize Decorator', () => {
  // A class to apply Memoize to its methods
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
    // Call the method with the same arguments twice
    const firstResult = instance.computeExpensiveResult(3, 4);
    const secondResult = instance.computeExpensiveResult(3, 4);

    // Expect the result to be the same
    expect(firstResult).toBe(7);
    expect(secondResult).toBe(7);

    // Expect the method to be called only once since the second call should be cached
    expect(instance.callCount).toBe(1);
  });

  test('should compute the result again for different arguments', () => {
    // Call the method with different arguments
    const resultA = instance.computeExpensiveResult(3, 4);
    const resultB = instance.computeExpensiveResult(5, 6);

    // Expect the results to be correct
    expect(resultA).toBe(7);
    expect(resultB).toBe(11);

    // Expect the method to be called twice, once for each set of arguments
    expect(instance.callCount).toBe(2);
  });

  test('should not share cache across instances', () => {
    const instanceA = new TestClass();
    const instanceB = new TestClass();

    // Call the method on both instances
    const resultA = instanceA.computeExpensiveResult(3, 4);
    const resultB = instanceB.computeExpensiveResult(3, 4);

    // Expect the results to be the same
    expect(resultA).toBe(7);
    expect(resultB).toBe(7);

    // Expect each instance to have its own call count
    expect(instanceA.callCount).toBe(1);
    expect(instanceB.callCount).toBe(1);
  });
});
