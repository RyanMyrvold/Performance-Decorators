import { ThirdPartyTypeWrapper } from "../src/ThirdPartyTypeWrapper";

describe('ThirdPartyTypeWrapper', () => {

    describe('Property Access', () => {

        it('wraps and accesses properties safely', () => {
            const dummyLib = { method: () => 'Hello' };
            const wrappedLib = ThirdPartyTypeWrapper.wrapWithProxy(dummyLib);
    
            expect(wrappedLib.method()).toBe('Hello');
        });

        it('throws an error when accessing non-existent properties', () => {
            const dummyLib = { method: () => 'Hello' };
            const wrappedLib = ThirdPartyTypeWrapper.wrapWithProxy(dummyLib);
    
            expect(() => wrappedLib.nonexistentMethod()).toThrowError("Access to property nonexistentMethod is not allowed for type safety.");
        });

        it('allows accessing pre-existing properties', () => {
            const dummyLib = { existingProp: 'test' };
            const wrappedLib = ThirdPartyTypeWrapper.wrapWithProxy(dummyLib);

            expect(wrappedLib.existingProp).toBe('test');
        });

    });

    describe('Property Modification', () => {

        it('throws an error when setting unauthorized properties', () => {
            const dummyLib = { method: () => 'Hello' };
            const wrappedLib = ThirdPartyTypeWrapper.wrapWithProxy(dummyLib);
    
            expect(() => wrappedLib.newProp = 'test').toThrowError("Setting new property newProp is not allowed for type safety.");
        });

        it('allows modifying pre-existing properties', () => {
            const dummyLib = { existingProp: 'test' };
            const wrappedLib = ThirdPartyTypeWrapper.wrapWithProxy(dummyLib);

            wrappedLib.existingProp = 'new value';
            expect(wrappedLib.existingProp).toBe('new value');
        });

    });

    describe('Property Deletion', () => {

        it('throws an error when attempting to delete properties', () => {
            const dummyLib = { existingProp: 'test' };
            const wrappedLib = ThirdPartyTypeWrapper.wrapWithProxy(dummyLib);

            expect(() => delete wrappedLib.existingProp).toThrowError("Cannot delete property existingProp from the wrapped library.");
        });

    });

});
