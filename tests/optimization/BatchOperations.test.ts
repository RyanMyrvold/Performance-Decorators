import { BatchOperations } from "../../src/optimization";

describe("BatchOperations Decorator", () => {
  it("should batch operations", async () => {
    const applyBatchChanges = jest.fn();

    class TestClass {
      @BatchOperations()
      batchMethod(changes: any[]) {
        applyBatchChanges(changes);
      }
    }

    const instance = new TestClass();
    instance.batchMethod([{ item: 1 }]);
    instance.batchMethod([{ item: 2 }]);

    // Wait for the microtask queue to flush
    await new Promise(process.nextTick);

    expect(applyBatchChanges).toHaveBeenCalledTimes(1);
    expect(applyBatchChanges).toHaveBeenCalledWith([
      [{ item: 1 }],
      [{ item: 2 }],
    ]);
  });

  it("should batch operations with multiple calls", async () => {
    const applyBatchChanges = jest.fn();

    class TestClass {
      @BatchOperations()
      batchMethod(changes: any[]) {
        applyBatchChanges(changes);
      }
    }

    const instance = new TestClass();
    instance.batchMethod([{ item: 1 }]);
    instance.batchMethod([{ item: 2 }]);
    instance.batchMethod([{ item: 3 }]);

    // Wait for the microtask queue to flush
    await new Promise(process.nextTick);

    expect(applyBatchChanges).toHaveBeenCalledTimes(1);
    expect(applyBatchChanges).toHaveBeenCalledWith([
      [{ item: 1 }],
      [{ item: 2 }],
      [{ item: 3 }],
    ]);
  });

  it("should batch operations with multiple calls and multiple items", async () => {
    const applyBatchChanges = jest.fn();

    class TestClass {
      @BatchOperations()
      batchMethod(changes: any[]) {
        applyBatchChanges(changes);
      }
    }

    const instance = new TestClass();
    instance.batchMethod([{ item: 1 }, { item: 2 }]);
    instance.batchMethod([{ item: 3 }, { item: 4 }]);
    instance.batchMethod([{ item: 5 }, { item: 6 }]);

    // Wait for the microtask queue to flush
    await new Promise(process.nextTick);

    expect(applyBatchChanges).toHaveBeenCalledTimes(1);
    expect(applyBatchChanges).toHaveBeenCalledWith([
      [{ item: 1 }, { item: 2 }],
      [{ item: 3 }, { item: 4 }],
      [{ item: 5 }, { item: 6 }],
    ]);
  });

  it("should batch operations with multiple calls and multiple items in different orders", async () => {
    const applyBatchChanges = jest.fn();

    class TestClass {
      @BatchOperations()
      batchMethod(changes: any[]) {
        applyBatchChanges(changes);
      }
    }

    const instance = new TestClass();
    instance.batchMethod([{ item: 1 }, { item: 2 }]);
    instance.batchMethod([{ item: 5 }, { item: 6 }]);
    instance.batchMethod([{ item: 3 }, { item: 4 }]);

    // Wait for the microtask queue to flush
    await new Promise(process.nextTick);

    expect(applyBatchChanges).toHaveBeenCalledTimes(1);
    expect(applyBatchChanges).toHaveBeenCalledWith([
      [{ item: 1 }, { item: 2 }],
      [{ item: 5 }, { item: 6 }],
      [{ item: 3 }, { item: 4 }],
    ]);
  });

  it("should batch operations with multiple calls and multiple items in different orders with multiple batches", async () => {
    const applyBatchChanges = jest.fn();

    class TestClass {
      @BatchOperations()
      batchMethod(args: any[]) {
        applyBatchChanges(args);
      }
    }

    const instance = new TestClass();

    // Perform multiple calls with different orders and items
    instance.batchMethod([{ item: 1 }, { item: 2 }]);
    instance.batchMethod([{ item: 5 }, { item: 6 }]);
    instance.batchMethod([{ item: 3 }, { item: 4 }]);

    await new Promise(process.nextTick);

    instance.batchMethod([{ item: 7 }, { item: 8 }]);

    await new Promise(process.nextTick);

    expect(applyBatchChanges).toHaveBeenCalledTimes(2);
    expect(applyBatchChanges).toHaveBeenNthCalledWith(1, [
      [{ item: 1 }, { item: 2 }],
      [{ item: 5 }, { item: 6 }],
      [{ item: 3 }, { item: 4 }],
    ]);
    expect(applyBatchChanges).toHaveBeenNthCalledWith(2, [
      [{ item: 7 }, { item: 8 }],
    ]);
  });

  it("should batch operations with multiple calls and multiple items in different orders with multiple batches and additional calls", async () => {
    const applyBatchChanges = jest.fn();

    class TestClass {
      @BatchOperations()
      batchMethod(args: any[]) {
        applyBatchChanges(args);
      }
    }

    const instance = new TestClass();

    // Perform multiple calls with different orders and items
    instance.batchMethod([{ item: 1 }, { item: 2 }]);
    instance.batchMethod([{ item: 5 }, { item: 6 }]);
    instance.batchMethod([{ item: 3 }, { item: 4 }]);

    await new Promise(process.nextTick);

    instance.batchMethod([{ item: 7 }, { item: 8 }]);

    await new Promise(process.nextTick);

    instance.batchMethod([{ item: 9 }, { item: 10 }]);
    instance.batchMethod([{ item: 11 }, { item: 12 }]);

    await new Promise(process.nextTick);

    expect(applyBatchChanges).toHaveBeenCalledTimes(3);
    expect(applyBatchChanges).toHaveBeenNthCalledWith(1, [
      [{ item: 1 }, { item: 2 }],
      [{ item: 5 }, { item: 6 }],
      [{ item: 3 }, { item: 4 }],
    ]);
    expect(applyBatchChanges).toHaveBeenNthCalledWith(2, [
      [{ item: 7 }, { item: 8 }],
    ]);
    expect(applyBatchChanges).toHaveBeenNthCalledWith(3, [
      [{ item: 9 }, { item: 10 }],
      [{ item: 11 }, { item: 12 }],
    ]);
  });

  it("should batch operations with multiple calls and multiple items in different orders with multiple batches and additional calls in reverse order", async () => {
    const applyBatchChanges = jest.fn();

    class TestClass {
      @BatchOperations()
      batchMethod(args: any[]) {
        applyBatchChanges(args);
      }
    }

    const instance = new TestClass();

    // Perform multiple calls with different orders and items
    instance.batchMethod([{ item: 1 }, { item: 2 }]);
    instance.batchMethod([{ item: 5 }, { item: 6 }]);
    instance.batchMethod([{ item: 3 }, { item: 4 }]);

    await new Promise(process.nextTick);

    instance.batchMethod([{ item: 7 }, { item: 8 }]);

    await new Promise(process.nextTick);

    instance.batchMethod([{ item: 12 }, { item: 11 }]);
    instance.batchMethod([{ item: 10 }, { item: 9 }]);

    await new Promise(process.nextTick);

    expect(applyBatchChanges).toHaveBeenCalledTimes(3);
    expect(applyBatchChanges).toHaveBeenNthCalledWith(1, [
      [{ item: 1 }, { item: 2 }],
      [{ item: 5 }, { item: 6 }],
      [{ item: 3 }, { item: 4 }],
    ]);
    expect(applyBatchChanges).toHaveBeenNthCalledWith(2, [
      [{ item: 7 }, { item: 8 }],
    ]);
    expect(applyBatchChanges).toHaveBeenNthCalledWith(3, [
      [{ item: 12 }, { item: 11 }],
      [{ item: 10 }, { item: 9 }],
    ]);
  });

  it("should throw an error for non-method declarations", () => {
    expect(() => {
      class InvalidTestClass {
        @BatchOperations()
        get invalidProperty(): void {
          return;
        }
      }
    }).toThrow(
      "🐞 [Batch Operations] Can only be applied to method declarations."
    );
  });
});
