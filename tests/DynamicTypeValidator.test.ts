import { DynamicTypeValidator } from "../src/DynamicTypeValidator";

describe('DynamicTypeValidator', () => {

    describe('Validation', () => {

        const baseType = { name: 'string', age: 'number' };

        it('rejects instances with missing properties', () => {
            const instanceWithMissingProps = { name: 'Alice' };
            expect(DynamicTypeValidator.validateType(instanceWithMissingProps, baseType)).toBe(false);
        });

        it('rejects instances with extra properties', () => {
            const instanceWithExtraProps = { name: 'Alice', age: 30, height: 160 };
            expect(DynamicTypeValidator.validateType(instanceWithExtraProps, baseType)).toBe(false);
        });

        it('accepts instances that match the type', () => {
            const validInstance = { name: 'Alice', age: 30 };
            expect(DynamicTypeValidator.validateType(validInstance, baseType)).toBe(true);
        });

    });

});
