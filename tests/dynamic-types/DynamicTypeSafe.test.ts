import { DynamicTypeSafe } from "../../src/DynamicTypeSafe";

describe('DynamicTypeSafe', () => {

    describe('Type Creation', () => {

        it('creates a dynamic type with properties initialized to null', () => {
            const dynamicType = DynamicTypeSafe.createDynamicType({ name: 'string', age: 'number' });
            const instance = new dynamicType();
            expect(instance.name).toBe(null);
            expect(instance.age).toBe(null);
        });

        it('creates a dynamic type with multiple properties initialized to null', () => {
            const dynamicType = DynamicTypeSafe.createDynamicType({ prop1: 'string', prop2: 'number', prop3: 'boolean' });
            const instance = new dynamicType();
            expect(instance.prop1).toBe(null);
            expect(instance.prop2).toBe(null);
            expect(instance.prop3).toBe(null);
        });

    });

    describe('Type Validation', () => {
        
        it('rejects invalid type descriptors', () => {
            expect(() => DynamicTypeSafe.createDynamicType({ name: 'strng' })).toThrow();
        });
        
    });

});
