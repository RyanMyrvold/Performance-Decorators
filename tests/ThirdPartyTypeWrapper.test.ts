import { ThirdPartyTypeWrapper } from "../src/ThirdPartyTypeWrapper";

describe('ThirdPartyTypeWrapper', () => {

    describe('Property Access', () => {

        it('wraps and accesses properties safely', () => {
            const dummyLib = { method: () => 'Hello' };
            const wrappedLib = ThirdPartyTypeWrapper.wrapWithProxy(dummyLib);
    
            expect(wrappedLib.method()).toBe('Hello');
            expect(() => wrappedLib.nonexistentMethod()).toThrowError();
        });

    });

    describe('Property Modification', () => {

        it('throws an error when setting unauthorized properties', () => {
            const dummyLib = { method: () => 'Hello' };
            const wrappedLib = ThirdPartyTypeWrapper.wrapWithProxy(dummyLib);
    
            expect(() => wrappedLib.newProp = 'test').toThrowError();
        });

    });

});
