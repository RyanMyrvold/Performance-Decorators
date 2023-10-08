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

    });

    describe('DynamicTypeReflection', () => {

        it('returns undefined for unregistered type properties', () => {
            const type = { item: 'string' };
            expect(DynamicTypeReflection.getProperties(type)).toBeUndefined();
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
