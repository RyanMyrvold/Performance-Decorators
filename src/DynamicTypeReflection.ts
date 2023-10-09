/**
 * Represents a constraint for types.
 */
export type TypeConstraint = Record<string, string | string[] | number | boolean | object>;

/**
 * Describes the methods an observer can implement to be notified about type changes.
 */
export interface TypeObserver {
    /** 
     * Called when a new type is added.
     * @param type - The type that was added.
     */
    onTypeAdded?(type: any): void;

    /** 
     * Called when a type is removed.
     * @param type - The type that was removed.
     */
    onTypeRemoved?(type: any): void;
}

/**
 * Provides reflection capabilities for dynamic types.
 */
export class DynamicTypeReflection {
    private static registeredTypes: Set<any> = new Set();
    private static observers: TypeObserver[] = [];

    /**
     * Registers a type with the runtime system.
     * @param type - The type to be registered.
     */
    static registerType(type: any): void {
        this.registeredTypes.add(type);
        this.notifyTypeAdded(type);
    }

    /**
     * Removes a type from the runtime system.
     * @param type - The type to be removed.
     */
    static deregisterType(type: Record<string, string>): void {
        this.registeredTypes.delete(type);
        this.notifyTypeRemoved(type);
    }

    /**
     * Adds an observer to be notified of type changes.
     * @param observer - The observer to add.
     */
    static addObserver(observer: TypeObserver): void {
        this.observers.push(observer);
    }

    /**
     * Removes a specific observer.
     * @param observer - The observer to remove.
     */
    static removeObserver(observer: TypeObserver): void {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
        }
    }

    /**
     * Checks if a type has a valid definition in the runtime system.
     * @param type - The type to check.
     * @returns Boolean indicating validity.
     */
    static hasValidDefinition(type: Record<string, string>): boolean {
        return this.registeredTypes.has(type);
    }

    /**
     * Returns the properties of a given type.
     * @param type - The type to inspect.
     * @returns Array of property names or undefined if the type is not registered.
     */
    static getProperties(type: any): string[] | undefined {
        if (!this.registeredTypes.has(type)) {
            return undefined;
        }
        return Object.keys(type);
    }

    /** Notifies all observers about a newly added type. */
    private static notifyTypeAdded(type: any): void {
        for (const observer of this.observers) {
            observer.onTypeAdded?.(type);
        }
    }

    /** Notifies all observers about a removed type. */
    private static notifyTypeRemoved(type: any): void {
        for (const observer of this.observers) {
            observer.onTypeRemoved?.(type);
        }
    }
}
