import { TypeCoercer } from '../src/TypeCoercer';

describe('TypeCoercer', () => {

  describe('coerce', () => {
    it('should coerce string to number', () => {
      const result = TypeCoercer.coerce("123", 'number');
      expect(result).toBe(123);
    });

    it('should coerce string to boolean', () => {
      const result = TypeCoercer.coerce("true", 'boolean');
      expect(result).toBe(true);
    });

    it('should return null when coercion fails', () => {
      const result = TypeCoercer.coerce("not_a_number", 'number');
      expect(result).toBeNull();
    });

    it('should handle empty strings correctly for number', () => {
      const result = TypeCoercer.coerce("", 'number');
      expect(result).toBeNull();
    });
  });

  describe('coerceObject', () => {
    it('should handle simple objects', async () => {
      const obj = { age: '25', name: 'John' };
      const constraints = { age: 'number', name: 'string' };
      const result = await TypeCoercer.coerceObject(obj, constraints);
      expect(result).toEqual({ age: 25, name: 'John' });
    });

    it('should handle null object', async () => {
      const result = await TypeCoercer.coerceObject(null, {});
      expect(result).toBeNull();
    });

    it('should handle undefined object', async () => {
      const result = await TypeCoercer.coerceObject(undefined, {});
      expect(result).toBeUndefined();
    });

    it('should handle nested objects', async () => {
      const obj = { info: { age: '25' } };
      const constraints = { info: { age: 'number' } };
      const result = await TypeCoercer.coerceObject(obj, constraints);
      expect(result).toEqual({ info: { age: 25 } });
    });

    it('should handle arrays', async () => {
      const obj = { ages: ['25', '35'] };
      const constraints = { ages: ['number'] };
      const result = await TypeCoercer.coerceObject(obj, constraints);
      expect(result).toEqual({ ages: [25, 35] });
    });

    it('should handle nested arrays in object', async () => {
        const obj = { ages: [['25', '35'], ['45', '55']] };
        const constraints = { ages: [['number']] };
        const result = await TypeCoercer.coerceObject(obj, constraints);
        expect(result).toEqual({ ages: [[25, 35], [45, 55]] });
    });
  });

});
