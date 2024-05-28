import { serializeArguments } from "../../src/utilities/FunctionUtilities";

describe('serializeArguments', () => {
  it('should serialize arguments correctly', () => {
    const args = [1, 'test', { key: 'value' }];
    const result = serializeArguments(args);
    expect(result).toBe('[1,"test",{"key":"value"}]');
  });

  it('should handle functions in arguments', () => {
    const args = [function testFunc() {}];
    const result = serializeArguments(args);
    expect(result).toBe('["Function:testFunc"]');
  });

  it('should throw an error for circular references', () => {
    const obj: any = {};
    obj.self = obj;
    expect(() => serializeArguments([obj])).toThrow(
      "Failed to serialize arguments for memoization."
    );
  });
});
