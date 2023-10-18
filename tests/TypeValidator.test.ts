import { TypeValidator } from '../src/TypeValidator';

describe('TypeValidator', () => {
  describe('validateObject', () => {
    it('should return true when object matches the constraint', () => {
      const object = { key1: 'value1', key2: 42 };
      const constraint = { key1: 'string', key2: 'number' };
      expect(TypeValidator.validateObject(object, constraint)).toBe(true);
    });

    it('should return false when object does not have all the keys', () => {
      const object = { key1: 'value1' };
      const constraint = { key1: 'string', key2: 'number' };
      expect(TypeValidator.validateObject(object, constraint)).toBe(false);
    });

    it('should return false when object has all keys but types do not match', () => {
      const object = { key1: 'value1', key2: 'not a number' };
      const constraint = { key1: 'string', key2: 'number' };
      expect(TypeValidator.validateObject(object, constraint)).toBe(false);
    });

    it('should return true when constraint is empty but object is not', () => {
      const object = { key1: 'value1' };
      const constraint = {};
      expect(TypeValidator.validateObject(object, constraint)).toBe(true);
    });

    it('should return true when both object and constraint are empty', () => {
      const object = {};
      const constraint = {};
      expect(TypeValidator.validateObject(object, constraint)).toBe(true);
    });

    it('should return false when object is null or undefined', () => {
      const constraint = { key1: 'string' };
      expect(TypeValidator.validateObject(null, constraint)).toBe(false);
      expect(TypeValidator.validateObject(undefined, constraint)).toBe(false);
    });

    // Test for additional keys in object
    it('should return true when object has additional keys', () => {
      const object = { key1: 'value1', key2: 42, key3: 'extra' };
      const constraint = { key1: 'string', key2: 'number' };
      expect(TypeValidator.validateObject(object, constraint)).toBe(true);
    });

    // Test for nested objects
    it('should return false for nested objects', () => {
      const object = { key1: 'value1', key2: { innerKey: 42 } };
      const constraint = { key1: 'string', key2: 'number' };
      expect(TypeValidator.validateObject(object, constraint)).toBe(false);
    });

    // Test for array types
    it('should handle array types', () => {
      const object = { key1: ['value1', 'value2'] };
      const constraint = { key1: 'object' }; // Arrays are objects in JS
      expect(TypeValidator.validateObject(object, constraint)).toBe(true);
    });

    // Test for function types
    it('should handle function types', () => {
      const object = { key1: () => { } };
      const constraint = { key1: 'function' };
      expect(TypeValidator.validateObject(object, constraint)).toBe(true);
    });

    // Test for boolean types
    it('should handle boolean types', () => {
      const object = { key1: true };
      const constraint = { key1: 'boolean' };
      expect(TypeValidator.validateObject(object, constraint)).toBe(true);
    });

    // Test for symbol types
    it('should handle symbol types', () => {
      const object = { key1: Symbol() };
      const constraint = { key1: 'symbol' };
      expect(TypeValidator.validateObject(object, constraint)).toBe(true);
    });

    // Test for BigInt types
    it('should handle BigInt types', () => {
      const object = { key1: BigInt(9007199254740991) };
      const constraint = { key1: 'bigint' };
      expect(TypeValidator.validateObject(object, constraint)).toBe(true);
    });

    // Test for undefined in object but not in constraint
    it('should return false when object has undefined values not in constraint', () => {
      const object = { key1: undefined };
      const constraint = { key1: 'string' };
      expect(TypeValidator.validateObject(object, constraint)).toBe(false);
    });

    // Test for null in object but not in constraint
    it('should return false when object has null values not in constraint', () => {
      const object = { key1: null };
      const constraint = { key1: 'string' };
      expect(TypeValidator.validateObject(object, constraint)).toBe(false);
    });

    // Test for constraint with 'object' type
    it('should return true when object has nested object matching the constraint', () => {
      const object = { key1: { innerKey: 'value' } };
      const constraint = { key1: 'object' };
      expect(TypeValidator.validateObject(object, constraint)).toBe(true);
    });
  });
});
