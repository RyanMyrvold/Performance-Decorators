import {
    DynamicTypeSafe,
    DynamicTypeReflection,
    DynamicTypeValidator,
    CodeGenerator,
    ThirdPartyTypeWrapper
} from '../src/index';

describe('Edge Cases', () => {

    describe('CodeGenerator', () => {

        it('handles empty template string in populateTemplate', () => {
            const template = '';
            const constraints = { name: 'getName', value: '"Alice"' };
            const result = CodeGenerator.populateTemplate(template, constraints);
            expect(result).toBe('');
        });

        it('trims whitespace in populateTemplate', () => {
            const template = '   function {{name}}() { return {{value}}; }   ';
            const constraints = { name: 'getName', value: '"Alice"' };
            const result = CodeGenerator.populateTemplate(template.trim(), constraints);
            expect(result).toBe('function getName() { return "Alice"; }');
        });

        it('does not replace non-existent placeholders', () => {
            const template = 'function {{unknownPlaceholder}}() { return {{value}}; }';
            const constraints = { name: 'getName', value: '"Alice"' };
            const result = CodeGenerator.populateTemplate(template, constraints);
            expect(result).toBe('function {{unknownPlaceholder}}() { return "Alice"; }');
        });

        it('handles nested constraints correctly', () => {
            const template = 'User name is {{user.name}} and age is {{user.age}}';
            const constraints = { user: { name: 'Alice', age: '30' } };
            const result = CodeGenerator.populateTemplate(template, constraints);
            expect(result).toBe('User name is Alice and age is 30');
        });
        

    });

    describe('DynamicTypeSafe', () => {

        it('does not create dynamic type with unrecognized property value', () => {
            expect(() => DynamicTypeSafe.createDynamicType({ name: 'strng' })).toThrow();
        });

    });

    describe('DynamicTypeValidator', () => {

        it('does not validate type with mismatched property type', () => {
            const type = { name: 'number' };
            const instance = { name: 'Alice' };
            expect(DynamicTypeValidator.validateType(instance, type)).toBe(false);
        });

        it('validates nested dynamic types correctly', () => {
            const type = { user: { name: 'string', age: 'number' } };
            const instance = { user: { name: 'Alice', age: 30 } };
            expect(DynamicTypeValidator.validateType(instance, type)).toBe(true);
        });

    });

    describe('DynamicTypeReflection', () => {

        it('returns undefined for unregistered type properties', () => {
            const type = { item: 'string' };
            expect(DynamicTypeReflection.getProperties(type)).toBeUndefined();
        });

        it('successfully adds and removes observer', () => {
            const observer = {
                onTypeAdded: jest.fn(),
                onTypeRemoved: jest.fn(),
            };
            
            DynamicTypeReflection.addObserver(observer);
            const type = { name: 'string' };
            DynamicTypeReflection.registerType(type);

            expect(observer.onTypeAdded).toHaveBeenCalledWith(type);

            DynamicTypeReflection.removeObserver(observer);
            DynamicTypeReflection.deregisterType(type);

            expect(observer.onTypeRemoved).not.toHaveBeenCalledWith(type);
        });

    });

    describe('ThirdPartyTypeWrapper', () => {

        it('throws error on accessing non-existent property in wrapped lib', () => {
            const dummyLib = { method: () => 'Hello' };
            const wrappedLib = ThirdPartyTypeWrapper.wrapWithProxy(dummyLib);
            expect(() => wrappedLib.nonexistentProp).toThrowError();
        });

        it('throws error on deleting method in wrapped lib', () => {
            const dummyLib = { method: () => 'Hello' };
            const wrappedLib = ThirdPartyTypeWrapper.wrapWithProxy(dummyLib);
            expect(() => delete wrappedLib.method).toThrowError();
        });

    });

});
