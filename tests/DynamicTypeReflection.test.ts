import { DynamicTypeReflection } from "../src/DynamicTypeReflection";

describe('DynamicTypeReflection', () => {

    describe('Type Registration', () => {

        it('registers and validates a type definition', () => {
            const testType = { prop: 'string' };
            DynamicTypeReflection.registerType(testType);
            expect(DynamicTypeReflection.hasValidDefinition(testType)).toBe(true);
        });

        it('returns false for unregistered type definitions', () => {
            const unregisteredType = { item: 'string' };
            expect(DynamicTypeReflection.hasValidDefinition(unregisteredType)).toBe(false);
        });

    });

    describe('Type Property Retrieval', () => {

        it('retrieves properties of a registered type', () => {
            const type = { name: 'string', age: 'number' };
            
            DynamicTypeReflection.registerType(type);
            
            const properties = DynamicTypeReflection.getProperties(type);
            expect(properties).toEqual(['name', 'age']);
        });

    });

});
