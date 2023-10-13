import { DynamicTypeReflection, TypeObserver } from "../src/DynamicTypeReflection";

describe('DynamicTypeReflection', () => {

    afterEach(() => {
        // Cleanup: Ensure types are cleared after each test for isolation
        const types = [...DynamicTypeReflection['registeredTypes']];
        for (const type of types) {
            DynamicTypeReflection.deregisterType(type);
        }
    });

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

        it('notifies observers when a type is registered', () => {
            const observerMock = { onTypeRegistered: jest.fn() } as unknown as TypeObserver;
            DynamicTypeReflection.addObserver(observerMock);

            const testType = { prop: 'string' };
            DynamicTypeReflection.registerType(testType);

            expect(observerMock.onTypeRegistered).toHaveBeenCalledWith(testType);
        });

        it('notifies observers when a type is deregistered', () => {
            const observerMock = { onTypeDeregistered: jest.fn() };

            const testType = { prop: 'string' };
            DynamicTypeReflection.registerType(testType);

            DynamicTypeReflection.addObserver(observerMock);
            DynamicTypeReflection.deregisterType(testType);

            expect(observerMock.onTypeDeregistered).toHaveBeenCalledWith(testType);
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
