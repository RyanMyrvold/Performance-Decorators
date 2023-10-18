import { TypeInspector } from '../src/TypeInspector';

describe('TypeInspector', () => {
  describe('getProperties', () => {
    it('should return an array of property names', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = TypeInspector.getProperties(obj);
      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should return an empty array for an empty object', () => {
      const obj = {};
      const result = TypeInspector.getProperties(obj as unknown as object);
      expect(result).toEqual([]);
    });

    it('should return an empty array for null', () => {
      const obj = null;
      const result = TypeInspector.getProperties(obj as unknown as object);
      expect(result).toEqual([]);
    });

    it('should return an empty array for undefined', () => {
      const obj = undefined;
      const result = TypeInspector.getProperties(obj as unknown as object);
      expect(result).toEqual([]);
    });
  });

  describe('hasProperty', () => {
    it('should return true if the object has the property', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = TypeInspector.hasProperty(obj, 'b');
      expect(result).toBe(true);
    });

    it('should return false if the object does not have the property', () => {
      const obj = { a: 1, b: 2, c: 3 };
      const result = TypeInspector.hasProperty(obj as unknown as object, 'd');
      expect(result).toBe(false);
    });

    it('should return false for an empty object', () => {
      const obj = {};
      const result = TypeInspector.hasProperty(obj as unknown as object, 'a');
      expect(result).toBe(false);
    });

    it('should return false for null', () => {
      const obj = null;
      const result = TypeInspector.hasProperty(obj as unknown as object, 'a');
      expect(result).toBe(false);
    });

    it('should return false for undefined', () => {
      const obj = undefined;
      const result = TypeInspector.hasProperty(obj as unknown as object, 'a');
      expect(result).toBe(false); 
    });
  });

  describe('edge cases', () => {
    it('should handle objects with null prototype in getProperties', () => {
      const obj = Object.create(null);
      obj.a = 1;
      obj.b = 2;
      obj.c = 3;
      const result = TypeInspector.getProperties(obj);
      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should handle objects with null prototype in hasProperty', () => {
      const obj = Object.create(null, {
        a: { value: 1 },
        b: { value: 2 },
        c: { value: 3 }
      });
      const result = TypeInspector.hasProperty(obj, 'b');
      expect(result).toBe(true);
    });

    it('should handle objects with non-enumerable properties in getProperties', () => {
      const obj = { a: 1 };
      Object.defineProperty(obj, 'b', { value: 2, enumerable: false });
      const result = TypeInspector.getProperties(obj);
      expect(result).toEqual(['a']);
    });

    it('should handle objects with non-enumerable properties in hasProperty', () => {
      const obj = { a: 1 };
      Object.defineProperty(obj, 'b', { value: 2, enumerable: false });
      const result = TypeInspector.hasProperty(obj, 'b');
      expect(result).toBe(true);
    });

    it('should handle objects with inherited properties in hasProperty', () => {
      const parent = { a: 1 };
      const obj = Object.create(parent, { b: { value: 2 } });
      const result = TypeInspector.hasProperty(obj, 'a');
      expect(result).toBe(true);
    });
  });
});