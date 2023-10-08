export type TypeConstraint = Record<string, string | string[] | number | boolean | object>;

/**
 * Provides reflection capabilities for dynamic types.
 */
export class DynamicTypeReflection {
    private static registeredTypes: Set<any> = new Set(); // A set to keep track of registered types

    /**
     * Registers a type with the runtime system.
     * @param type The type to be registered.
     */
    static registerType(type: any) {
        this.registeredTypes.add(type);
    }

    /**
     * Removes a type from the runtime system.
     * @param type The type to be removed.
     */
    public static deregisterType(type: Record<string, string>): void {
        this.registeredTypes.delete(type);
    }

    /**
     * Checks if a type has a valid definition in the runtime system.
     * @param type The type to check.
     * @returns Boolean indicating validity.
     */
    public static hasValidDefinition(type: Record<string, string>): boolean {
        return this.registeredTypes.has(type);
    }

    /**
     * Checks if a type is registered.
     * @param type The type to check.
     * @returns Boolean indicating registration status.
     */
    static isTypeRegistered(type: any): boolean {
        return this.registeredTypes.has(type);
    }

    /**
     * Returns the properties of a given type.
     * @param type The type to inspect.
     * @returns Array of property names.
     */
    static getProperties(type: any): string[] | undefined {
        if (!this.isTypeRegistered(type)) {
            return undefined;
        }
        return Object.keys(type);
    }
}
