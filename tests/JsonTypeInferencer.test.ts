import { JsonTypeInferencer } from '../src/JsonTypeInferencer'; // Adjust the import path
import { InferableType } from '../src/InferableType'; // Adjust the import path

describe('JsonTypeInferencer', () => {
    it('should infer null types', () => {
        const result = JsonTypeInferencer.infer(null);
        expect(result.type).toBe(InferableType.Null);
    });

    it('should infer boolean types', () => {
        const result = JsonTypeInferencer.infer(true);
        expect(result.type).toBe(InferableType.Boolean);
    });

    it('should infer number types', () => {
        const result = JsonTypeInferencer.infer(42);
        expect(result.type).toBe(InferableType.Number);
    });

    it('should infer string types', () => {
        const result = JsonTypeInferencer.infer("hello");
        expect(result.type).toBe(InferableType.String);
    });

    it('should infer array types', () => {
        const result = JsonTypeInferencer.infer([1, 2, 3]);
        expect(result.type).toBe(InferableType.Array);
    });

    it('should infer object types', () => {
        const result = JsonTypeInferencer.infer({ a: 1 });
        expect(result.type).toBe(InferableType.Object);
    });

    it('should infer nested object types', () => {
        const result = JsonTypeInferencer.inferNestedTypes({ a: { b: 1 } });

        console.log('Full Result:', JSON.stringify(result, null, 2));
      
        console.log('InferableType Enum:', JSON.stringify(InferableType, null, 2));
      
        expect(result.type).toBe(InferableType.NestedObject);
        console.log('Received type:', result?.properties?.a?.type);
        expect(result?.properties?.a?.type).toBe(InferableType.Object);
    });

    it('should infer nested array types', () => {
        const result = JsonTypeInferencer.inferNestedTypes([[1, 2], [3, 4]]);
        expect(result.type).toBe(InferableType.NestedArray);
    });

    it('should handle empty arrays', () => {
        const result = JsonTypeInferencer.infer([]);
        expect(result.type).toBe(InferableType.Array);
    });

    it('should handle empty objects', () => {
        const result = JsonTypeInferencer.infer({});
        expect(result.type).toBe(InferableType.Object);
    });

    it('should handle undefined types', () => {
        const result = JsonTypeInferencer.infer(undefined);
        expect(result.type).toBe(InferableType.Unknown);
    });

    it('should handle complex nested objects', () => {
        const result = JsonTypeInferencer.inferNestedTypes({
            a: 1,
            b: [2, 3],
            c: { d: "hello" },
        });
        expect(result.type).toBe(InferableType.NestedObject);
    });

    it('should handle complex nested arrays', () => {
        const result = JsonTypeInferencer.inferNestedTypes([[1, "a"], [true, null]]);
        expect(result.type).toBe(InferableType.NestedArray);
    });

    it('should infer types for array of objects', () => {
        const result = JsonTypeInferencer.inferNestedTypes([{ a: 1 }, { b: 2 }]);
        expect(result.type).toBe(InferableType.NestedArray);
    });

    it('should infer types for object with arrays', () => {
        const result = JsonTypeInferencer.inferNestedTypes({ a: [1, 2], b: [true, false] });
        expect(result.type).toBe(InferableType.NestedObject);
    });

    it('should infer types for mixed array', () => {
        const result = JsonTypeInferencer.inferNestedTypes([1, "a", true, null]);
        expect(result.type).toBe(InferableType.NestedArray);
    });

    it('should handle multiple nested arrays', () => {
        const result = JsonTypeInferencer.inferNestedTypes([[[1, 2], ["a", "b"]], [[true, false], [null, null]]]);
        expect(result.type).toBe(InferableType.NestedArray);
    });

    it('should handle multiple nested objects', () => {
        const result = JsonTypeInferencer.inferNestedTypes({
            a: { b: { c: 1 } },
            x: { y: { z: "hello" } },
        });
        expect(result.type).toBe(InferableType.NestedObject);
    });

    it('should infer unknown for functions', () => {
        const result = JsonTypeInferencer.infer(() => { });
        expect(result.type).toBe(InferableType.Unknown);
    });

    it('should infer unknown for Symbols', () => {
        const result = JsonTypeInferencer.infer(Symbol('test'));
        expect(result.type).toBe(InferableType.Unknown);
    });
});

