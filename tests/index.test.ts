// DynamicTypeSafe.test.ts
import {
    DynamicTypeSafe,
    DynamicTypeReflection,
    DynamicTypeValidator,
    CodeGenerator,
    ThirdPartyTypeWrapper
} from '../src/index';

describe('DynamicTypeSafe', () => {

    // Tests for the main DynamicTypeSafe class
    describe('Core', () => {
        it('should create a dynamic type', () => {
            const dynamicType = DynamicTypeSafe.createDynamicType({ name: 'string', age: 'number' });
            const instance = new dynamicType();
            expect(instance.name).toBe(null);
            expect(instance.age).toBe(null);
        });

        it('should initialize dynamic type with multiple properties to null', () => {
            const dynamicType = DynamicTypeSafe.createDynamicType({ prop1: 'string', prop2: 'number', prop3: 'boolean' });
            const instance = new dynamicType();
            expect(instance.prop1).toBe(null);
            expect(instance.prop2).toBe(null);
            expect(instance.prop3).toBe(null);
        });

        it('should not accept invalid type descriptors', () => {
            expect(() => DynamicTypeSafe.createDynamicType({ name: 'strng' })).toThrow();
        });
    });

    // Tests for the DynamicTypeValidator utility
    describe('DynamicTypeValidator', () => {
        it('should not validate types with missing properties', () => {
            const type = { name: 'string', age: 'number' };
            const instance = { name: 'Alice' }; // missing age
            expect(DynamicTypeValidator.validateType(instance, type)).toBe(false);
        });
        it('should not validate types with extra properties', () => {
            const type = { name: 'string' };
            const instance = { name: 'Alice', age: 30 }; // extra age property
            expect(DynamicTypeValidator.validateType(instance, type)).toBe(false);
        });
        it('should validate types', () => {
            const type = { name: 'string', age: 'number' };
            const instance = { name: 'Alice', age: 30 };
            expect(DynamicTypeValidator.validateType(instance, type)).toBe(true);
        });
    });

    // Tests for the CodeGenerator utility
    describe('CodeGenerator', () => {
        it('should generate code with type constraints', () => {
            const template = 'function {{name}}() { return {{value}}; }';
            const constraints = { name: 'getName', value: '"Alice"' };
            const generatedCode = CodeGenerator.generateCode(template, constraints);
            expect(generatedCode).toBe('function getName() { return "Alice"; }');
        });
        it('should generate code even with missing constraints', () => {
            const template = 'function {{name}}() { return {{value}}; }';
            const constraints = { name: 'getName' }; // missing value
            const generatedCode = CodeGenerator.generateCode(template, constraints);
            expect(generatedCode).toBe('function getName() { return {{value}}; }');
        });
    });

    // Tests for the DynamicTypeReflection utility
    describe('DynamicTypeReflection', () => {

        it('should register and validate a type definition', () => {
            const testType = { prop: 'string' };
            DynamicTypeReflection.registerType(testType);
            expect(DynamicTypeReflection.hasValidDefinition(testType)).toBe(true);
        });
        it('should return false for unregistered type definitions', () => {
            const unregisteredType = { item: 'string' };
            expect(DynamicTypeReflection.hasValidDefinition(unregisteredType)).toBe(false);
        });

        it('should retrieve properties of a type', () => {
            const type = { name: 'string', age: 'number' };
            const properties = DynamicTypeReflection.getProperties(type);
            expect(properties).toEqual(['name', 'age']);
        });
    });
    // Tests for the ThirdPartyTypeWrapper utility
    describe('ThirdPartyTypeWrapper', () => {

        it('should wrap and access properties safely', () => {
            const dummyLib = { method: () => 'Hello' };
            const wrappedLib = ThirdPartyTypeWrapper.wrapWithProxy(dummyLib);

            expect(wrappedLib.method()).toBe('Hello');

            expect(() => wrappedLib.nonexistentMethod()).toThrowError();
        });
        it('should throw an error when setting unauthorized properties', () => {
            const dummyLib = { method: () => 'Hello' };
            const wrappedLib = ThirdPartyTypeWrapper.wrapWithProxy(dummyLib);

            expect(() => wrappedLib.newProp = 'test').toThrowError();
        });
    });
});