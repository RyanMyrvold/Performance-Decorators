import BatchOperations from "../../src/optimization/BatchOperations";


class Renderer {
  public batchedChanges: any[][] = [];

  @BatchOperations()
  render(changes: any[]) {
    this.batchedChanges.push(changes);  // Store the batched changes for verification
  }
}

describe('BatchOperations Decorator', () => {
  let renderer: Renderer;

  beforeEach(() => {
    renderer = new Renderer();
  });

  it('should batch multiple calls into a single operation', async () => {
    // Simulate rapid consecutive calls
    renderer.render([{ item: 'item1' }]);
    renderer.render([{ item: 'item2' }]);
    renderer.render([{ item: 'item3' }]);

    // Ensure the microtask queue is flushed
    await new Promise(process.nextTick);

    // There should be one batched call with all changes
    expect(renderer.batchedChanges.length).toBe(1);
    expect(renderer.batchedChanges[0]).toEqual([
      [{ item: 'item1' }],
      [{ item: 'item2' }],
      [{ item: 'item3' }]
    ]);
  });

  it('should process separate batches of operations separately', async () => {
    // First batch of operations
    renderer.render([{ item: 'item1' }]);
    renderer.render([{ item: 'item2' }]);

    // Flush the microtask queue to process the first batch
    await new Promise(process.nextTick);

    // Second batch of operations
    renderer.render([{ item: 'item3' }]);
    renderer.render([{ item: 'item4' }]);

    // Flush the microtask queue again to process the second batch
    await new Promise(process.nextTick);

    // Check that we have two separate batched calls
    expect(renderer.batchedChanges.length).toBe(2);
    expect(renderer.batchedChanges[0]).toEqual([
      [{ item: 'item1' }],
      [{ item: 'item2' }]
    ]);
    expect(renderer.batchedChanges[1]).toEqual([
      [{ item: 'item3' }],
      [{ item: 'item4' }]
    ]);
  });

  it('should handle empty batches correctly', async () => {
    // No operations are called

    // Flush the microtask queue
    await new Promise(process.nextTick);

    // No batched changes should be recorded
    expect(renderer.batchedChanges.length).toBe(0);
  });
});
